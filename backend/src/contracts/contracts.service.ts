import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from './contract.entity';
import { ContractItem } from './contract-item.entity';
import { PaymentSchedule, ScheduleStatus } from './payment-schedule.entity';
import { Customer } from '../customers/customer.entity';
import { CreateContractDto } from './dto/create-contract.dto';
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
}
