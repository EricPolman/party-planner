import { Injectable } from '@nestjs/common';
import { Invitation, PrismaClient } from 'generated/prisma';

@Injectable()
export class InvitationsService {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getByEventId({
    eventId,
  }: {
    eventId: string;
  }): Promise<Array<Invitation> | null> {
    return this.prismaClient.invitation.findMany({
      where: {
        event: {
          id: { equals: eventId },
        },
      },
      include: { invitees: true },
    });
  }

  async create(data: {
    title: string;
    message: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    eventId: string;
  }) {
    const { title, message, location, startDate, endDate, eventId } = data;

    return this.prismaClient.invitation.create({
      data: {
        code: crypto.randomUUID().split('-')[0],
        title,
        message,
        isActive: true,
        location,
        endDate,
        startDate,
        event: { connect: { id: eventId } },
      },
    });
  }

  async delete({
    invitationId,
    userId,
  }: {
    invitationId: string;
    userId: string;
  }) {
    await this.prismaClient.invitation.findUniqueOrThrow({
      where: {
        id: invitationId,
        event: {
          organisers: {
            some: {
              id: { equals: userId },
            },
          },
        },
      },
    });

    await this.prismaClient.invitation.delete({
      where: {
        id: invitationId,
      },
    });
  }

  async update({
    invitationId,
    data,
  }: {
    invitationId: string;
    data: Partial<Invitation>;
  }) {
    return this.prismaClient.invitation.update({
      where: { id: invitationId },
      data,
    });
  }

  async addInvitee({
    invitation,
    data,
  }: {
    invitation: Invitation;
    data: {
      email?: string;
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
    };
  }) {
    const inviteeData = {
      email: data.email,
      phoneNumber: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      invitation: { connect: { id: invitation.id } },
    };

    return this.prismaClient.invitee.create({
      data: inviteeData,
    });
  }

  async removeInvitee({
    invitation,
    inviteeId,
  }: {
    invitation: Invitation;
    inviteeId: string;
  }) {
    await this.prismaClient.invitee.deleteMany({
      where: {
        id: inviteeId,
        invitationId: invitation.id,
      },
    });
  }
}
