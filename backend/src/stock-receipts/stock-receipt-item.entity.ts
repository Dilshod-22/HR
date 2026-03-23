import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockReceipt } from './stock-receipt.entity';
import { Product } from '../products/product.entity';

@Entity('stock_receipt_items')
export class StockReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  receiptId: string;

  @Column('uuid')
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  purchasePrice: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  salePrice: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  lineTotal: number;

  @ManyToOne(() => StockReceipt, (r) => r.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiptId' })
  receipt: StockReceipt;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Product;
}

