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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/user/decoration/user.decoration';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guards';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by brand name',
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
    return this.brandService.findAll({ name, page, limit, sortOrder });
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
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @RoleD(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
