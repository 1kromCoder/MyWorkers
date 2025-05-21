import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const {
      name_uz,
      name_ru,
      name_en,
      image,
      isActive,
      minWorkingHours,
      toolIds,
      levelObjects,
    } = data;

    try {
      if (toolIds?.length) {
        if (!Array.isArray(toolIds) || toolIds.length === 0) {
          throw new BadRequestException('toolIds should be a non-empty array');
        }

        for (const toolId of toolIds) {
          if (!toolId || typeof toolId !== 'string' || toolId.trim() === '') {
            throw new BadRequestException('Tool id is invalid');
          }

          const toolExists = await this.prisma.tool.findUnique({
            where: { id: toolId },
          });

          if (!toolExists) {
            throw new NotFoundException(`toolId topilmadi:`);
          }
        }
      }

      if (levelObjects?.length) {
        if (!Array.isArray(levelObjects) || levelObjects.length === 0) {
          throw new BadRequestException(
            'levelObjects should be a non-empty array',
          );
        }

        for (const lvl of levelObjects) {
          if (
            !lvl.levelId ||
            typeof lvl.levelId !== 'string' ||
            lvl.levelId.trim() === ''
          ) {
            throw new BadRequestException('Level id is invalid');
          }

          const levelExists = await this.prisma.level.findUnique({
            where: { id: lvl.levelId },
          });

          if (!levelExists) {
            throw new NotFoundException(`levelId topilmadi`);
          }

          if (
            typeof lvl.minWorkingHours !== 'number' ||
            isNaN(lvl.minWorkingHours)
          ) {
            throw new BadRequestException('Level minWorkingHours is invalid');
          }
          if (typeof lvl.price_hourly !== 'number' || isNaN(lvl.price_hourly)) {
            throw new BadRequestException('Level price_hourly is invalid');
          }
          if (typeof lvl.price_daily !== 'number' || isNaN(lvl.price_daily)) {
            throw new BadRequestException('Level price_daily is invalid');
          }
        }
      }

      const product = await this.prisma.product.create({
        data: {
          name_uz,
          name_ru,
          name_en,
          image,
          isActive,
          minWorkingHours,
          ProductLevel: levelObjects?.length
            ? {
                create: levelObjects.map((lvl) => ({
                  levelId: lvl.levelId,
                  minWorkingHours: lvl.minWorkingHours,
                  price_hourly: lvl.price_hourly,
                  price_daily: lvl.price_daily,
                })),
              }
            : undefined,
        },
        include: {
          ProductLevel: true,
        },
      });

      if (toolIds?.length) {
        for (const toolId of toolIds) {
          await this.prisma.productTool.create({
            data: {
              productId: product.id,
              toolId,
            },
          });
        }
      }

      return await this.prisma.product.findUnique({
        where: { id: product.id },
        include: {
          ProductLevel: true,
          ProductTool: true,
        },
      });
    } catch (error) {
      console.error('❌ Error creating product', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Mahsulot yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: any) {
    try {
      // Pagination va sort uchun default qiymatlar
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const skip = (page - 1) * limit;
      const sortBy = query.sortBy || 'name_uz';
      const order = query.order === 'desc' ? 'desc' : 'asc';

      // Filter obyektini shakllantiramiz
      const where: any = {};

      // name_uz bo‘yicha qidiruv (partially)
      if (query.name_uz) {
        where.name_uz = { contains: query.name_uz, mode: 'insensitive' };
      }
      if (query.name_ru) {
        where.name_ru = { contains: query.name_ru, mode: 'insensitive' };
      }
      if (query.name_en) {
        where.name_en = { contains: query.name_en, mode: 'insensitive' };
      }

      if (query.isActive !== undefined) {
        // string 'true' yoki 'false' bo'lishi mumkin, uni boolean ga o'gir
        if (query.isActive === 'true') where.isActive = true;
        else if (query.isActive === 'false') where.isActive = false;
      }

      if (query.minWorkingHours) {
        const minHours = Number(query.minWorkingHours);
        if (!isNaN(minHours)) {
          where.minWorkingHours = minHours;
        }
      }

      if (query.toolIds) {
        // toolIds ni massivga aylantiramiz
        const toolIdsArray = (query.toolIds as string).split(',');
        // Prisma relations bo'yicha filter (ProductTool relation modeli)
        where.ProductTool = {
          some: {
            toolId: { in: toolIdsArray },
          },
        };
      }

      // E'tibor bering: levelObjects bo'yicha filter qilish odatda qiyin,
      // agar kerak bo'lsa alohida query yozish mumkin

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
        include: {
          ProductLevel: true,
          ProductTool: true,
        },
      });

      const total = await this.prisma.product.count({ where });

      return {
        data: products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('❌ Error fetching products with filters:', error);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          ProductLevel: true,
          ProductTool: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      console.error(`❌ Error fetching product with id ${id}`, error);
      throw error;
    }
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      const existing = await this.prisma.product.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      const updated = await this.prisma.product.update({
        where: { id },
        data,
        include: {
          ProductLevel: true,
          ProductTool: true,
        },
      });

      return updated;
    } catch (error) {
      console.error(`❌ Error updating product with id ${id}`, error);
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      await this.prisma.product.delete({ where: { id } });

      return { message: `Product with id ${id} deleted successfully` };
    } catch (error) {
      console.error(`❌ Error deleting product with id ${id}`, error);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
