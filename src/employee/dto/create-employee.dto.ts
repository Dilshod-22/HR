import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, IsBoolean, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Invalid phone number format' })
  phone: string;

  @IsDateString({}, { message: 'Invalid date format for date of birth' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @IsEnum(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Address must not exceed 200 characters' })
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(['full-time', 'parttime', 'contract'], { message: 'Employment type must be full-time, parttime, or contract' })
  @IsOptional()
  employmentType?: string;

  @IsEnum(['active', 'inactive'], { message: 'Employment status must be active or inactive' })
  @IsOptional()
  employmentStatus?: string;

  @IsDateString({}, { message: 'Invalid date format for hire date' })
  @IsOptional()
  hireDate?: string;

  @IsDateString({}, { message: 'Invalid date format for termination date' })
  @IsOptional()
  terminationDate?: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Emergency contact name must not exceed 100 characters' })
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Invalid emergency contact phone format' })
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Emergency contact relation must not exceed 50 characters' })
  emergencyContactRelation?: string;

  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsNotEmpty({ message: 'isActive is required' })
  isActive: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}