import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'trips' })
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  start_address: string;

  @Column({ type: 'varchar' })
  destination_address: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  distance: number;

  @Column({ type: 'timestamptz' })
  date: Date;
}
