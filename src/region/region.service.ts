import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateRegionDto) {
    try {
      let post = await this.prisma.region.create({ data });
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

    const where: Prisma.RegionWhereInput = name
      ? { name_uz: { contains: name, mode: 'insensitive' } }
      : {};

    const [regions, total] = await Promise.all([
      this.prisma.region.findMany({
        where,
        orderBy: { name_uz: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.region.count({ where }),
    ]);

    return {
      data: regions,
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
      let one = await this.prisma.region.findFirst({ where: { id } });
      return one;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async update(id: string, data: UpdateRegionDto) {
    try {
      let edit = await this.prisma.region.update({ where: { id }, data });
      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: string) {
    try {
      let del = await this.prisma.region.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
