import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserConnectionService } from './user-connections.service';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@UseGuards(JwtAuthGuard)
@Controller('connections')
export class UserConnectionController {
  constructor(
    @Inject(UserConnectionService)
    private userConnectionService: UserConnectionService,
  ) {}
  @Post(':id')
  async makeConnection(
    @Param() params: { id: number },
    @Req() request: RequestUser,
  ) {
    return this.userConnectionService.connect(request.user.userId, params.id);
  }

  @Get()
  async getConnectionsAndInvites(@Req() request: RequestUser) {
    return this.userConnectionService.findAll(request.user.userId);
  }

  @Put(':id')
  async updateConnection(
    @Req() request: RequestUser,
    @Param() params: { id: number },
    @Body() updateConnectionDto: UpdateConnectionDto,
  ) {
    return this.userConnectionService.update(
      request.user.userId,
      params.id,
      updateConnectionDto,
    );
  }

  @Delete(':id')
  async destroyConnection(
    @Req() request: RequestUser,
    @Param() params: { id: number },
  ) {
    return this.userConnectionService.delete(request.user.userId, params.id);
  }
}
