import { IsInt, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInterestRateDto {
  @IsInt()
  @Type(() => Number)
  @Min(2000)
  @Max(2100)
  year: number;

  @IsInt()
  @Type(() => Number)
  @Min(6)
  @Max(12)
  termMonths: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  percentage: number;
}
