import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../entity/user.entity';
import { Card } from 'src/cards/entity/card.entity';

@Entity()
export class UserCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userCards)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Card, (card) => card.userCards)
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @Column({ default: 1 })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
