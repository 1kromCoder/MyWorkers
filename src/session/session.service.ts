import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}
  async findAllByUser(
    userId: string,
    query: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      ip?: string;
      device?: string;
    },
  ) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ip,
      device,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.SessionWhereInput = {
      userId,
      ipAddress: ip ? { contains: ip, mode: 'insensitive' } : undefined,
      deviceInfo: device
        ? { contains: device, mode: 'insensitive' }
        : undefined,
    };

    const sessions = await this.prisma.session.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      select: {
        id: true,
        ipAddress: true,
        deviceInfo: true,
        userId: true,
      },
    });

    const total = await this.prisma.session.count({
      where,
    });

    return {
      data: sessions,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOneByUser(id: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id, userId },
      select: {
        id: true,
        ipAddress: true,
        deviceInfo: true,
      },
    });

    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async remove(id: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id, userId },
    });

    if (!session) throw new NotFoundException('Session not found');

    return this.prisma.session.delete({ where: { id } });
  }
  async me(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const user = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { Session: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
}
