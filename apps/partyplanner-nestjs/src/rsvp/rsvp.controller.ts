import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { InviteeStatus } from 'generated/prisma';
import { Public } from 'src/auth/public.decorator';
import { RsvpService } from './rsvp.service';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Get(':invitationCode')
  @Public()
  async getInvitationByCode(@Param('invitationCode') invitationCode: string) {
    return this.rsvpService.getInvitationByCode(invitationCode);
  }

  @Post(':invitationCode')
  @Public()
  async rsvpReply(
    @Param('invitationCode') invitationCode: string,
    @Body()
    body: {
      email?: string;
      phoneNumber?: string;
      firstName: string;
      lastName?: string;
      comments?: string;
      status: InviteeStatus;
    },
  ) {
    return this.rsvpService.saveRsvp({ invitationCode, data: body });
  }
}
