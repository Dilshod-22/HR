import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';

export class FilterCustomerDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'firstName' | 'lastName' | 'fullName' | 'email' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
