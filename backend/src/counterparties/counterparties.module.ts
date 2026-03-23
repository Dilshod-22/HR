import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counterparty } from './counterparty.entity';
import { CounterpartiesService } from './counterparties.service';
import { CounterpartiesController } from './counterparties.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Counterparty])],
  controllers: [CounterpartiesController],
  providers: [CounterpartiesService],
  exports: [CounterpartiesService, TypeOrmModule],
})
export class CounterpartiesModule {}

