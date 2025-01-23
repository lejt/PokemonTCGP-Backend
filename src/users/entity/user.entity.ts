import { Card } from '../../cards/entity/card.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // relationship to cards
  @ManyToMany(() => Card, (card) => card.owners, { cascade: true })
  @JoinTable()
  ownedCards: Card[];
}
