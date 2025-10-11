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

  //   async addInvitee({
  //     invitationId,
  //     userId,
  //     data,
  //   }: {
  //     invitationId: string;
  //     userId: string;
  //     data: {
  //       email?: string;
  //       phoneNumber?: string;
  //       firstName?: string;
  //       lastName?: string;
  //     };
  //   }) {
  //     // First check if the user is an organiser of the event
  //     // If not, throw an error
  //     // If yes, add the invitee

  //     const invitation = await this.prismaClient.invitation.findUniqueOrThrow({
  //       where: {
  //         id: invitationId,
  //         event: {
  //           organisers: {
  //             some: {
  //               id: { equals: userId },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }
}
