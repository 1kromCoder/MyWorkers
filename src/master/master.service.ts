import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStar } from './dto/create-star.dto';
import { connect } from 'http2';

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateMasterDto) {
    const {
      fullName,
      phone,
      isActive,
      year,
      image,
      passportImage,
      about,
      productObjects,
    } = data;

    try {
      const existing = await this.prisma.master.findUnique({
        where: { phone: data.phone },
      });

      if (existing) {
        return { message: 'Bunday master mavjud' };
      }
      const master = await this.prisma.master.create({
        data: {
          fullName,
          phone,
          isActive,
          year,
          image,
          passportImage,
          about,
        },
      });

      if (productObjects?.length) {
        for (const product of productObjects) {
          const {
            productId,
            levelId,
            minWorkingHours,
            price_hourly,
            price_daily,
            experience,
          } = product;

          if (!productId || !levelId) {
            throw new BadRequestException(
              'Har bir productObject uchun productId va levelId bo‘lishi kerak',
            );
          }

          const existingProduct = await this.prisma.product.findUnique({
            where: { id: productId },
          });

          if (!existingProduct) {
            throw new BadRequestException(`productId topilmadi`);
          }

          const existingLevel = await this.prisma.level.findUnique({
            where: { id: levelId },
          });

          if (!existingLevel) {
            throw new BadRequestException(`levelId topilmadi:`);
          }

          await this.prisma.productMaster.create({
            data: {
              masterId: master.id,
              productId,
              levelId,
              minWorkingHours,
              price_hourly,
              price_daily,
              experience,
            },
          });
        }
      }

      return await this.prisma.master.findUnique({
        where: { id: master.id },
        include: {
          ProductMaster: true,
        },
      });
    } catch (error) {
      console.error('❌ Error creating master:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create master');
    }
  }

  async findAll(query: {
    fullName?: string;
    phone?: string;
    isActive?: string; // string, keyin boolean ga o‘zgartiriladi
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: any;
    limit?: any;
  }) {
    try {
      const {
        fullName,
        phone,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (fullName) {
        where.fullName = { contains: fullName, mode: 'insensitive' };
      }
      if (phone) {
        where.phone = { contains: phone, mode: 'insensitive' };
      }
      if (typeof isActive !== 'undefined') {
        // Query string bo‘lib keladi, true/false ga aylantiramiz
        where.isActive = isActive === 'true';
      }

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const data = await this.prisma.master.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limitNumber,
        include: {
          ProductMaster: true,
        },
      });

      const total = await this.prisma.master.count({ where });

      return {
        data,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      console.error('❌ Error fetching masters:', error);
      throw new InternalServerErrorException('Failed to fetch masters');
    }
  }

  async createStar(data: CreateStar, userId: string) {
    try {
      const master = await this.prisma.master.findUnique({
        where: { id: data.masterId },
      });

      if (!master) {
        throw new BadRequestException('Bunday master mavjud emas');
      }

      const existing = await this.prisma.star.findFirst({
        where: {
          userId: userId,
          masterId: data.masterId,
        },
      });

      if (existing) {
        return await this.prisma.star.update({
          where: { id: existing.id },
          data: { star: data.star },
        });
      }

      return await this.prisma.star.create({
        data: {
          user: { connect: { id: userId } },
          master: { connect: { id: data.masterId } },
          star: data.star,
        },
      });
    } catch (error) {
      console.error('❌ createStar xatolik:', error);
      throw new InternalServerErrorException('Baho qo‘shishda xatolik');
    }
  }

  async findOne(id: string) {
    try {
      const master = await this.prisma.master.findUnique({
        where: { id },
        include: {
          ProductMaster: true,
        },
      });

      if (!master) {
        throw new NotFoundException('Master not found');
      }

      const avg = await this.prisma.star.aggregate({
        where: { masterId: id },
        _avg: { star: true },
      });

      const averageStar =
        avg._avg.star !== null && avg._avg.star !== undefined
          ? parseFloat(avg._avg.star.toFixed(1))
          : 0;

      return {
        ...master,
        averageStar,
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch master');
    }
  }

  async update(id: string, data: UpdateMasterDto) {
    try {
      const existing = await this.prisma.master.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Master not found');
      }

      const updated = await this.prisma.master.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to update master');
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.master.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Master not found');
      }

      await this.prisma.productMaster.deleteMany({
        where: { masterId: id },
      });

      await this.prisma.star.deleteMany({
        where: { masterId: id },
      });

      await this.prisma.master.delete({ where: { id } });

      return {
        message: 'Master deleted successfully',
        deletedMaster: existing,
      };
    } catch (error) {
      console.error(`❌ Error deleting master with ID ${id}:`, error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to delete master');
    }
  }
}
