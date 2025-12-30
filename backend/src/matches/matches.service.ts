import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TournamentsService } from 'src/tournaments/tournaments.service';
import { GameTablesService } from 'src/game-tables/game-tables.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private usersService: UsersService,
    private tournamentsService: TournamentsService,
    private gameTablesService: GameTablesService,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { tournamentId, tableId, player1Id, player2Id, round, startTime } =
      createMatchDto;

    // garante que um jogador não enfrente a si mesmo
    if (player1Id === player2Id) {
      throw new BadRequestException(
        'Um jogador não pode jogar contra si mesmo',
      );
    }

    const tournament = await this.tournamentsService.findOne(tournamentId);
    const table = await this.gameTablesService.findOne(tableId);
    const player1 = await this.usersService.findOne(player1Id);
    const player2 = await this.usersService.findOne(player2Id);

    const match = this.matchRepository.create({
      tournament,
      table,
      player1,
      player2,
      round,
      startTime: startTime || new Date(),
    });

    return this.matchRepository.save(match);
  }

  findAll() {
    return this.matchRepository.find({
      relations: ['tournament', 'table', 'player1', 'player2', 'winner'],
      order: { startTime: 'DESC' },
    });
  }

  async findOne(id: number) {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ['tournament', 'table', 'player1', 'player2', 'winner'],
    });

    if (!match) {
      throw new NotFoundException(`Partida ${id} não encontrada`);
    }

    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.findOne(id);

    // define um vencedor
    if (updateMatchDto.winnerId) {
      if (
        updateMatchDto.winnerId !== match.player1.id &&
        updateMatchDto.winnerId !== match.player2.id
      ) {
        throw new BadRequestException(
          'O vencedor deve ser um dos participantes',
        );
      }

      const winner = await this.usersService.findOne(updateMatchDto.winnerId);
      match.winner = winner as User;
    }

    if (updateMatchDto.isDraw !== undefined) {
      match.isDraw = updateMatchDto.isDraw;
    }

    if (updateMatchDto.endTime) {
      match.endTime = new Date(updateMatchDto.endTime);
    }

    if ((match.winner || match.isDraw) && !match.endTime) {
      match.endTime = new Date();
    }

    return this.matchRepository.save(match);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.matchRepository.delete(id);

    return { message: 'Partida removida com sucesso' };
  }
}
