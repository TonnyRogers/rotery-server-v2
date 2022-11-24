import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProfileService } from './profile.service';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileFileDto } from './dto/update-profile-avatar.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProfile(@Param() params: { id: number }) {
    return this.profileService.find(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async userProfile(@Req() request: RequestUser) {
    return this.profileService.show(request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserProfile(
    @Req() request: RequestUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(request.user.userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/avatar')
  async updateProfileAvatar(
    @Req() request: RequestUser,
    @Body() updateProfileDto: UpdateProfileFileDto,
  ) {
    return this.profileService.updateAvatar(
      request.user.userId,
      updateProfileDto,
    );
  }
}
