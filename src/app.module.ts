import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { CollectionModule } from './collection/collection.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Card } from './cards/card.entity';
import { CardSet } from './card-set/card-set.entity';
import { CardSetModule } from './card-set/card-set.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // imports .env globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DEPLOY_ENV_LOCAL, // TODO: change when deployed
      port: Number(process.env.LOCAL_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      entities: [Card, CardSet],
      autoLoadEntities: true, // finds entity files and auto load them
      synchronize: true, // always keep db schema in sync so no need to manual migrate
      // ^ turn off in production to avoid accidental schema change
    }),
    CardsModule,
    CardSetModule,
    CollectionModule,
  ],
})
export class AppModule {}
