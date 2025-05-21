import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { AdminRole, CreateAdmin } from './dto/admin.create.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto.ts';
import { RefreshTokenDto } from './dto/refresh-tok.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailService,
  ) {}
  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
  async register(data: CreateUserDto) {
    const verified = await this.prisma.verifyEmail.findFirst({
      where: { email: data.email },
    });
    if (!verified) {
      throw new BadRequestException('Emailni tasdiqlang');
    }
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const region = await this.prisma.region.findUnique({
      where: { id: data.regionId },
    });

    if (!region) {
      throw new BadRequestException('Invalid regionId');
    }
    const allowedRoles: UserRole[] = [
      UserRole.USER_FIZ,
      UserRole.USER_YUR,
      UserRole.VIEWER_ADMIN,
    ];

    if (!allowedRoles.includes(data.role)) {
      throw new BadRequestException('Role is not allowed for registration');
    }
    const hash = bcrypt.hashSync(data.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
        User_YUR:
          data.role === 'USER_YUR' && data.User_YUR
            ? {
                create: data.User_YUR.map((User_YUR) => ({
                  INN: User_YUR.INN,
                  R_S: User_YUR.R_S,
                  Address: User_YUR.Address,
                  Bank: User_YUR.Bank,
                  MFO: User_YUR.MFO,
                })),
              }
            : undefined,
      },
      include: { User_YUR: true },
    });

    return newUser;
  }
  async createAdmin(data: CreateAdmin) {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const region = await this.prisma.region.findUnique({
      where: { id: data.regionId },
    });

    if (!region) {
      throw new BadRequestException('Invalid regionId');
    }
    let hash = bcrypt.hashSync(data.password, 10);
    let dataA = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        regionId: data.regionId,
        phone: data.phone,
        password: hash,
        role: AdminRole.ADMIN,
      },
    });
    return data;
  }
  async login(data: LoginUserDto, req: Request) {
    if (!data.email || !data.password) {
      throw new UnauthorizedException('Email or password is missing');
    }

    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const match = bcrypt.compareSync(data.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Wrong password');
    }

    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown';

    const deviceInfo = req.headers['user-agent'] || 'unknown';

    await this.prisma.session.create({
      data: {
        userId: user.id,
        ipAddress: ip.toString(),
        deviceInfo,
      },
    });

    const access_token = this.jwt.sign({ id: user.id, role: user.role });
    const refresh_token = this.jwt.sign({ id: user.id, role: user.role });

    return { access_token, refresh_token };
  }
  async findAll(query: any) {
    try {
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const skip = (page - 1) * limit;
      const sortBy = query.sortBy || 'createdAt';
      const order = query.order === 'desc' ? 'desc' : 'asc';

      const where: any = {};

      if (query.firstName) {
        where.firstName = { contains: query.firstName, mode: 'insensitive' };
      }
      if (query.lastName) {
        where.lastName = { contains: query.lastName, mode: 'insensitive' };
      }
      if (query.email) {
        where.email = { contains: query.email, mode: 'insensitive' };
      }
      if (query.phone) {
        where.phone = { contains: query.phone, mode: 'insensitive' };
      }
      if (query.role) {
        where.role = query.role;
      }
      if (query.regionId) {
        where.regionId = query.regionId;
      }

      const users = await this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          User_YUR: true,
        },
      });

      const total = await this.prisma.user.count({ where });

      return {
        data: users,
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
    return await this.prisma.user.findFirst({ where: { id } });
  }
  async me(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is missing');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        Region: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { User_YUR, role, ...rest } = updateUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (role === 'USER_YUR') {
      await this.prisma.user_YUR.deleteMany({
        where: { userId: id },
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        role,
        User_YUR:
          role === 'USER_YUR' && User_YUR
            ? {
                create: User_YUR.map((item) => ({
                  INN: item.INN,
                  R_S: item.R_S,
                  Address: item.Address,
                  Bank: item.Bank,
                  MFO: item.MFO,
                })),
              }
            : undefined,
      },
      include: {
        User_YUR: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token },
    });

    await this.mailer.sendEmail(
      data.email,
      'Password Reset Code',
      `Your password reset code is: ${token}`,
    );

    return { message: 'Reset token sent to email' };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.findUserByEmail(data.email);
    if (!user || user.resetToken !== data.token) {
      throw new BadRequestException('Invalid token or email');
    }

    const hashed = bcrypt.hashSync(data.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
      },
    });

    return { message: 'Password reset successful' };
  }
  async refresh(data: RefreshTokenDto) {
    try {
      let user = this.jwt.verify(data.refreshToken);

      const newAccestoken = this.jwt.sign({ id: user.id, role: user.role });
      return { newAccestoken };
    } catch (error) {
      throw new InternalServerErrorException('internal server error');
    }
  }
}
