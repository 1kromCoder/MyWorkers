import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateStar } from './dto/create-star.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/user/decoration/user.decoration';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guards';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createMasterDto: CreateMasterDto) {
    return this.masterService.create(createMasterDto);
  }

  @Get()
  @RoleD(
    UserRole.ADMIN,
    UserRole.USER_FIZ,
    UserRole.USER_YUR,
    UserRole.VIEWER_ADMIN,
  )
  @UseGuards(AuthGuard, RoleGuard)
  @ApiQuery({
    name: 'fullName',
    required: false,
    description: 'Full name filter',
  })
  @ApiQuery({ name: 'phone', required: false, description: 'Phone filter' })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Active status filter',
    enum: ['true', 'false'],
  })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: any) {
    return this.masterService.findAll(query);
  }
  @Get(':id')
  @RoleD(
    UserRole.ADMIN,
    UserRole.USER_FIZ,
    UserRole.USER_YUR,
    UserRole.VIEWER_ADMIN,
  )
  @UseGuards(AuthGuard, RoleGuard)
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(id);
  }

  @Patch(':id')
  @RoleD(
    UserRole.ADMIN,
    UserRole.USER_FIZ,
    UserRole.USER_YUR,
    UserRole.SUPER_ADMIN,
  )
  @UseGuards(AuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateMasterDto: UpdateMasterDto) {
    return this.masterService.update(id, updateMasterDto);
  }

  @Delete(':id')
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.masterService.remove(id);
  }
  @UseGuards(AuthGuard)
  @Post('star')
  @ApiOperation({ summary: 'Masterga baho qo‘shish (1 dan 5 gacha)' })
  async createStar(@Body() data: CreateStar, @Req() req) {
    const userId = req['user-id'];
    return this.masterService.createStar(data, userId);
  }
}
