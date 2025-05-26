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
import { ShowcaseService } from './showcase.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleD } from 'src/user/decoration/user.decoration';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guards';

@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Post()
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcaseService.create(createShowcaseDto);
  }

  @Get()
  @ApiQuery({ name: 'name_uz', required: false, type: String })
  @ApiQuery({ name: 'name_ru', required: false, type: String })
  @ApiQuery({ name: 'name_en', required: false, type: String })
  // @ApiQuery({ name: 'description_uz', required: false, type: String })
  // @ApiQuery({ name: 'description_ru', required: false, type: String })
  // @ApiQuery({ name: 'description_en', required: false, type: String })
  @ApiQuery({ name: 'link', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: any) {
    return this.showcaseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showcaseService.findOne(id);
  }

  @Patch(':id')
  @RoleD(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcaseService.update(id, updateShowcaseDto);
  }

  @Delete(':id')
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.showcaseService.remove(id);
  }
}
