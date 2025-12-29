import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationDto } from './create-registration.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  paymentRef?: string; // id do pagamento externo
}
