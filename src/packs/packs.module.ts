import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacksRepository } from './packs.repository';
import { Pack } from './pack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pack])],
  controllers: [],
  providers: [PacksRepository],
})
export class PacksModule {}
