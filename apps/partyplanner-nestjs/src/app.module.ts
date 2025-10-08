import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ClerkClientProvider } from './providers/clerk-client.provider';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { PrismaClient } from 'generated/prisma';
import { EventsModule } from './events/events.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    EventsModule,
    RsvpModule,
    InvitationsModule,
  ],
  controllers: [],
  providers: [
    ClerkClientProvider,
    PrismaClient,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
