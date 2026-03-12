import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';

export class FilterProductDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'price' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
