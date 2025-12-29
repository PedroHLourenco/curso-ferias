import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTournamentDto {
  @IsString({ message: 'Nome do torneio deve ser um texto' })
  @IsNotEmpty({ message: 'Nome do torneio é obrigatório' })
  @MaxLength(100)
  tournamentName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  format?: string; // 'suiço' | 'mata-mata'

  @IsDateString(
    {},
    { message: 'Data do torneio deve estar no formato AAAA-MM-DD' },
  )
  @IsNotEmpty({ message: 'Data do torneio é obrigatória' })
  tournamentDate: Date;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'A taxa de entrada deve ser um valor numérico' },
  )
  @Min(0, { message: 'Taxa de Inscrição não pode ser negativa' })
  entryFee: number;

  @IsNumber()
  @Min(2, { message: 'No mínimo 2 jogadores por torneio' })
  @IsOptional()
  maxPlayers?: number;
}
