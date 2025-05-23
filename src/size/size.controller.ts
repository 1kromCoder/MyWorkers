import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/user/decoration/user.decoration';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guards';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by size name',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  findAll(
    @Query('name') name?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.sizeService.findAll({ name, page, limit, sortOrder });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(id);
  }

  @Patch(':id')
  @RoleD(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(id, updateSizeDto);
  }

  @Delete(':id')
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.sizeService.remove(id);
  }
}
