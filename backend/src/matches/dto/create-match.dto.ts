import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateMatchDto {
  @IsNumber()
  @IsNotEmpty()
  tournamentId: number;

  @IsNumber()
  @IsNotEmpty()
  tableId: number;

  @IsNumber()
  @IsNotEmpty()
  player1Id: number;

  @IsNumber()
  @IsNotEmpty()
  player2Id: number;

  @IsNumber()
  @IsNotEmpty()
  round: number;

  @IsOptional()
  @IsDateString()
  startTime?: Date;
}
