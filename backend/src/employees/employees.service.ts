import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async findByLogin(login: string): Promise<Employee | null> {
    return this.repo.findOne({ where: { login: login.trim().toLowerCase() } });
  }

  async findById(id: string): Promise<Employee> {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Hodim topilmadi');
    return emp;
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async create(dto: { firstName: string; lastName: string; login: string; password: string }): Promise<Employee> {
    const existing = await this.findByLogin(dto.login);
    if (existing) throw new ConflictException('Bu login band');
    const hash = await bcrypt.hash(dto.password, 10);
    const emp = this.repo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      login: dto.login.trim().toLowerCase(),
      passwordHash: hash,
    });
    return this.repo.save(emp);
  }

  async findAll(): Promise<Employee[]> {
    return this.repo.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
      select: ['id', 'firstName', 'lastName', 'login', 'createdAt'],
    });
  }

  async remove(id: string): Promise<void> {
    const emp = await this.findById(id);
    await this.repo.remove(emp);
  }
}
