import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserCard } from '../../user-cards/entity/user-card.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // relationship to cards
  @OneToMany(() => UserCard, (userCard) => userCard.user, {
    cascade: true,
    eager: true, // loads userCards by default with the user
  })
  userCards: UserCard[];
}
