import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { FilesServiceInterface } from './interfaces/files-service.interface';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesProvider } from './enums/files-provider.enums';

@Controller('files')
export class FilesController {
  constructor(
    @Inject(FilesProvider.FILES_SERVICE)
    private readonly fileService: FilesServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getFile(@Param() params: { id: number }, @Res() res: Response) {
    return res.download(await this.fileService.findOne(params.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2e6, parts: 2 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadImage(file, 'upload');
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2e6, parts: 2 },
    }),
  )
  uploadProfileAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadImage(file, 'upload/avatar');
  }
}
