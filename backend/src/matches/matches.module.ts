import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UsersModule } from 'src/users/users.module';
import { TournamentsModule } from 'src/tournaments/tournaments.module';
import { GameTablesModule } from 'src/game-tables/game-tables.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    UsersModule,
    TournamentsModule,
    GameTablesModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
