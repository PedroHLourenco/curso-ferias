import { GameTable } from 'src/game-tables/entities/game-table.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @ManyToOne(() => GameTable)
  @JoinColumn({ name: 'table_id' })
  table: GameTable;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player1_id' })
  player1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player2_id' })
  player2: User;

  @Column({ name: 'round' })
  round: number;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'winner_id' })
  winner: User;

  @Column({ name: 'is_draw', default: false })
  isDraw: boolean;
}
