import { Module } from '@nestjs/common';
import { ClerkStrategy } from './clerk.strategy';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [ClerkStrategy, ClerkClientProvider, PrismaClient],
  exports: [PassportModule],
})
export class AuthModule {}
