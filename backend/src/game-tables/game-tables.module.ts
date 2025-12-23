import { Module } from '@nestjs/common';
import { GameTablesService } from './game-tables.service';
import { GameTablesController } from './game-tables.controller';

@Module({
  controllers: [GameTablesController],
  providers: [GameTablesService],
})
export class GameTablesModule {}
