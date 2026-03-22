import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  ValidateIf,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from '../contract.entity';
import { CreateContractItemDto } from './create-contract-item.dto';

export class UpdateContractDto {
  @IsOptional()
  @IsString()
  branch?: string | null;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @IsOptional()
  @ValidateIf((_, v) => v != null)
  @IsUUID()
  employeeId?: string | null;

  @IsOptional()
  @IsUUID()
  guarantorCustomerId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(6)
  @Max(12)
  termMonths?: number;

  @IsOptional()
  @IsUUID()
  interestRateId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateContractItemDto)
  items?: CreateContractItemDto[];
}
