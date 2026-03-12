import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { ContractStatus } from './contract.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtUser } from '../auth/current-user.decorator';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateContractDto, @CurrentUser() user: JwtUser) {
    return this.service.create({ ...dto, employeeId: dto.employeeId ?? user.id });
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('customerId') customerId?: string,
    @Query('status') status?: ContractStatus,
  ) {
    return this.service.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      customerId,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
