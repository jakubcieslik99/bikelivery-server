import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  RelationId,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_address: string;

  @Column()
  destination_address: string;

  @Column()
  date: Date;

  @Column()
  distance: number;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => User, user => user.trips)
  user: User;

  @RelationId((trip: Trip) => trip.user)
  userId: number;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Trip with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Trip with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Trip');
  }
}
