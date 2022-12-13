import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ResetPasswordServiceInterface } from './interfaces/reset-password-service.interface';

import { NewPasswordDto } from './dto/new-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordProviders } from './enums/providers.enum';

@Controller('users')
export class ResetPasswordsController {
  constructor(
    @Inject(ResetPasswordProviders.RESET_PASSWORD_SERVICE)
    private resetPasswordsService: ResetPasswordServiceInterface,
  ) {}

  @Post('reset-password')
  async requestReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordsService.create(resetPasswordDto);
  }

  @Get('reset-password/:code')
  async validateCode(@Param() params: { code: number }) {
    return this.resetPasswordsService.findOne(params.code);
  }

  @Put('reset-password/:code')
  async setNewPassword(
    @Param() params: { code: number },
    @Body() newPasswordDto: NewPasswordDto,
  ) {
    return this.resetPasswordsService.reset(params.code, newPasswordDto);
  }
}
