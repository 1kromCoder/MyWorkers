import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBasketItemDto } from './dto/create-basket.dto';
import { MeasureType } from '@prisma/client';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBasketItemDto, userId: string) {
    try {
      const { productId, levelId, toolId, measure, count, total, quantity } =
        data;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      const [product, level] = await Promise.all([
        this.prisma.product.findUnique({ where: { id: productId } }),
        this.prisma.level.findUnique({ where: { id: levelId } }),
      ]);
      if (!product)
        throw new NotFoundException(`Mahsulot topilmadi: ${productId}`);
      if (!level) throw new NotFoundException(`Level topilmadi: ${levelId}`);

      const basketItem = await this.prisma.basketItem.create({
        data: {
          userId,
          productId,
          levelId,
          toolId,
          measure,
          count,
          total,
          quantity,
        },
        include: {
          product: true,
          level: true,
          tool: true,
        },
      });

      return basketItem;
    } catch (error) {
      console.error('❌ BasketItem yaratishda xatolik:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'BasketItem yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: {
    productId?: string;
    levelId?: string;
    measure?: MeasureType;
    toolId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        productId,
        levelId,
        measure,
        toolId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where: any = {};
      if (productId) where.productId = productId;
      if (levelId) where.levelId = levelId;
      if (measure) where.measure = measure;
      if (toolId) where.toolId = toolId;

      const items = await this.prisma.basketItem.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take,
        include: {
          product: true,
          level: true,
          tool: true,
        },
      });

      const totalCount = await this.prisma.basketItem.count({ where });

      return {
        data: items,
        total: totalCount,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(totalCount / take),
      };
    } catch (error) {
      console.error('❌ BasketItem larni olishda xatolik:', error);
      throw new InternalServerErrorException(
        'BasketItem larni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      const basketItem = await this.prisma.basketItem.findUnique({
        where: { id },
        include: {
          product: true,
          level: true,
          tool: true,
        },
      });
      if (!basketItem) throw new NotFoundException(`Item topilmadi: ${id}`);

      return basketItem;
    } catch (error) {
      console.error('❌ BasketItem ni olishda xatolik:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException(
        'BasketItem ni olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: string, data: Partial<CreateBasketItemDto>, userId: string) {
    try {
      const basketItem = await this.prisma.basketItem.findUnique({
        where: { id },
      });

      if (!basketItem) throw new NotFoundException(`Item topilmadi: ${id}`);
      if (basketItem.userId !== userId)
        throw new ForbiddenException(`Bu item sizga tegishli emas`);

      const updated = await this.prisma.basketItem.update({
        where: { id },
        data,
        include: {
          product: true,
          level: true,
          tool: true,
        },
      });

      return updated;
    } catch (error) {
      console.error('❌ BasketItem yangilashda xatolik:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException(
        'BasketItem yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: string) {
    try {
      const basketItem = await this.prisma.basketItem.findUnique({
        where: { id },
      });

      if (!basketItem) throw new NotFoundException(`Item topilmadi: ${id}`);

      return await this.prisma.basketItem.delete({ where: { id } });
    } catch (error) {
      console.error('❌ BasketItem o‘chirishda xatolik:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException(
        'BasketItem o‘chirishda xatolik yuz berdi',
      );
    }
  }
}
