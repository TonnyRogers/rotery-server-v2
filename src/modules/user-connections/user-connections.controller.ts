import {
  Controller,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestUser } from 'utils/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserConnectionService } from './user-connections.service';

@Controller('connections')
export class UserConnectionController {
  constructor(
    @Inject(UserConnectionService)
    private userConnectionService: UserConnectionService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async makeConnection(
    @Param() params: { id: number },
    @Req() request: RequestUser,
  ) {
    return this.userConnectionService.connect(request.user.userId, params.id);
  }
}
