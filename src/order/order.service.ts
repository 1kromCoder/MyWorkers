import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PayType, StatusType } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderDto, userId: string) {
    const {
      total,
      address,
      location,
      date,
      payType,
      withDelivery,
      status,
      commentToDelivery,
      OrderProduct,
      OrderMaster,
    } = data;

    try {
      const order = await this.prisma.order.create({
        data: {
          userId,
          total,
          address,
          location: location
            ? {
                lat: location.lat,
                long: location.long,
              }
            : undefined,
          date: new Date(date),
          payType,
          withDelivery,
          status,
          commentToDelivery,
        },
      });

      const orderId = order.id;

      if (OrderProduct?.length) {
        for (const product of OrderProduct) {
          const productExists = await this.prisma.product.findUnique({
            where: { id: product.productId },
          });
          if (!productExists) {
            throw new NotFoundException(`Product topilmadi`);
          }

          const levelExists = await this.prisma.level.findUnique({
            where: { id: product.levelId },
          });
          if (!levelExists) {
            throw new NotFoundException(`Daraja topilmadi`);
          }

          const orderProduct = await this.prisma.orderProduct.create({
            data: {
              orderId,
              productId: product.productId,
              levelId: product.levelId,
              count: product.count,
              quantity: product.quantity,
              measure: product.measure,
            },
          });

          if (product.OrderProductTool?.length) {
            for (const tool of product.OrderProductTool) {
              const toolExists = await this.prisma.tool.findUnique({
                where: { id: tool.toolId },
              });
              if (!toolExists) {
                throw new NotFoundException(`Asbob topilmadi`);
              }

              await this.prisma.orderProductTool.create({
                data: {
                  orderProductId: orderProduct.id,
                  toolId: tool.toolId,
                  count: tool.count,
                },
              });
            }
          }
        }
      }

      if (OrderMaster?.length) {
        for (const masterId of OrderMaster) {
          const masterExists = await this.prisma.master.findUnique({
            where: { id: masterId },
          });
          if (!masterExists) {
            throw new NotFoundException(`Usta topilmadi`);
          }

          await this.prisma.orderMaster.create({
            data: {
              orderId,
              masterId,
            },
          });
        }
      }
      await this.prisma.basketItem.deleteMany({
        where: { userId },
      });
      return await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          OrderProduct: {
            include: { OrderProductTool: true },
          },
          OrderMaster: true,
        },
      });
    } catch (error) {
      console.error('❌ Error creating order:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Buyurtma yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: {
    status?: StatusType;
    payType?: PayType;
    withDelivery?: string; // boolean string sifatida keladi
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: any;
    limit?: any;
  }) {
    try {
      const {
        status,
        payType,
        withDelivery,
        dateFrom,
        dateTo,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (status) {
        where.status = status;
      }
      if (payType) {
        where.payType = payType;
      }
      if (typeof withDelivery !== 'undefined') {
        where.withDelivery = withDelivery === 'true';
      }
      if (dateFrom || dateTo) {
        where.date = {};
        if (dateFrom) {
          where.date.gte = new Date(dateFrom);
        }
        if (dateTo) {
          where.date.lte = new Date(dateTo);
        }
      }

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const data = await this.prisma.order.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limitNumber,
        include: {
          OrderProduct: {
            include: { OrderProductTool: true },
          },
          OrderMaster: true,
        },
      });

      const total = await this.prisma.order.count({ where });

      return {
        data,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw new InternalServerErrorException(
        'Buyurtmalarni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          OrderProduct: {
            include: { OrderProductTool: true },
          },
          OrderMaster: true,
        },
      });
      if (!order) {
        throw new NotFoundException(`Buyurtma topilmadi: ${id}`);
      }
      return order;
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw new InternalServerErrorException(
        'Buyurtmani olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const existing = await this.prisma.order.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Buyurtma topilmadi: ${id}`);
      }

      const {
        total,
        address,
        location,
        date,
        payType,
        withDelivery,
        status,
        commentToDelivery,
      } = updateOrderDto;

      return await this.prisma.order.update({
        where: { id },
        data: {
          total,
          address,
          date: date ? new Date(date) : undefined,
          payType,
          withDelivery,
          status,
          commentToDelivery,
          ...(location
            ? {
                location: {
                  set: {
                    lat: location.lat,
                    long: location.long,
                  },
                },
              }
            : {}),
        },
      });
    } catch (error) {
      console.error('❌ Error updating order:', error);
      throw new InternalServerErrorException(
        'Buyurtmani yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.order.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Buyurtma topilmadi: ${id}`);
      }

      return await this.prisma.order.delete({ where: { id } });
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      throw new InternalServerErrorException(
        'Buyurtmani o‘chirishda xatolik yuz berdi',
      );
    }
  }
}
