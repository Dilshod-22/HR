import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockReceiptItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  purchasePrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  salePrice?: number;
}

export class CreateStockReceiptDto {
  @IsUUID()
  counterpartyId: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsDateString()
  receiptDate: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStockReceiptItemDto)
  items: CreateStockReceiptItemDto[];
}

