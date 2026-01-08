import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // @Inject o'rniga
import { Model, PipelineStage } from 'mongoose'; // Tipi uchun
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';


@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = new this.employeeModel(createEmployeeDto);
    return await newEmployee.save();
  }

  async findAll(page: number = 1, limit: number = 10, search: string ) {
    // 1. Nechtasini tashlab o'tishni hisoblaymiz (masalan: 2-sahifa uchun 10 tasini tashlaymiz)
    const skip = (page - 1) * limit;

    // 2. Ikkala so'rovni parallel bajarish (Vaqtni tejaydi)
    const [data, total] = await Promise.all([
      this.employeeModel
        .find({
          firstName: {
            $regex: search,
            $options: 'i',
          },
        })
        .limit(limit)
        .skip(skip)
        .exec(),
      this.employeeModel.countDocuments(),
    ]);

    // 3. Javob strukturasi
    return {
      meta: {
        totalCount: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      },
      data: data,
    };
  }

  async findOne(id: string) {
    // MongoDB ID odatda string bo'ladi
    return await this.employeeModel.findById(id).exec();
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // { new: true } - yangilangan ma'lumotni qaytarish uchun kerak
    return await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.employeeModel.findByIdAndDelete(id).exec();
  }
}