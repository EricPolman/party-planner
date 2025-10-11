import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { CoreModule } from 'src/core/core.module';
import { InvitationsService } from './invitations.service';

@Module({
  imports: [CoreModule],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
