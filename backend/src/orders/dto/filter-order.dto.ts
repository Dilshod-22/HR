import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';
import { OrderStatus } from '../order.entity';

export class FilterOrderDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'status' | 'quantity' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
