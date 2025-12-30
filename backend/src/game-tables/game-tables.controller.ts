import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GameTablesService } from './game-tables.service';
import { CreateGameTableDto } from './dto/create-game-table.dto';
import { UpdateGameTableDto } from './dto/update-game-table.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('game-tables')
export class GameTablesController {
  constructor(private readonly gameTablesService: GameTablesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateGameTableDto: UpdateGameTableDto,
  ) {
    return this.gameTablesService.update(+id, updateGameTableDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.gameTablesService.remove(+id);
  }
}
