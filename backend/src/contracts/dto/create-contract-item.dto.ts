import { IsUUID, IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  unitPrice: number;
}
