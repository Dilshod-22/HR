import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InterestRatesService } from './interest-rates.service';
import { CreateInterestRateDto } from './dto/create-interest-rate.dto';
import { UpdateInterestRateDto } from './dto/update-interest-rate.dto';

@Controller('interest-rates')
export class InterestRatesController {
  constructor(private readonly service: InterestRatesService) {}

  @Post()
  create(@Body() dto: CreateInterestRateDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('latest/:termMonths')
  getLatestByTerm(@Param('termMonths') termMonths: string) {
    const term = parseInt(termMonths, 10);
    if (Number.isNaN(term) || (term !== 6 && term !== 12)) {
      return this.service.findAll();
    }
    return this.service.getLatestByTerm(term);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInterestRateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
