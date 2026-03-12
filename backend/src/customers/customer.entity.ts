import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Contract } from '../contracts/contract.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', default: '' })
  lastName: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  fullName: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: string | null;

  @Column({ name: 'passport_series', type: 'varchar', nullable: true })
  passportSeries: string | null;

  @Column({ name: 'passport_number', type: 'varchar', nullable: true })
  passportNumber: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  region: string | null;

  @Column({ type: 'varchar', nullable: true })
  district: string | null;

  @Column({ name: 'workplace', type: 'varchar', nullable: true })
  workplace: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Contract, (c) => c.customer)
  contracts: Contract[];
}
