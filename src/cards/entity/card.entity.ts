import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardSet } from '../../card-sets/entity/card-set.entity';
import {
  CardNameSuffix,
  Category,
  Energy,
  Rarity,
  Stage,
  TrainerType,
} from '../interfaces/card.enum';
import { Pack } from '../../packs/entity/pack.entity';
import { UserCard } from '../../user-cards/entity/user-card.entity';

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
  types?: Energy[];

  @Column({ default: '' })
  stage?: Stage;

  @Column()
  rarity: Rarity;

  @Column({ default: '' })
  suffix?: CardNameSuffix;

  @Column('json', { default: [] })
  attacks?: {
    name: string;
    effect: string;
    damage: number;
    cost: Energy[];
  }[];

  @Column({ default: 0 })
  retreat?: number;

  @Column('json', { default: [] })
  weakness?: {
    type: Energy;
    value: string;
  }[];

  @Column()
  category: Category;

  @Column()
  illustrator: string;

  @Column({ default: '' })
  description: string;

  @Column({ unique: true })
  externalId?: string;

  @Column({ default: '' })
  evolveFrom?: string;

  // TODO: decide if needed - eager: true allows cardSet to be auto loaded as well on Card load
  @ManyToOne(() => CardSet, (cardSet) => cardSet.cards, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'card_set_id' })
  cardSet: CardSet;

  // TODO: keep nullable? or fill with default value?
  @ManyToOne(() => Pack, (pack) => pack.cards, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pack_id' })
  pack?: Pack;

  @Column({ default: '' })
  effect?: string;

  @Column({ default: '' })
  trainerType?: TrainerType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserCard, (userCard) => userCard.card)
  userCards: UserCard[];
}
