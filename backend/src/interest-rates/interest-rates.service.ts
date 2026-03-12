import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestRate } from './interest-rate.entity';
import { CreateInterestRateDto } from './dto/create-interest-rate.dto';
import { UpdateInterestRateDto } from './dto/update-interest-rate.dto';

@Injectable()
export class InterestRatesService {
  constructor(
    @InjectRepository(InterestRate)
    private readonly repo: Repository<InterestRate>,
  ) {}

  async create(dto: CreateInterestRateDto): Promise<InterestRate> {
    const existing = await this.repo.findOne({
      where: { year: dto.year, termMonths: dto.termMonths },
    });
    if (existing) {
      throw new ConflictException(
        `Bu yil va muddat uchun foiz allaqachon mavjud: ${dto.year}, ${dto.termMonths} oy`,
      );
    }
    const rate = this.repo.create(dto);
    return this.repo.save(rate);
  }

  async findAll(): Promise<InterestRate[]> {
    return this.repo.find({
      order: { year: 'DESC', termMonths: 'ASC' },
    });
  }

  async findOne(id: string): Promise<InterestRate> {
    const rate = await this.repo.findOne({ where: { id } });
    if (!rate) throw new NotFoundException('Foiz topilmadi');
    return rate;
  }

  async findByYearAndTerm(year: number, termMonths: number): Promise<InterestRate | null> {
    return this.repo.findOne({
      where: { year, termMonths },
    });
  }

  /** Oxirgi belgilangan foiz hujjati (berilgan muddat uchun, yil bo‘yicha eng so‘nggi) */
  async getLatestByTerm(termMonths: number): Promise<InterestRate | null> {
    return this.repo.findOne({
      where: { termMonths },
      order: { year: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateInterestRateDto): Promise<InterestRate> {
    const rate = await this.findOne(id);
    Object.assign(rate, dto);
    return this.repo.save(rate);
  }

  async remove(id: string): Promise<void> {
    const rate = await this.findOne(id);
    await this.repo.remove(rate);
  }
}
