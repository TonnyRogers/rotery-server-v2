import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { GuideUserLocationsService } from './guide-user-locations.service';
import { GuideUserLocationsServiceInterface } from './interfaces/guide-user-locations-service.interface';
import { UsersService } from './users.service';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { GuideUserLocationsJoinDto } from './dto/guide-user-join.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(GuideUserLocationsService)
    private readonly guideUserLocationsService: GuideUserLocationsServiceInterface,
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
  @Put('/guides/join-location')
  @HttpCode(201)
  async joinLocation(
    @Req() request: RequestUser,
    @Body() body: GuideUserLocationsJoinDto,
  ) {
    return this.guideUserLocationsService.add(body.alias, request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/guides/leave-location')
  @HttpCode(201)
  async leaveLocation(
    @Req() request: RequestUser,
    @Body() body: GuideUserLocationsJoinDto,
  ) {
    return this.guideUserLocationsService.remove(
      body.alias,
      request.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/guides/by-location')
  @HttpCode(201)
  async findGuidesByLocation(@Query() body: GuideUserLocationsJoinDto) {
    return this.guideUserLocationsService.findAll(body.alias);
  }
}
