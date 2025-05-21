import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserFromToken } from 'src/user/decoration/user.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req) {
    let userId = req['user-id'];
    return this.sessionService.me(userId);
  }
  @Delete('/:id')
  deleteSession(@Param('id') id: string, @UserFromToken('id') userId: string) {
    return this.sessionService.remove(id, userId);
  }
}
