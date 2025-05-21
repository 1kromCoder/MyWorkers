import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateFaqDto) {
    try {
      let post = await this.prisma.fAQ.create({ data });
      return post;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(query: {
    question?: string;
    answer?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: any;
    limit?: any;
  }) {
    try {
      const {
        question,
        answer,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};
      if (question)
        where.question = { contains: question, mode: 'insensitive' };
      if (answer) where.answer = { contains: answer, mode: 'insensitive' };

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const data = await this.prisma.fAQ.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limitNumber,
      });

      const total = await this.prisma.fAQ.count({ where });

      return {
        data,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      console.error('❌ FAQ larni olishda xatolik:', error);
      throw new InternalServerErrorException(
        'FAQ larni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.fAQ.findFirst({ where: { id } });
      return one;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(id: string, data: UpdateFaqDto) {
    try {
      let edit = await this.prisma.fAQ.update({ where: { id }, data });
      return edit;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      let del = await this.prisma.fAQ.delete({ where: { id } });
      return del;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
