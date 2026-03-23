import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { ProductGroup } from '../product-groups/product-group.entity';
import { StockReceiptItem } from '../stock-receipts/stock-receipt-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  purchasePrice: number;

  @Column({ type: 'int', default: 0 })
  stockQty: number;

  @Column({ type: 'uuid', nullable: true })
  groupId: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageKitId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];

  @ManyToOne(() => ProductGroup, (group) => group.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group: ProductGroup | null;

  @OneToMany(() => StockReceiptItem, (item) => item.product)
  stockReceiptItems: StockReceiptItem[];
}
