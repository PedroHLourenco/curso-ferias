import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRegistrationDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id do torneio é obrigatório' })
  tournamentId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  userId: number;

  @IsOptional()
  @IsString()
  decklist?: string;
}
