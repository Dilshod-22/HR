import { IsString, IsUUID, IsInt, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContractItemDto } from './create-contract-item.dto';

export class CreateContractDto {
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsString()
  guarantorName: string;

  @IsOptional()
  @IsString()
  guarantorPhone?: string;

  @IsInt()
  @Type(() => Number)
  @Min(6)
  termMonths: number;

  @IsUUID()
  interestRateId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContractItemDto)
  items: CreateContractItemDto[];
}
