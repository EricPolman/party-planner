import { Module } from '@nestjs/common';
import { RsvpController } from './rsvp.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CoreModule } from 'src/core/core.module';
import { RsvpService } from './rsvp.service';

@Module({
  imports: [NotificationsModule, CoreModule],
  providers: [RsvpService],
  controllers: [RsvpController],
})
export class RsvpModule {}
