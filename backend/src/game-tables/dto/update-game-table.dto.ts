import { PartialType } from '@nestjs/mapped-types';
import { CreateGameTableDto } from './create-game-table.dto';

export class UpdateGameTableDto extends PartialType(CreateGameTableDto) {}
