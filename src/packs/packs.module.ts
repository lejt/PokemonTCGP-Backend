import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacksRepository } from './packs.repository';
import { Pack } from './entity/pack.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pack]), AuthModule],
  controllers: [],
  providers: [PacksRepository],
})
export class PacksModule {}
