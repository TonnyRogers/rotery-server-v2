import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ContentServiceInterface } from './interfaces/content-service.interface';

import { UserRole } from '@/entities/user.entity';
import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContentDto } from './dto/create-content.dto';
import { FindAllContentDto } from './dto/find-all-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentProvider } from './enums/content-provider.enum';

@Controller('contents')
export class ContentController {
  constructor(
    @Inject(ContentProvider.CONTENT_SERVICE)
    private readonly contentService: ContentServiceInterface,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2e6, parts: 2 },
    }),
  )
  async create(@Req() request: RequestUser, @Body() dto: CreateContentDto) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.contentService.create(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Req() request: RequestUser,
    @Param() params: { id: number },
    @Body() dto: UpdateContentDto,
  ) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.contentService.update(params.id, dto);
  }

  @Get('all')
  async getAll(@Query() query: FindAllContentDto) {
    return this.contentService.getAll(query);
  }

  @Get()
  async getOne(@Query() query: FindAllContentDto) {
    return this.contentService.getOne(query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() request: RequestUser, @Param() params: { id: number }) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.contentService.remove(params.id);
  }
}
