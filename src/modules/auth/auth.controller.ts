import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthServiceInterface } from './interfaces/auth-service.interface';

import { Cookies } from '@/decorators/cookies.decorator';
import { RequestUser } from '@/utils/types';

import { AuthProvider } from './enums/auth-provider.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthProvider.AUTH_SERVICE)
    private readonly authService: AuthServiceInterface,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any, @Res() res: Response) {
    const response = await this.authService.login(req.user, res);
    return res.status(200).json(response);
  }

  @Post('refresh')
  async refreshToken(@Cookies('rfh') rfh: string) {
    return await this.authService.refreshToken(rfh);
  }

  @Get('logout/:token')
  async logout(@Param() params: { token: string }) {
    return this.authService.logout(params.token);
  }
}
