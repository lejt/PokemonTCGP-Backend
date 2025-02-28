import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './cards/entity/card.entity';
import { CardSet } from './card-sets/entity/card-set.entity';
import { CardSetsModule } from './card-sets/card-sets.module';
import { PacksModule } from './packs/packs.module';
import { Pack } from './packs/entity/pack.entity';
import { configurationValidationSchema } from './config/config.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserCard } from './user-cards/entity/user-card.entity';
import { User } from './users/entity/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { InitialCardSeedModule } from './initial-card-seed/initial-card-seed.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`config/.env.${process.env.NODE_ENV}`],
      validationSchema: configurationValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
        entities: [Card, CardSet, Pack, UserCard, User],
        autoLoadEntities: true, // finds entity files and auto load them
        synchronize: process.env.NODE_ENV === 'dev',
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 5000, // time to live in milliseconds
        limit: 10, // currently 10 req / 5 seconds
      },
    ]),
    CardsModule,
    CardSetsModule,
    PacksModule,
    InitialCardSeedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
