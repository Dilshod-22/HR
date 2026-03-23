import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Counterparty } from '../counterparties/counterparty.entity';
import { Employee } from '../employees/employee.entity';
import { StockReceiptItem } from './stock-receipt-item.entity';

@Entity('stock_receipts')
export class StockReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  counterpartyId: string;

  @Column({ type: 'uuid', nullable: true })
  employeeId: string | null;

  @Column({ type: 'date' })
  receiptDate: string;

  @Column({ type: 'varchar', nullable: true })
  note: string | null;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Counterparty, (c) => c.receipts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'counterpartyId' })
  counterparty: Counterparty;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee | null;

  @OneToMany(() => StockReceiptItem, (item) => item.receipt, { cascade: true })
  items: StockReceiptItem[];
}

