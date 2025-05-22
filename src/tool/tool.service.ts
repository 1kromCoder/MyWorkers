import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateToolDto) {
    try {
      const existing = await this.prisma.tool.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (existing) {
        return { message: 'Bunday tool mavjud' };
      }
      await this.checkRelations(data.sizeId, data.brandId, data.capacityId);

      const post = await this.prisma.tool.create({ data });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message || error);
    }
  }

  async findAll(query: any) {
    try {
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const skip = (page - 1) * limit;
      const sortBy = query.sortBy || 'name_uz';
      const order = query.order === 'desc' ? 'desc' : 'asc';

      const where: any = {};

      if (query.name_uz) {
        where.name_uz = { contains: query.name_uz, mode: 'insensitive' };
      }
      if (query.name_ru) {
        where.name_ru = { contains: query.name_ru, mode: 'insensitive' };
      }
      if (query.name_en) {
        where.name_en = { contains: query.name_en, mode: 'insensitive' };
      }
      if (query.description_uz) {
        where.description_uz = {
          contains: query.description_uz,
          mode: 'insensitive',
        };
      }
      if (query.description_ru) {
        where.description_ru = {
          contains: query.description_ru,
          mode: 'insensitive',
        };
      }
      if (query.description_en) {
        where.description_en = {
          contains: query.description_en,
          mode: 'insensitive',
        };
      }
      if (query.code) {
        where.code = { contains: query.code, mode: 'insensitive' };
      }

      if (query.brandId) {
        where.brandId = query.brandId;
      }
      if (query.capacityId) {
        where.capacityId = query.capacityId;
      }
      if (query.sizeId) {
        where.sizeId = query.sizeId;
      }

      if (query.isActive !== undefined) {
        where.isActive = query.isActive === 'true';
      }

      const tools = await this.prisma.tool.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
        include: {
          brand: true,
          capacity: true,
          size: true,
        },
      });

      const total = await this.prisma.tool.count({ where });

      return {
        data: tools,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(error.message || error);
    }
  }

  async findOne(id: string) {
    try {
      const one = await this.prisma.tool.findFirst({ where: { id } });
      if (!one) throw new NotFoundException('Tool not found');
      return one;
    } catch (error) {
      throw new BadRequestException(error.message || error);
    }
  }

  async update(id: string, data: UpdateToolDto) {
    try {
      const existing = await this.prisma.tool.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Tool not found');

      await this.checkRelations(data.sizeId, data.brandId, data.capacityId);

      const updated = await this.prisma.tool.update({ where: { id }, data });
      return updated;
    } catch (error) {
      throw new BadRequestException(error.message || error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.tool.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Tool not found');

      return await this.prisma.tool.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message || error);
    }
  }

  private async checkRelations(
    sizeId?: string,
    brandId?: string,
    capacityId?: string,
  ) {
    if (sizeId) {
      const size = await this.prisma.size.findUnique({ where: { id: sizeId } });
      if (!size) throw new NotFoundException(`Size id not found`);
    }

    if (brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brand) throw new NotFoundException(`Brand id not found`);
    }

    if (capacityId) {
      const capacity = await this.prisma.capacity.findUnique({
        where: { id: capacityId },
      });
      if (!capacity) throw new NotFoundException(`Capacity id not found`);
    }
  }
}
