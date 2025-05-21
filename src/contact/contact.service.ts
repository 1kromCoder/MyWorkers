import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateContactDto) {
    try {
      let post = await this.prisma.contact.create({ data });
      return post;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(query: {
    userName?: string;
    sureName?: string;
    phone?: string;
    address?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: any;
    limit?: any;
  }) {
    try {
      const {
        userName,
        sureName,
        phone,
        address,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};
      if (userName)
        where.userName = { contains: userName, mode: 'insensitive' };
      if (sureName)
        where.sureName = { contains: sureName, mode: 'insensitive' };
      if (phone) where.phone = { contains: phone, mode: 'insensitive' };
      if (address) where.address = { contains: address, mode: 'insensitive' };

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const contacts = await this.prisma.contact.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limitNumber,
      });

      const total = await this.prisma.contact.count({ where });

      return {
        data: contacts,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      console.error('❌ Contactlarni olishda xatolik:', error);
      throw new InternalServerErrorException(
        'Contactlarni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.contact.findFirst({ where: { id } });
      return one;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(id: string, data: UpdateContactDto) {
    try {
      let edit = await this.prisma.contact.update({ where: { id }, data });
      return edit;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      let del = await this.prisma.contact.delete({ where: { id } });
      return del;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
