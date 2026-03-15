import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { ContractItem } from './contract-item.entity';
import { PaymentSchedule } from './payment-schedule.entity';
import { Customer } from '../customers/customer.entity';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { InterestRatesModule } from '../interest-rates/interest-rates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, ContractItem, PaymentSchedule, Customer]),
    InterestRatesModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
