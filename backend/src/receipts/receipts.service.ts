import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './receipt.entity';
import { PaymentSchedule, ScheduleStatus } from '../contracts/payment-schedule.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    @InjectRepository(PaymentSchedule)
    private readonly scheduleRepo: Repository<PaymentSchedule>,
  ) {}

  async create(dto: CreateReceiptDto): Promise<Receipt> {
    const { contractId, paymentScheduleId, amount, paymentMethod, notes } = dto;
    const schedule = await this.scheduleRepo.findOne({
      where: { id: paymentScheduleId, contractId },
      relations: ['contract'],
    });
    if (!schedule) throw new NotFoundException('To‘lov qatori topilmadi');
    if (schedule.status === ScheduleStatus.PAID) {
      throw new BadRequestException('Bu oy allaqachon to‘langan');
    }

    const receiptNumber = await this.generateReceiptNumber();
    const paidAt = new Date();

    const receipt = this.receiptRepo.create({
      contractId,
      paymentScheduleId,
      amount,
      receiptNumber,
      paidAt,
      paymentMethod: paymentMethod ?? null,
      notes: notes ?? null,
    });
    await this.receiptRepo.save(receipt);

    schedule.status = ScheduleStatus.PAID;
    schedule.paidAt = paidAt;
    await this.scheduleRepo.save(schedule);

    return this.receiptRepo.findOne({
      where: { id: receipt.id },
      relations: ['contract', 'paymentSchedule'],
    }) as Promise<Receipt>;
  }

  private async generateReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.receiptRepo.count();
    return `KV-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  async findAll(filters: { page?: number; limit?: number; contractId?: string }) {
    const { page = 1, limit = 20, contractId } = filters;
    const skip = (page - 1) * limit;

    const qb = this.receiptRepo
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.contract', 'contract')
      .leftJoinAndSelect('contract.customer', 'customer')
      .leftJoinAndSelect('contract.employee', 'employee')
      .leftJoinAndSelect('receipt.paymentSchedule', 'paymentSchedule')
      .orderBy('receipt.paidAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (contractId) qb.andWhere('receipt.contractId = :contractId', { contractId });

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { id },
      relations: ['contract', 'contract.customer', 'contract.employee', 'paymentSchedule'],
    });
    if (!receipt) throw new NotFoundException('Kvitansiya topilmadi');
    return receipt;
  }

  async update(id: string, dto: UpdateReceiptDto): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({ where: { id } });
    if (!receipt) throw new NotFoundException('Kvitansiya topilmadi');
    if (dto.paymentMethod !== undefined) receipt.paymentMethod = dto.paymentMethod;
    if (dto.notes !== undefined) receipt.notes = dto.notes;
    await this.receiptRepo.save(receipt);
    return this.findOne(id);
  }
}
