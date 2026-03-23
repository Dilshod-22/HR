import { IsOptional, IsString } from 'class-validator';

export class CreateCounterpartyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  tin?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

