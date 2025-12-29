import { Module } from '@nestjs/common';
import { GameTablesService } from './game-tables.service';
import { GameTablesController } from './game-tables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameTable } from './entities/game-table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameTable])],
  controllers: [GameTablesController],
  providers: [GameTablesService],
  exports: [GameTablesService],
})
export class GameTablesModule {}
