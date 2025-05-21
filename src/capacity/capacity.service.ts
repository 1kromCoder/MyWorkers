import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCapacityDto) {
    try {
      let post = await this.prisma.capacity.create({ data });
      return post;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(params: {
    name?: string;
    page?: number | string;
    limit?: number | string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = parseInt(params.page as string) || 1;
    const limit = parseInt(params.limit as string) || 10;
    const sortOrder = params.sortOrder || 'asc';
    const name = params.name;

    const skip = (page - 1) * limit;

    const where: Prisma.CapacityWhereInput = name
      ? { name_uz: { contains: name, mode: 'insensitive' } }
      : {};

    const [capacities, total] = await Promise.all([
      this.prisma.capacity.findMany({
        where,
        orderBy: { name_uz: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.capacity.count({ where }),
    ]);

    return {
      data: capacities,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: string) {
    try {
      let one = await this.prisma.capacity.findFirst({ where: { id } });
      return one;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async update(id: string, data: UpdateCapacityDto) {
    try {
      let edit = await this.prisma.capacity.update({ where: { id }, data });
      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: string) {
    try {
      let del = await this.prisma.capacity.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
