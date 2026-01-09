import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
  ) {}

  create(createTournamentDto: CreateTournamentDto) {
    const tournament = this.tournamentRepository.create(createTournamentDto);

    return this.tournamentRepository.save(tournament);
  }

  findAll() {
    return this.tournamentRepository.find({
      order: { tournamentDate: 'DESC' }, // filtra pelos mais recentes
    });
  }

  async findOne(id: number) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(`Torneio ${id} não encontrado`);
    }

    return tournament;
  }

  async update(id: number, updateTournamentDto: UpdateTournamentDto) {
    await this.findOne(id);
    await this.tournamentRepository.update(id, updateTournamentDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.tournamentRepository.delete(id);

    return { message: 'Torneio deletado com sucesso' };
  }
}
