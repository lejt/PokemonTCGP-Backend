import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Card } from 'src/cards/card.entity';
import { Pack } from 'src/packs/pack.entity';

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

  @Column({ unique: true })
  externalId: string;

  @Column({ default: '2000-01-01' })
  releaseDate: Date;

  @OneToMany(() => Card, (card) => card.cardSet)
  cards: Card[];

  @OneToMany(() => Pack, (pack) => pack.cardSet)
  packs: Pack[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
