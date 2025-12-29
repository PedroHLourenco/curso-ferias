import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_tables')
export class GameTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_number', unique: true })
  tableNumber: string;

  @Column({ name: 'table_status', length: 100, default: 'available' })
  tableStatus: string;
}
