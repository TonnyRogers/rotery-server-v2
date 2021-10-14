import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NewPasswordDto } from './dto/new-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordsService } from './reset-passwords.service';

@Controller('users')
export class ResetPasswordsController {
  constructor(
    @Inject(ResetPasswordsService)
    private resetPasswordsService: ResetPasswordsService,
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
