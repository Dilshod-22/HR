import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { InterestRatesModule } from './interest-rates/interest-rates.module';
import { ContractsModule } from './contracts/contracts.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { EmployeesModule } from './employees/employees.module';
import { AuthModule } from './auth/auth.module';
import { InitialSchema1739112000000 } from './migrations/1739112000000-InitialSchema';
import { ContractsAndCustomers1739120000000 } from './migrations/1739120000000-ContractsAndCustomers';
import { EmployeesAndCustomerNames1739130000000 } from './migrations/1739130000000-EmployeesAndCustomerNames';
import { EmployeeExtraFields1739140000000 } from './migrations/1739140000000-EmployeeExtraFields';
import { ContractBranch1739150000000 } from './migrations/1739150000000-ContractBranch';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'caboose.proxy.rlwy.net',
      port: +(process.env.DB_PORT || 50084),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'AtubJXGofjbxXOktxxmfwhEuSiFJOANF',
      database: process.env.DB_DATABASE || 'railway',
      autoLoadEntities: true,
      synchronize: false,
      migrations: [InitialSchema1739112000000, ContractsAndCustomers1739120000000, EmployeesAndCustomerNames1739130000000, EmployeeExtraFields1739140000000, ContractBranch1739150000000],
      migrationsRun: true,
    }),
    ProductsModule,
    CustomersModule,
    OrdersModule,
    InterestRatesModule,
    ContractsModule,
    ReceiptsModule,
    EmployeesModule,
    AuthModule,
  ],
})
export class AppModule {}
