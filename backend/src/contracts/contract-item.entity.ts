import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { Product } from '../products/product.entity';

@Entity('contract_items')
export class ContractItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  contractId: string;

  @Column('uuid')
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @ManyToOne(() => Contract, (c) => c.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract: Contract;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
