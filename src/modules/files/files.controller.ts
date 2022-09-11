import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { FilesService } from './files.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getFile(@Param() params: { id: number }, @Res() res: Response) {
    return res.download(await this.fileService.findOne(params.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2e6, parts: 1 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadImage(file, 'upload');
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2e6, parts: 1 },
    }),
  )
  uploadProfileAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadImage(file, 'upload/avatar');
  }
}
