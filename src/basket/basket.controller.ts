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
import { BasketService } from './basket.service';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBasketItemDto } from './dto/create-basket.dto';
import { ApiQuery } from '@nestjs/swagger';
import { MeasureType, UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guards';
import { RoleD } from 'src/user/decoration/user.decoration';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: CreateBasketItemDto, @Req() req) {
    let userId = req['user-id'];
    return this.basketService.create(data, userId);
  }

  @Get()
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'levelId', required: false })
  @ApiQuery({ name: 'measure', required: false, enum: MeasureType })
  @ApiQuery({ name: 'toolId', required: false })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('productId') productId?: string,
    @Query('levelId') levelId?: string,
    @Query('measure') measure?: MeasureType,
    @Query('toolId') toolId?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.basketService.findAll({
      productId,
      levelId,
      measure,
      toolId,
      sortBy,
      sortOrder,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basketService.findOne(id);
  }

  @Patch(':id')
  @RoleD(UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updateBasketDto: UpdateBasketDto,
    @Req() req,
  ) {
    let userId = req['user-id'];
    return this.basketService.update(id, updateBasketDto, userId);
  }
  @RoleD(UserRole.ADMIN, UserRole.USER_FIZ, UserRole.USER_YUR)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basketService.remove(id);
  }
}
