import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Card } from 'src/cards/card.entity';

@Entity()
export class CardSet {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  logo?: string;

  @Column({ default: '' })
  symbol?: string;

  @Column({ unique: true })
  externalId: string;

  @Column({ default: '2000-01-01' })
  releaseDate: Date;

  @OneToMany(() => Card, (card) => card.cardSet)
  cards: Card[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
