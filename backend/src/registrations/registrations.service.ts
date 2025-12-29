import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Registration } from './entities/registration.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TournamentsService } from 'src/tournaments/tournaments.service';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    private usersService: UsersService,
    private tournamentsService: TournamentsService,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    const { userId, tournamentId, decklist } = createRegistrationDto;

    const user = await this.usersService.findOne(userId); // busca usuário
    const tournament = await this.tournamentsService.findOne(tournamentId); // busca torneio

    // verifica se o torneio já está cheio
    const currentRegistration = await this.registrationRepository.count({
      where: { tournament: { id: tournamentId } },
    });

    if (currentRegistration >= tournament.maxPlayers) {
      throw new ConflictException('Número máximo de jogadores já atingido');
    }

    // verifica se user já está inscrito
    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        user: { id: userId },
        tournament: { id: tournamentId },
      },
    });

    if (existingRegistration) {
      throw new ConflictException('Usuário já está inscrito nesse torneio');
    }

    const registration = await this.registrationRepository.create({
      user,
      tournament,
      decklist,
      paymentStatus: 'payment pending',
    });

    return this.registrationRepository.save(registration);
  }

  findAll() {
    return this.registrationRepository.find({
      relations: ['user', 'tournament'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: ['user', 'tournament'],
    });

    if (!registration) {
      throw new NotFoundException(`Inscrição ${id} não encontrada`);
    }

    return registration;
  }

  async update(id: number, updateRegistrationDto: UpdateRegistrationDto) {
    await this.findOne(id);

    const { userId, tournamentId, ...dataToUpdate } =
      updateRegistrationDto as any;

    await this.registrationRepository.update(id, dataToUpdate);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.registrationRepository.delete(id);

    return { message: 'Inscrição removida com sucesso' };
  }
}
