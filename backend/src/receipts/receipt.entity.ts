import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Contract } from '../contracts/contract.entity';
import { PaymentSchedule } from '../contracts/payment-schedule.entity';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  contractId: string;

  @Column('uuid')
  paymentScheduleId: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column({ name: 'receipt_number', type: 'varchar', unique: true })
  receiptNumber: string;

  @Column({ name: 'paid_at', type: 'timestamp' })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Contract, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract: Contract;

  @ManyToOne(() => PaymentSchedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentScheduleId' })
  paymentSchedule: PaymentSchedule;
}
