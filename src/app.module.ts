import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasicAuthGuard } from './app.basicauthGuard';
import { EmployeeModule } from './employee/employee.module';
import { PositionModule } from './position/position.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [EmployeeModule, PositionModule, DepartmentModule],
  controllers: [AppController],
  providers: [AppService, BasicAuthGuard],
})
export class AppModule {}
