import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from 'src/mail/mail.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify.dto';
import { Request as ExpressRequest } from 'express';
import { RefreshTokenDto } from './dto/refresh-tok.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAdmin } from './dto/admin.create.dto';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to email' })
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.mailService.sendOtp(dto.email);
    return { message: 'OTP sent to email' };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP' })
  async verify(@Body() dto: VerifyOtpDto) {
    const isValid = await this.mailService.verifyOtp(dto.email, dto.otp);
    if (isValid) return { message: 'OTP is correct' };
    else return { message: 'Invalid OTP' };
  }
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Req() req: ExpressRequest) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return this.userService.login(loginUserDto, req);
  }
  @Post('add-Admin')
  addAdmin(@Body() dto: CreateAdmin) {
    return this.userService.createAdmin(dto);
  }
  @Post('refresh')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.userService.refresh(dto);
  }
  @Get()
  @ApiQuery({ name: 'firstName', required: false })
  @ApiQuery({ name: 'lastName', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['ADMIN', 'SUPER_ADMIN', 'VIEWER_ADMIN', 'USER_FIZ', 'USER_YUR'],
  })
  @ApiQuery({ name: 'regionId', required: false })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }
  @UseGuards(AuthGuard)
  @Get('/me')
  me(@Req() req: Request) {
    const userId = req['user-id'];
    return this.userService.me(userId);
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
