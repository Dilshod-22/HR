import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';


@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const newEmployee = new this.employeeModel(createEmployeeDto);
      return await newEmployee.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Employee with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    try {
      // Validate pagination parameters
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(100, Math.max(1, Number(limit))); // Max 100 items per page
      const skip = (pageNum - 1) * limitNum;

      // Build search query
      const searchQuery = search
        ? {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { lastName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const [data, total] = await Promise.all([
        this.employeeModel
          .find(searchQuery)
          .limit(limitNum)
          .skip(skip)
          .sort({ createdAt: -1 })
          .exec(),
        this.employeeModel.countDocuments(searchQuery),
      ]);

      return {
        meta: {
          totalCount: total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch employees');
    }
  }

  async findOne(id: string) {
    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid employee ID format');
    }

    const employee = await this.employeeModel.findById(id).exec();

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid employee ID format');
    }

    try {
      const updatedEmployee = await this.employeeModel
        .findByIdAndUpdate(id, updateEmployeeDto, { new: true, runValidators: true })
        .exec();

      if (!updatedEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      return updatedEmployee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new BadRequestException('Employee with this email already exists');
      }
      throw new InternalServerErrorException('Failed to update employee');
    }
  }

  async remove(id: string) {
    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid employee ID format');
    }

    const deletedEmployee = await this.employeeModel.findByIdAndDelete(id).exec();

    if (!deletedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return {
      message: 'Employee deleted successfully',
      deletedEmployee,
    };
  }
}