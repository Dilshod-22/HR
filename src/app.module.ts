import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [EmployeeModule, PositionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
