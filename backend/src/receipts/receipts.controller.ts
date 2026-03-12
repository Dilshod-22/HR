import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Post()
  create(
    @Body() body: { contractId: string; paymentScheduleId: string; amount: number },
  ) {
    return this.service.create(
      body.contractId,
      body.paymentScheduleId,
      body.amount,
    );
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('contractId') contractId?: string,
  ) {
    return this.service.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      contractId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
