import { verifyToken } from '@clerk/backend';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import type { ClerkClient } from '@clerk/backend';
import { PrismaClient, User } from 'generated/prisma';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
    private readonly configService: ConfigService,
    private readonly prismaClient: PrismaClient,
  ) {
    super();
  }

  async validate(req: Request): Promise<User> {
    const token = req.headers.authorization?.split(' ').pop();

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get('CLERK_SECRET_KEY'),
      });

      const clerkUser = await this.clerkClient.users.getUser(tokenPayload.sub);

      // Check if the user exists in the database
      const user = await this.prismaClient.user.findUnique({
        where: { externalId: clerkUser.id },
      });

      if (!user) {
        const newUser = await this.prismaClient.user.create({
          data: {
            externalId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
          },
        });
        req.user = newUser;
        return newUser;
      } else {
        req.user = user;
        return user;
      }
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
