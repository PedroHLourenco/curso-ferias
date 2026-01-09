import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameTableDto } from './dto/create-game-table.dto';
import { UpdateGameTableDto } from './dto/update-game-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameTable } from './entities/game-table.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameTablesService {
  constructor(
    @InjectRepository(GameTable)
    private gameTablesRepository: Repository<GameTable>,
  ) {}

  async create(createGameTableDto: CreateGameTableDto) {
    const existingTable = await this.gameTablesRepository.findOne({
      where: { tableNumber: createGameTableDto.tableNumber },
    });

    if (existingTable) {
      throw new ConflictException(
        `A mesa ${createGameTableDto.tableNumber} já existe`,
      );
    }

    const table = await this.gameTablesRepository.create(createGameTableDto);

    return this.gameTablesRepository.save(table);
  }

  findAll() {
    return this.gameTablesRepository.find({ order: { tableNumber: 'ASC' } }); // ordem crescente
  }

  async findOne(id: number) {
    const table = await this.gameTablesRepository.findOne({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Mesa com ID ${id} não encontrada`);
    }

    return table;
  }

  async update(id: number, updateGameTableDto: UpdateGameTableDto) {
    await this.findOne(id);
    await this.gameTablesRepository.update(id, updateGameTableDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.gameTablesRepository.delete(id);

    return { message: `Mesa removida com sucesso` };
  }
}
