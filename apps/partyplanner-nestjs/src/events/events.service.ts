import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class EventsService {
  constructor(private readonly prismaClient: PrismaClient) {}

  getEvents(userId: string) {
    return this.prismaClient.event.findMany({
      where: {
        organisers: {
          some: {
            id: { equals: userId },
          },
        },
      },
    });
  }

  getEventById(eventId: string) {
    return this.prismaClient.event.findUniqueOrThrow({
      where: {
        id: eventId,
      },
      include: { invitations: true },
    });
  }

  create(data: { title: string; description: string; userId: string }) {
    const { title, description, userId } = data;
    return this.prismaClient.event.create({
      data: {
        title,
        description,
        organisers: { connect: { id: userId } },
      },
    });
  }

  delete(data: { eventId: string; userId: string }) {
    const { eventId, userId } = data;
    return this.prismaClient.event.delete({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: userId },
          },
        },
      },
    });
  }
}
