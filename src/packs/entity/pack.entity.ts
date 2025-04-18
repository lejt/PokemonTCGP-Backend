import { CardSet } from '../../card-sets/entity/card-set.entity';
import { Card } from '../../cards/entity/card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  image?: string;

  @ManyToOne(() => CardSet, (cardSet) => cardSet.packs, { onDelete: 'CASCADE' })
  cardSet: CardSet;

  @OneToMany(() => Card, (card) => card.pack)
  cards: Card[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
