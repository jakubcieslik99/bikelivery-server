import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Trip, trip => trip.user)
  trips: Trip[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User');
  }
}
