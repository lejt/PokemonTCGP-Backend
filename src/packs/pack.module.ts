import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackRepository } from './pack.repository';
import { Pack } from './pack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pack])],
  controllers: [],
  providers: [PackRepository],
})
export class PackModule {}
