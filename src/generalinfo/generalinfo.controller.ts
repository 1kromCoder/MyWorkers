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
import { GeneralinfoService } from './generalinfo.service';
import { UpdateGeneralinfoDto } from './dto/update-generalinfo.dto';
import { CreateGeneralInfoDto } from './dto/create-generalinfo.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleD } from 'src/user/decoration/user.decoration';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guards';

@Controller('generalinfo')
export class GeneralinfoController {
  constructor(private readonly generalinfoService: GeneralinfoService) {}

  @Post()
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() createGeneralinfoDto: CreateGeneralInfoDto) {
    return this.generalinfoService.create(createGeneralinfoDto);
  }

  @Get()
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'phone', required: false })
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
    return this.generalinfoService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalinfoService.findOne(id);
  }

  @Patch(':id')
  @RoleD(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updateGeneralinfoDto: UpdateGeneralinfoDto,
  ) {
    return this.generalinfoService.update(id, updateGeneralinfoDto);
  }

  @Delete(':id')
  @RoleD(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.generalinfoService.remove(id);
  }
}
