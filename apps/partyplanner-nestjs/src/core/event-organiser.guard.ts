import { CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class EventOrganiserGuard implements CanActivate {
  constructor(private readonly prismaClient: PrismaClient) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const eventId = request.params.eventId ?? request.body.eventId;
    const userId = request.user?.id;

    if (!eventId) {
      return false;
    }

    if (!userId) {
      return false;
    }

    const event = await this.prismaClient.event.findUnique({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: userId },
          },
        },
      },
    });

    if (!event) {
      return false;
    }

    request.event = event;

    return true;
  }
}
