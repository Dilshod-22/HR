import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  @MinLength(2)
  login: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  pnfl?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  passportSeries?: string;

  @IsOptional()
  @IsString()
  passportNumber?: string;
}
