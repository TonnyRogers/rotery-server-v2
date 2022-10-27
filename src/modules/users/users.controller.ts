import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { UserRole } from '@/entities/user.entity';
import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('device')
  @HttpCode(201)
  async setToken(@Req() request: RequestUser, @Body() body: { token: string }) {
    return this.userService.setDeviceToken(request.user.userId, body.token);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  findAll(@Query() query: { username: string }) {
    return this.userService.findAll(query.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  findOne(@Param() params: { id: number }) {
    return this.userService.findOne({ id: params.id });
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(201)
  async update(@Req() request: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(request.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(201)
  async delete(@Req() request: RequestUser) {
    return this.userService.delete(request.user.userId);
  }

  @Get('activate/:code')
  async activateUser(@Param() params: { code: string }) {
    return this.userService.activate(params.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate-guide/:userId')
  async activateGuide(
    @Req() request: RequestUser,
    @Param() params: { userId: number },
  ) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.userService.activateGuide(params.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('guide/is-active')
  async isGuideActive(@Req() request: RequestUser) {
    return this.userService.isActiveGuide(request.user.userId);
  }
}
