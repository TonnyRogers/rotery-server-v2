import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param() params: { id: number }) {
    return this.userService.findOne({ id: params.id });
  }

  @Put(':id')
  @HttpCode(201)
  async update(
    @Param() params: { id: number },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(params.id, updateUserDto);
  }
}
