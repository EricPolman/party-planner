import { CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class InvitationOrganiserGuard implements CanActivate {
  constructor(private readonly prismaClient: PrismaClient) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const invitationId = request.params.invitationId;
    const userId = request.user?.id;

    if (!invitationId) {
      return false;
    }

    if (!userId) {
      return false;
    }

    const invitation = await this.prismaClient.invitation.findUnique({
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

    if (!invitation) {
      return false;
    }

    request.invitation = invitation;

    return true;
  }
}
