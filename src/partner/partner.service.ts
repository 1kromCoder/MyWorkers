import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreatePartnerDto) {
    try {
      let post = await this.prisma.partner.create({ data });
      return post;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll() {
    try {
      let all = await this.prisma.partner.findMany();
      return all;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.partner.findFirst({ where: { id } });
      return one;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(id: string, data: UpdatePartnerDto) {
    try {
      let edit = await this.prisma.partner.update({ where: { id }, data });
      return edit;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      let del = await this.prisma.partner.delete({ where: { id } });
      return del;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
