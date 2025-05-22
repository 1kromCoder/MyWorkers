import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateGeneralinfoDto } from './dto/update-generalinfo.dto';
import { CreateGeneralInfoDto } from './dto/create-generalinfo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneralinfoService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateGeneralInfoDto) {
    try {
      const existing = await this.prisma.generalInfo.findUnique({
        where: { email: dto.email },
      });

      if (existing) {
        return { message: 'Bunday generalInfo mavjud' };
      }
      return await this.prisma.generalInfo.create({
        data: {
          email: dto.email,
          phones: dto.phones,
          links: dto.links,
        },
      });
    } catch (error) {
      console.error('❌ Error creating GeneralInfo:', error);
      throw new InternalServerErrorException(
        'Maʼlumot yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: {
    email?: string;
    phone?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: any;
    limit?: any;
  }) {
    try {
      const {
        email,
        phone,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (email) {
        where.email = { contains: email, mode: 'insensitive' };
      }

      if (phone) {
        // phones is an array, so we use `has` operator
        where.phones = { has: phone };
      }

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const data = await this.prisma.generalInfo.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limitNumber,
      });

      const total = await this.prisma.generalInfo.count({ where });

      return {
        data,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      console.error('❌ GeneralInfo ro‘yxatini olishda xatolik:', error);
      throw new InternalServerErrorException(
        'Maʼlumotlarni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      const generalInfo = await this.prisma.generalInfo.findUnique({
        where: { id },
      });

      if (!generalInfo) {
        throw new NotFoundException(`Maʼlumot topilmadi: ${id}`);
      }

      return generalInfo;
    } catch (error) {
      console.error(`❌ Error fetching GeneralInfo ${id}:`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Maʼlumotni olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: string, dto: UpdateGeneralinfoDto) {
    try {
      const exists = await this.prisma.generalInfo.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new NotFoundException(`Maʼlumot topilmadi: ${id}`);
      }

      return await this.prisma.generalInfo.update({
        where: { id },
        data: {
          email: dto.email,
          phones: dto.phones,
          links: dto.links,
        },
      });
    } catch (error) {
      console.error(`❌ Error updating GeneralInfo ${id}:`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Maʼlumotni yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: string) {
    try {
      const exists = await this.prisma.generalInfo.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new NotFoundException(`Maʼlumot topilmadi: ${id}`);
      }

      await this.prisma.generalInfo.delete({ where: { id } });

      return { message: 'Maʼlumot o‘chirildi', id };
    } catch (error) {
      console.error(`❌ Error deleting GeneralInfo ${id}:`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Maʼlumotni o‘chirishda xatolik yuz berdi',
      );
    }
  }
}
