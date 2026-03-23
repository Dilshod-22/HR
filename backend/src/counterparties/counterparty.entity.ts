import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockReceipt } from '../stock-receipts/stock-receipt.entity';

@Entity('counterparties')
export class Counterparty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  tin: string | null;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockReceipt, (receipt) => receipt.counterparty)
  receipts: StockReceipt[];
}

