import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGameTableDto {
  @IsNumber({}, { message: 'Número da mesa deve ser um valor numérico' })
  @IsNotEmpty({ message: 'Número da mesa é obrigatório' })
  tableNumber: string;

  @IsOptional()
  @IsString()
  tableStatus?: string;
}
