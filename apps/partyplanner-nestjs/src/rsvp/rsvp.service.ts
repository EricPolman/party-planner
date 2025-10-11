import { Injectable } from '@nestjs/common';

import {
  Invitation,
  Invitee,
  InviteeStatus,
  PrismaClient,
} from 'generated/prisma';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class RsvpService {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly notificationsService: NotificationsService,
  ) {}
  async getInvitationByCode(
    invitationCode: string,
  ): Promise<Invitation & { organisers: string[] }> {
    const { event, ...invitation } =
      await this.prismaClient.invitation.findUniqueOrThrow({
        where: {
          code: invitationCode,
          isActive: true,
        },
        include: {
          event: { include: { organisers: true } },
          invitees: false,
        },
      });

    return {
      ...invitation,
      organisers: event.organisers.map((o) => `${o.firstName} ${o.lastName}`),
    };
  }

  async saveRsvp({
    invitationCode,
    data,
  }: {
    invitationCode: string;
    data: {
      email?: string;
      phoneNumber?: string;
      firstName: string;
      lastName?: string;
      comments?: string;
      status: InviteeStatus;
    };
  }): Promise<void> {
    const invitation = await this.prismaClient.invitation.findUniqueOrThrow({
      where: {
        code: invitationCode,
        isActive: true,
      },
      include: { event: { include: { organisers: true } } },
    });

    // Upsert invitee based on email or phone number
    // If neither is provided, create a new invitee
    const inviteeData: {
      email?: string;
      phoneNumber?: string;
      firstName: string;
      lastName?: string;
      status: InviteeStatus;
      comments?: string;
      invitation: { connect: { id: string } };
    } = {
      email: data.email,
      phoneNumber: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      status: data.status,
      comments: data.comments,
      invitation: { connect: { id: invitation.id } },
    };

    let invitee: Invitee | null = null;
    if (data.email) {
      invitee = await this.prismaClient.invitee.findFirst({
        where: { email: { equals: data.email } },
      });
    } else if (data.phoneNumber) {
      invitee = await this.prismaClient.invitee.findFirst({
        where: { phoneNumber: { equals: data.phoneNumber } },
      });
    }

    if (invitee) {
      invitee = await this.prismaClient.invitee.update({
        where: { id: invitee.id },
        data: {
          ...inviteeData,
          respondedAt: new Date(),
        },
      });
    } else {
      invitee = await this.prismaClient.invitee.create({
        data: {
          ...inviteeData,
          respondedAt: new Date(),
        },
      });
    }

    // Notify organisers about new RSVP
    await this.notificationsService.sendInviteeNotification(
      invitation,
      invitee,
    );
  }
}
