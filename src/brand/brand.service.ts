import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRegionDto } from 'src/region/dto/update-region.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateBrandDto) {
    try {
      const existing = await this.prisma.brand.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (existing) {
        return { message: 'Bunday brand mavjud' };
      }
      let post = await this.prisma.brand.create({ data });
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

    const where: Prisma.BrandWhereInput = name
      ? { name_uz: { contains: name, mode: 'insensitive' } }
      : {};

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        orderBy: { name_uz: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      data: brands,
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
      let one = await this.prisma.brand.findFirst({ where: { id } });
      return one;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async update(id: string, data: UpdateBrandDto) {
    try {
      let edit = await this.prisma.brand.update({ where: { id }, data });
      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: string) {
    try {
      let del = await this.prisma.brand.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
