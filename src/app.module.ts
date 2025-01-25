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
import { UserCard } from './users/user-card/user-card.entity';
import { User } from './users/entity/user.entity';

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
        host: configService.get('DEPLOY_ENV_LOCAL'),
        port: parseInt(configService.get('DB_LOCAL_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Card, CardSet, Pack, UserCard, User],
        autoLoadEntities: true, // finds entity files and auto load them
        synchronize: process.env.NODE_ENV === 'dev',
        // ^ turn off in production to avoid accidental schema change
      }),
    }),
    CardsModule,
    CardSetsModule,
    PacksModule,
  ],
})
export class AppModule {}
