import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StockReceiptsService } from './stock-receipts.service';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';

@Controller('stock-receipts')
export class StockReceiptsController {
  constructor(private readonly service: StockReceiptsService) {}

  @Post()
  create(@Body() dto: CreateStockReceiptDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('productId') productId?: string,
  ) {
    return this.service.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      fromDate,
      toDate,
      productId,
    });
  }

  @Get('report/stock')
  stockReport(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('productId') productId?: string,
    @Query('groupId') groupId?: string,
  ) {
    return this.service.stockReport({ fromDate, toDate, productId, groupId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}

