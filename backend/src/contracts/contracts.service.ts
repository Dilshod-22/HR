import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from './contract.entity';
import { ContractItem } from './contract-item.entity';
import { PaymentSchedule, ScheduleStatus } from './payment-schedule.entity';
import { Customer } from '../customers/customer.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InterestRatesService } from '../interest-rates/interest-rates.service';
import { addMonths, format } from 'date-fns';

function customerDisplayName(c: Customer): string {
  const name = c.fullName?.trim() || [c.firstName, c.lastName].filter(Boolean).join(' ').trim();
  return name || '—';
}

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(ContractItem)
    private readonly itemRepo: Repository<ContractItem>,
    @InjectRepository(PaymentSchedule)
    private readonly scheduleRepo: Repository<PaymentSchedule>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly interestRatesService: InterestRatesService,
  ) {}

  async create(dto: CreateContractDto): Promise<Contract> {
    if (!dto.items?.length) {
      throw new BadRequestException('Kamida bitta mahsulot tanlangan bo‘lishi kerak');
    }

    const interestRate = await this.interestRatesService.findOne(dto.interestRateId);
    if (interestRate.termMonths !== dto.termMonths) {
      throw new BadRequestException('Foiz muddati shartnoma muddati bilan mos kelishi kerak');
    }

    const productTotal = dto.items.reduce(
      (sum, i) => sum + Number(i.quantity) * Number(i.unitPrice),
      0,
    );
    const percentage = Number(interestRate.percentage);
    const interestAmount = (productTotal * percentage) / 100;
    const totalAmount = productTotal + interestAmount;
    const monthlyAmount = totalAmount / dto.termMonths;

    const guarantor = await this.customerRepo.findOne({ where: { id: dto.guarantorCustomerId } });
    if (!guarantor) {
      throw new BadRequestException('Kafil (mijoz) topilmadi');
    }
    const guarantorName = customerDisplayName(guarantor);

    const contract = this.contractRepo.create({
      customerId: dto.customerId,
      employeeId: dto.employeeId ?? null,
      guarantorCustomerId: dto.guarantorCustomerId,
      guarantorName,
      termMonths: dto.termMonths,
      interestRateId: dto.interestRateId,
      productTotal,
      interestAmount,
      totalAmount,
      monthlyAmount,
      status: ContractStatus.ACTIVE,
      branch: dto.branch ?? null,
    });
    const saved = await this.contractRepo.save(contract);

    for (const item of dto.items) {
      const ci = this.itemRepo.create({
        contractId: saved.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
      await this.itemRepo.save(ci);
    }

    const startDate = new Date();
    for (let m = 1; m <= dto.termMonths; m++) {
      const dueDate = addMonths(startDate, m);
      const row = this.scheduleRepo.create({
        contractId: saved.id,
        monthNumber: m,
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        amount: Math.round(monthlyAmount * 100) / 100,
        status: ScheduleStatus.PENDING,
      });
      await this.scheduleRepo.save(row);
    }

    return this.findOne(saved.id);
  }

  async findAll(filters: { page?: number; limit?: number; customerId?: string; status?: ContractStatus }) {
    const { page = 1, limit = 10, customerId, status } = filters;
    const skip = (page - 1) * limit;

    const qb = this.contractRepo
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.customer', 'customer')
      .leftJoinAndSelect('contract.employee', 'employee')
      .leftJoinAndSelect('contract.guarantor', 'guarantor')
      .leftJoinAndSelect('contract.interestRate', 'interestRate')
      .orderBy('contract.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (customerId) qb.andWhere('contract.customerId = :customerId', { customerId });
    if (status) qb.andWhere('contract.status = :status', { status });

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractRepo.findOne({
      where: { id },
      relations: ['customer', 'employee', 'guarantor', 'interestRate', 'items', 'items.product', 'paymentSchedule'],
    });
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');
    return contract;
  }

  async updateStatus(id: string, status: ContractStatus): Promise<Contract> {
    const contract = await this.findOne(id);
    contract.status = status;
    return this.contractRepo.save(contract);
  }

  async update(id: string, dto: UpdateContractDto): Promise<Contract> {
    await this.contractRepo.manager.transaction(async (em) => {
      const contr = await em.findOne(Contract, { where: { id } });
      if (!contr) throw new NotFoundException('Shartnoma topilmadi');

      const itemRepo = em.getRepository(ContractItem);
      const scheduleRepo = em.getRepository(PaymentSchedule);
      const customerRepository = em.getRepository(Customer);

      const hasFinancial =
        (dto.items !== undefined && dto.items.length > 0) ||
        dto.termMonths !== undefined ||
        dto.interestRateId !== undefined;

      if (hasFinancial) {
        const schedules = await scheduleRepo.find({ where: { contractId: id } });
        if (schedules.some((s) => s.status === ScheduleStatus.PAID)) {
          throw new BadRequestException(
            'To‘langan oylar mavjud. Mahsulotlar, muddat yoki foiz stavkasini o‘zgartirib bo‘lmaydi.',
          );
        }

        let itemsPayload: { productId: string; quantity: number; unitPrice: number }[];
        if (dto.items?.length) {
          itemsPayload = dto.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
          }));
        } else {
          const existingItems = await itemRepo.find({ where: { contractId: id } });
          if (!existingItems.length) {
            throw new BadRequestException('Mahsulotlar topilmadi');
          }
          itemsPayload = existingItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
          }));
        }

        const termMonths = dto.termMonths ?? contr.termMonths;
        const interestRateId = dto.interestRateId ?? contr.interestRateId;

        const interestRate = await this.interestRatesService.findOne(interestRateId);
        if (interestRate.termMonths !== termMonths) {
          throw new BadRequestException('Foiz muddati shartnoma muddati bilan mos kelishi kerak');
        }

        const productTotal = itemsPayload.reduce(
          (sum, i) => sum + Number(i.quantity) * Number(i.unitPrice),
          0,
        );
        const percentage = Number(interestRate.percentage);
        const interestAmount = (productTotal * percentage) / 100;
        const totalAmount = productTotal + interestAmount;
        const monthlyAmount = totalAmount / termMonths;

        if (dto.items?.length) {
          await itemRepo.delete({ contractId: id });
          for (const item of dto.items) {
            await itemRepo.save(
              itemRepo.create({
                contractId: id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              }),
            );
          }
        }

        await scheduleRepo.delete({ contractId: id });
        const startDate = contr.createdAt ? new Date(contr.createdAt) : new Date();
        for (let m = 1; m <= termMonths; m++) {
          const dueDate = addMonths(startDate, m);
          await scheduleRepo.save(
            scheduleRepo.create({
              contractId: id,
              monthNumber: m,
              dueDate: format(dueDate, 'yyyy-MM-dd'),
              amount: Math.round(monthlyAmount * 100) / 100,
              status: ScheduleStatus.PENDING,
            }),
          );
        }

        contr.termMonths = termMonths;
        contr.interestRateId = interestRateId;
        contr.productTotal = productTotal;
        contr.interestAmount = interestAmount;
        contr.totalAmount = totalAmount;
        contr.monthlyAmount = monthlyAmount;
      }

      if (dto.branch !== undefined) contr.branch = dto.branch;
      if (dto.status !== undefined) contr.status = dto.status;
      if (dto.employeeId !== undefined) contr.employeeId = dto.employeeId;
      if (dto.guarantorCustomerId !== undefined) {
        const guarantor = await customerRepository.findOne({ where: { id: dto.guarantorCustomerId } });
        if (!guarantor) {
          throw new BadRequestException('Kafil (mijoz) topilmadi');
        }
        contr.guarantorCustomerId = dto.guarantorCustomerId;
        contr.guarantorName = customerDisplayName(guarantor);
      }

      await em.save(contr);
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const contract = await this.contractRepo.findOne({ where: { id } });
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');
    await this.contractRepo.remove(contract);
  }
}
