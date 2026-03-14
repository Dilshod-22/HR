import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { PaginatedResult } from '../common/pagination.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  private toFullName(firstName: string, lastName: string): string {
    return [firstName, lastName].filter(Boolean).join(' ').trim() || firstName;
  }

  async findByLogin(login: string): Promise<Employee | null> {
    return this.repo.findOne({
      where: { login: login.trim().toLowerCase() },
      select: ['id', 'firstName', 'lastName', 'login', 'passwordHash', 'createdAt'],
    });
  }

  async findById(id: string): Promise<Employee> {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Hodim topilmadi');
    return emp;
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.findByLogin(dto.login);
    if (existing) throw new ConflictException('Bu login band');
    const hash = await bcrypt.hash(dto.password, 10);
    const fullName = this.toFullName(dto.firstName, dto.lastName ?? '');
    const emp = this.repo.create({
      firstName: dto.firstName,
      lastName: dto.lastName ?? '',
      fullName,
      login: dto.login.trim().toLowerCase(),
      passwordHash: hash,
      phone: dto.phone ?? null,
      pnfl: dto.pnfl ?? null,
      birthDate: dto.birthDate ?? null,
      passportSeries: dto.passportSeries ?? null,
      passportNumber: dto.passportNumber ?? null,
    });
    return this.repo.save(emp);
  }

  async findAll(filters: FilterEmployeeDto): Promise<PaginatedResult<Employee>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('employee');

    if (search?.trim()) {
      qb.andWhere(
        '(employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.fullName ILIKE :search OR employee.login ILIKE :search OR employee.phone ILIKE :search OR employee.pnfl ILIKE :search OR employee.passportNumber ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    const orderBy = sortBy === 'fullName' ? 'employee.fullName' : `employee.${sortBy}`;
    qb.orderBy(orderBy, sortOrder).skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const emp = await this.findById(id);
    if (dto.firstName != null) emp.firstName = dto.firstName;
    if (dto.lastName != null) emp.lastName = dto.lastName;
    if (dto.firstName != null || dto.lastName != null) {
      emp.fullName = this.toFullName(emp.firstName, emp.lastName);
    }
    if (dto.phone !== undefined) emp.phone = dto.phone ?? null;
    if (dto.pnfl !== undefined) emp.pnfl = dto.pnfl ?? null;
    if (dto.birthDate !== undefined) emp.birthDate = dto.birthDate ?? null;
    if (dto.passportSeries !== undefined) emp.passportSeries = dto.passportSeries ?? null;
    if (dto.passportNumber !== undefined) emp.passportNumber = dto.passportNumber ?? null;
    if (dto.login != null) emp.login = dto.login.trim().toLowerCase();
    if (dto.password?.trim()) {
      emp.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    return this.repo.save(emp);
  }

  async remove(id: string): Promise<void> {
    const emp = await this.findById(id);
    await this.repo.remove(emp);
  }
}
