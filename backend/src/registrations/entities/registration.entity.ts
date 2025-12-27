import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'payment_status', length: 100, default: 'payment pending' })
  paymentStatus: string;

  @Column({ name: 'payment_ref', length: 100, nullable: true })
  paymentRef: string;

  @Column({ type: 'text', nullable: true })
  decklist: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
