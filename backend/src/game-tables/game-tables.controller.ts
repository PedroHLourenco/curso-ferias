import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameTablesService } from './game-tables.service';
import { CreateGameTableDto } from './dto/create-game-table.dto';
import { UpdateGameTableDto } from './dto/update-game-table.dto';

@Controller('game-tables')
export class GameTablesController {
  constructor(private readonly gameTablesService: GameTablesService) {}

  @Post()
  create(@Body() createGameTableDto: CreateGameTableDto) {
    return this.gameTablesService.create(createGameTableDto);
  }

  @Get()
  findAll() {
    return this.gameTablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameTablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameTableDto: UpdateGameTableDto) {
    return this.gameTablesService.update(+id, updateGameTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameTablesService.remove(+id);
  }
}
