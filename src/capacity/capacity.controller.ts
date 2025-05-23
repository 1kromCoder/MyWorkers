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
import { CapacityService } from './capacity.service';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleD } from 'src/user/decoration/user.decoration';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guards';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('capacity')
export class CapacityController {
  constructor(private readonly capacityService: CapacityService) {}

  @Post()
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createCapacityDto: CreateCapacityDto) {
    return this.capacityService.create(createCapacityDto);
  }
  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by capacity name',
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
    return this.capacityService.findAll({ name, page, limit, sortOrder });
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
    return this.capacityService.findOne(id);
  }

  @Patch(':id')
  @RoleD(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updateCapacityDto: UpdateCapacityDto,
  ) {
    return this.capacityService.update(id, updateCapacityDto);
  }

  @Delete(':id')
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.capacityService.remove(id);
  }
}
