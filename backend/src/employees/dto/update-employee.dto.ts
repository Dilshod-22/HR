import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['password'] as const)
) {
  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;
}
