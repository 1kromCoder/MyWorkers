import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCommentDto, userId: string) {
    const { orderId, message, commentMasters } = data;

    try {
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userExists) {
        throw new NotFoundException(`Foydalanuvchi topilmadi: ${userId}`);
      }

      const orderExists = await this.prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!orderExists) {
        throw new NotFoundException(`orderId topilmadi`);
      }

      const comment = await this.prisma.comment.create({
        data: {
          userId,
          orderId,
          message,
        },
      });

      for (const cm of commentMasters) {
        const masterExists = await this.prisma.master.findUnique({
          where: { id: cm.masterId },
        });

        if (!masterExists) {
          throw new NotFoundException(`masterId topilmadi`);
        }

        await this.prisma.commentMaster.create({
          data: {
            commentId: comment.id,
            masterId: cm.masterId,
            star: cm.star,
          },
        });
      }

      return await this.prisma.comment.findUnique({
        where: { id: comment.id },
        include: {
          user: true,
          order: true,
          CommentMaster: {
            include: {
              master: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error creating comment:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Fikr qoldirishda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: {
    message?: string;
    orderId?: string;
    userId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: any;
    limit?: any;
  }) {
    try {
      const {
        message,
        orderId,
        userId,
        sortBy = 'id',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (message) {
        where.message = { contains: message, mode: 'insensitive' };
      }
      if (orderId) {
        where.orderId = orderId;
      }
      if (userId) {
        where.userId = userId;
      }

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const comments = await this.prisma.comment.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limitNumber,
        include: {
          user: true,
          order: true,
          CommentMaster: {
            include: {
              master: true,
            },
          },
        },
      });

      const total = await this.prisma.comment.count({ where });

      return {
        data: comments,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
      throw new InternalServerErrorException(
        'Kommentlar ro‘yxatini olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
        include: {
          user: true,
          order: true,
          CommentMaster: {
            include: {
              master: true,
            },
          },
        },
      });

      if (!comment) {
        throw new NotFoundException(`Comment topilmadi: ${id}`);
      }

      return comment;
    } catch (error) {
      console.error(`❌ Error fetching comment ${id}:`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Kommentni olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: string, updateDto: UpdateCommentDto) {
    const { message } = updateDto;

    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new NotFoundException(`Comment topilmadi: ${id}`);
      }

      return await this.prisma.comment.update({
        where: { id },
        data: {
          message,
        },
        include: {
          user: true,
          order: true,
          CommentMaster: {
            include: {
              master: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(`❌ Error updating comment ${id}:`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Kommentni yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new NotFoundException(`Comment topilmadi: ${id}`);
      }

      // Oldin CommentMaster larni o‘chirish
      await this.prisma.commentMaster.deleteMany({
        where: { commentId: id },
      });

      // Keyin commentni o‘chirish
      await this.prisma.comment.delete({
        where: { id },
      });

      return { message: 'Komment o‘chirildi', id };
    } catch (error) {
      console.error(`❌ Error deleting comment ${id}:`, error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Kommentni o‘chirishda xatolik yuz berdi',
      );
    }
  }
}
