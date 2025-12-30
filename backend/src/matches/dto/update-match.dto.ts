import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @IsOptional()
  @IsNumber()
  winnerId?: number;

  @IsOptional()
  @IsBoolean()
  isDraw?: boolean;

  @IsOptional()
  @IsDateString()
  endTime?: Date;
}
