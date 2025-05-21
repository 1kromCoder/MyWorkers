import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateSizeDto) {
    try {
      let post = await this.prisma.size.create({ data });
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

    const where: Prisma.SizeWhereInput = name
    ? { name_uz: { contains: name, mode: 'insensitive' } }
    : {};

    const [sizes, total] = await Promise.all([
      this.prisma.size.findMany({
        where,
        orderBy: { name_uz: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.size.count({ where }),
    ]);

    return {
      data: sizes,
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
      let one = await this.prisma.size.findFirst({ where: { id } });
      return one;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async update(id: string, data: UpdateSizeDto) {
    try {
      let edit = await this.prisma.size.update({ where: { id }, data });
      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: string) {
    try {
      let del = await this.prisma.size.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
