import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Card } from '../../cards/entity/card.entity';
import { Pack } from '../../packs/entity/pack.entity';

@Entity()
export class CardSet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  logo?: string;

  @Column({ default: '' })
  symbol?: string;

  @Column({ default: '' })
  image?: string;

  @Column({ name: 'external_id', unique: true })
  externalId: string;

  @Column({ default: '2000-01-01' })
  releaseDate: Date;

  @OneToMany(() => Card, (card) => card.cardSet)
  cards: Card[];

  @OneToMany(() => Pack, (pack) => pack.cardSet, {
    eager: true,
    onDelete: 'CASCADE',
  })
  packs: Pack[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
