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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { PayType, StatusType } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: CreateOrderDto, @Req() req) {
    let userId = req['user-id'];
    return this.orderService.create(data, userId);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: StatusType })
  @ApiQuery({ name: 'payType', required: false, enum: PayType })
  @ApiQuery({
    name: 'withDelivery',
    required: false,
    description: 'Boolean as string',
    enum: ['true', 'false'],
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Filter from date (ISO string)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'Filter to date (ISO string)',
  })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: any) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
