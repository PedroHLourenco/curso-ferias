import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tournament_name', length: 100 })
  tournamentName: string;

  @Column({ name: 'format', length: 100, nullable: true })
  format: string;

  @Column({ name: 'tournament_date', type: 'timestamp' })
  tournamentDate: Date;

  @Column({ name: 'entry_fee', type: 'decimal', precision: 10, scale: 2 })
  entryFee: number;

  @Column({ name: 'max_players', default: 32 })
  maxPlayers: number;

  @Column({ name: 'tournament_status', length: 100, default: 'open' })
  tournamentStatus: string;
}
