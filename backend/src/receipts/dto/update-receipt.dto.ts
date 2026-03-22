import { IsString, IsOptional, IsIn, ValidateIf } from 'class-validator';

export class UpdateReceiptDto {
  @IsOptional()
  @ValidateIf((o) => o.paymentMethod != null)
  @IsIn(['cash', 'card', 'bank'])
  paymentMethod?: 'cash' | 'card' | 'bank' | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
