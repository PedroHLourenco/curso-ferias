import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from './entities/registration.entity';
import { UsersModule } from 'src/users/users.module';
import { TournamentsModule } from 'src/tournaments/tournaments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration]),
    UsersModule,
    TournamentsModule,
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
