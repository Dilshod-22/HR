import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { PaginatedResult } from '../common/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const fullName = [dto.firstName, dto.lastName ?? ''].filter(Boolean).join(' ').trim() || dto.firstName;
    const customer = this.customerRepo.create({
      ...dto,
      lastName: dto.lastName ?? '',
      fullName,
    });
    return this.customerRepo.save(customer);
  }

  async findAll(filters: FilterCustomerDto): Promise<PaginatedResult<Customer>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
    const skip = (page - 1) * limit;

    const qb = this.customerRepo.createQueryBuilder('customer');

    if (search?.trim()) {
      qb.andWhere(
        '(customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.fullName ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search OR customer.passportNumber ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    const orderBy = sortBy === 'fullName' ? 'customer.fullName' : sortBy === 'firstName' ? 'customer.firstName' : sortBy === 'lastName' ? 'customer.lastName' : `customer.${sortBy}`;
    qb.orderBy(orderBy, sortOrder)
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    if (dto.firstName != null) customer.firstName = dto.firstName;
    if (dto.lastName != null) customer.lastName = dto.lastName;
    if (dto.firstName != null || dto.lastName != null) {
      customer.fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || customer.firstName;
    }
    if (dto.phone !== undefined) customer.phone = dto.phone ?? null;
    if (dto.email !== undefined) customer.email = dto.email ?? null;
    if (dto.birthDate !== undefined) customer.birthDate = dto.birthDate ?? null;
    if (dto.passportSeries !== undefined) customer.passportSeries = dto.passportSeries ?? null;
    if (dto.passportNumber !== undefined) customer.passportNumber = dto.passportNumber ?? null;
    if (dto.address !== undefined) customer.address = dto.address ?? null;
    if (dto.region !== undefined) customer.region = dto.region ?? null;
    if (dto.district !== undefined) customer.district = dto.district ?? null;
    if (dto.workplace !== undefined) customer.workplace = dto.workplace ?? null;
    return this.customerRepo.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepo.remove(customer);
  }
}
