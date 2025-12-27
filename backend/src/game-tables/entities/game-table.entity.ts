import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_tables')
export class GameTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_name', length: 100 })
  tableName: string;

  @Column({ name: 'location_info', length: 100, nullable: true })
  locationInfo: string;

  @Column({ name: 'table_status', length: 100, default: 'available' })
  tableStatus: string;
}
