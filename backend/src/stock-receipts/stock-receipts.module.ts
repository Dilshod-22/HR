import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockReceipt } from './stock-receipt.entity';
import { StockReceiptItem } from './stock-receipt-item.entity';
import { StockReceiptsService } from './stock-receipts.service';
import { StockReceiptsController } from './stock-receipts.controller';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockReceipt, StockReceiptItem, Product])],
  providers: [StockReceiptsService],
  controllers: [StockReceiptsController],
})
export class StockReceiptsModule {}

