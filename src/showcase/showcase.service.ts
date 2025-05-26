import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShowcaseDto) {
    try {
      const existing = await this.prisma.showcase.findUnique({
        where: { link: dto.link },
      });

      if (existing) {
        return { message: 'Bunday showcase mavjud' };
      }
      return await this.prisma.showcase.create({
        data: {
          name_uz: dto.name_uz,
          name_ru: dto.name_ru,
          name_en: dto.name_en,
          description_uz: dto.description_uz,
          description_ru: dto.description_ru,
          description_en: dto.description_en,
          image: dto.image,
          link: dto.link,
        },
      });
    } catch (error) {
      console.error('❌ Showcase yaratishda xatolik:', error);
      throw new InternalServerErrorException(
        'Showcase yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: any) {
    try {
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const skip = (page - 1) * limit;
      const sortBy = query.sortBy || 'createdAt';
      const order = query.order === 'desc' ? 'desc' : 'asc';

      const where: any = {};

      // Filterlar
      if (query.name_uz) {
        where.name_uz = { contains: query.name_uz, mode: 'insensitive' };
      }
      if (query.name_ru) {
        where.name_ru = { contains: query.name_ru, mode: 'insensitive' };
      }
      if (query.name_en) {
        where.name_en = { contains: query.name_en, mode: 'insensitive' };
      }
      // if (query.description_uz) {
      //   where.description_uz = {
      //     contains: query.description_uz,
      //     mode: 'insensitive',
      //   };
      // }
      // if (query.description_ru) {
      //   where.description_ru = {
      //     contains: query.description_ru,
      //     mode: 'insensitive',
      //   };
      // }
      // if (query.description_en) {
      //   where.description_en = {
      //     contains: query.description_en,
      //     mode: 'insensitive',
      //   };
      // }
      if (query.link) {
        where.link = { contains: query.link, mode: 'insensitive' };
      }

      const showcases = await this.prisma.showcase.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      });

      const total = await this.prisma.showcase.count({ where });

      return {
        data: showcases,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('❌ Showcase ro‘yxatini olishda xatolik:', error);
      throw new InternalServerErrorException(
        'Showcase larni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      const showcase = await this.prisma.showcase.findUnique({
        where: { id },
      });

      if (!showcase) {
        throw new NotFoundException(`Showcase topilmadi: ${id}`);
      }

      return showcase;
    } catch (error) {
      console.error(`❌ Showcase topishda xatolik (${id}):`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Showcase ni olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: string, dto: UpdateShowcaseDto) {
    try {
      const exists = await this.prisma.showcase.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException(`Showcase topilmadi: ${id}`);
      }

      return await this.prisma.showcase.update({
        where: { id },
        data: {
          name_uz: dto.name_uz,
          name_ru: dto.name_ru,
          name_en: dto.name_en,
          description_uz: dto.description_uz,
          description_ru: dto.description_ru,
          description_en: dto.description_en,
          image: dto.image,
          link: dto.link,
        },
      });
    } catch (error) {
      console.error(`❌ Showcase yangilashda xatolik (${id}):`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Showcase ni yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: string) {
    try {
      const exists = await this.prisma.showcase.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException(`Showcase topilmadi: ${id}`);
      }

      await this.prisma.showcase.delete({ where: { id } });

      return { message: 'Showcase o‘chirildi', id };
    } catch (error) {
      console.error(`❌ Showcase o‘chirishda xatolik (${id}):`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Showcase ni o‘chirishda xatolik yuz berdi',
      );
    }
  }
}
