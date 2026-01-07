import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // MongoDB URL manzilingizni kiriting
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest_db'),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
