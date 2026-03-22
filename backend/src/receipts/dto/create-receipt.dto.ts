import { IsString, IsUUID, IsNumber, IsOptional, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReceiptDto {
  @IsUUID()
  contractId: string;

  @IsUUID()
  paymentScheduleId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  @IsIn(['cash', 'card', 'bank'])
  paymentMethod?: 'cash' | 'card' | 'bank';

  @IsOptional()
  @IsString()
  notes?: string;
}
