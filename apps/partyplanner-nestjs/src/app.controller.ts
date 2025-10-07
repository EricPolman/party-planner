import { Controller, Get } from '@nestjs/common';
import { PrismaClient, User } from 'generated/prisma';

@Controller()
export class AppController {
  constructor(private readonly prismaClient: PrismaClient) {}

  @Get()
  async getHello(): Promise<Array<User>> {
    const users = await this.prismaClient.user.findMany();
    return users;
  }
}
