import { Module } from '@nestjs/common';
import { ClerkStrategy } from './clerk.strategy';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [PassportModule, ConfigModule, CoreModule],
  providers: [ClerkStrategy, ClerkClientProvider],
  exports: [PassportModule],
})
export class AuthModule {}
