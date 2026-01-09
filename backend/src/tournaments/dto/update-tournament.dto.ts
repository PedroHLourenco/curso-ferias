import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentDto } from './create-tournament.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {
  @IsOptional()
  @IsString()
  @IsIn(['open', 'started', 'finished', 'canceled'], {
    message: 'Status inválido',
  })
  tournamentStatus?: string;
}
