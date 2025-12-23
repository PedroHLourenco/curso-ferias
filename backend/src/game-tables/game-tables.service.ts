import { Injectable } from '@nestjs/common';
import { CreateGameTableDto } from './dto/create-game-table.dto';
import { UpdateGameTableDto } from './dto/update-game-table.dto';

@Injectable()
export class GameTablesService {
  create(createGameTableDto: CreateGameTableDto) {
    return 'This action adds a new gameTable';
  }

  findAll() {
    return `This action returns all gameTables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameTable`;
  }

  update(id: number, updateGameTableDto: UpdateGameTableDto) {
    return `This action updates a #${id} gameTable`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameTable`;
  }
}
