import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

export enum ScheduleStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity('payment_schedules')
export class PaymentSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  contractId: string;

  @Column({ name: 'month_number', type: 'int' })
  monthNumber: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.PENDING,
  })
  status: ScheduleStatus;

  @ManyToOne(() => Contract, (c) => c.paymentSchedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract: Contract;
}
