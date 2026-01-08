import { Controller, Get, Post, Body, Patch, Param, Delete ,Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
// import { Query } from 'mongoose';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll(@Query() query: any) {
    const { page, limit, search, sort, department, position, employmentStatus, employmentType } = query;
    return this.employeeService.findAll(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // + belgisini olib tashlaymiz, chunki MongoDB ID-si string
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}