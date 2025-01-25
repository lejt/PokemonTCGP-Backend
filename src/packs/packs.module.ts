import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacksRepository } from './packs.repository';
import { Pack } from './entity/pack.entity';
import { CoreAuthModules } from '../core-auth-modules/core-auth-modules.module';
import { PacksService } from './packs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pack]), CoreAuthModules],
  providers: [PacksRepository, PacksService],
  exports: [PacksService],
})
export class PacksModule {}
