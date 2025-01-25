import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  exports: [UsersModule, AuthModule],
})
export class CoreAuthModules {}
