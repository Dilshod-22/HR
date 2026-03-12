import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { Employee } from '../employees/employee.entity';
import { InterestRate } from '../interest-rates/interest-rate.entity';
import { ContractItem } from './contract-item.entity';
import { PaymentSchedule } from './payment-schedule.entity';

export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column({ name: 'employeeId', type: 'uuid', nullable: true })
  employeeId: string | null;

  @Column({ name: 'guarantor_name', type: 'varchar' })
  guarantorName: string;

  @Column({ name: 'guarantor_phone', type: 'varchar', nullable: true })
  guarantorPhone: string | null;

  @Column({ name: 'term_months', type: 'int' })
  termMonths: number;

  @Column('uuid')
  interestRateId: string;

  @Column({ name: 'product_total', type: 'decimal', precision: 14, scale: 2 })
  productTotal: number;

  @Column({ name: 'interest_amount', type: 'decimal', precision: 14, scale: 2 })
  interestAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 14, scale: 2 })
  totalAmount: number;

  @Column({ name: 'monthly_amount', type: 'decimal', precision: 14, scale: 2 })
  monthlyAmount: number;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, (c) => c.contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Employee, (e) => e.contracts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee | null;

  @ManyToOne(() => InterestRate, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'interestRateId' })
  interestRate: InterestRate;

  @OneToMany(() => ContractItem, (item) => item.contract, { cascade: true })
  items: ContractItem[];

  @OneToMany(() => PaymentSchedule, (s) => s.contract, { cascade: true })
  paymentSchedule: PaymentSchedule[];
}
