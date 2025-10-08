import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
