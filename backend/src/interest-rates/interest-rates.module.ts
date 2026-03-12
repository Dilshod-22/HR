import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestRate } from './interest-rate.entity';
import { InterestRatesService } from './interest-rates.service';
import { InterestRatesController } from './interest-rates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InterestRate])],
  controllers: [InterestRatesController],
  providers: [InterestRatesService],
  exports: [InterestRatesService],
})
export class InterestRatesModule {}
