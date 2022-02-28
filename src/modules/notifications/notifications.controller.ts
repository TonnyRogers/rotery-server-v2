import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParamId, RequestUser } from '@/utils/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
  ) {}

  @Get()
  async notifications(@Req() request: RequestUser) {
    return this.notificationsService.findAll(request.user.userId);
  }

  @Delete(':id')
  async setReaded(@Param() params: ParamId, @Req() request: RequestUser) {
    return this.notificationsService.read(request.user.userId, params.id);
  }
}
