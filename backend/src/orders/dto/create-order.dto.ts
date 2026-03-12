import { IsString, IsUUID, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
