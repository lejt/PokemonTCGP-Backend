import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardSet } from 'src/card-set/card-set.entity';
import { Energy } from './card.model';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  image?: string;

  @Column({ default: 0 })
  hp?: number;

  @Column('simple-array', { default: [] })
  types?: string[]; // TODO: should be ENUM

  @Column({ default: '' })
  stage?: string; // TODO: should be ENUM

  @Column()
  rarity: string; // TODO: should be ENUM

  @Column({ default: '' })
  suffix?: string; // TODO: should be ENUM or one value 'EX'

  @Column('json')
  variants: {
    firstEdition: boolean;
    holo: boolean;
    normal: boolean;
    reverse: boolean;
    wPromo: boolean;
  };

  @Column('json', { default: [] })
  attacks?: {
    name: string;
    effect: string;
    damage: number;
    cost: string[];
  }[];

  @Column({ default: 0 })
  retreat?: number;

  @Column('json', { default: [] })
  weakness?: {
    type: Energy;
    value: string;
  }[];

  @Column()
  category: string;

  @Column()
  illustrator: string;

  @Column({ default: '' })
  description?: string;

  @Column({ unique: true })
  externalId?: string;

  // TODO: decide if needed - eager: true allows cardSet to be auto loaded as well on Card load
  @ManyToOne(() => CardSet, (cardSet) => cardSet.cards, { eager: true })
  @JoinColumn()
  cardSet: CardSet;

  @Column({ default: '' })
  effect?: string;

  @Column({ default: '' })
  trainerType?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
