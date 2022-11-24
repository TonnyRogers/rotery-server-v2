import { Inject, Injectable } from '@nestjs/common';

import { FilesServiceInterface } from '../files/interfaces/files-service.interface';
import { ContentServiceInterface } from './interfaces/content-service.interface';

import { ContentList } from '@/entities/content-list.entity';

import { FilesProvider } from '../files/enums/files-provider.enums';
import { CreateContentDto } from './dto/create-content.dto';
import { FindAllContentDto } from './dto/find-all-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentProvider } from './enums/content-provider.enum';
import { ContentRepositoryInterface } from './interfaces/content-repository.interface';

@Injectable()
export class ContentService implements ContentServiceInterface {
  constructor(
    @Inject(ContentProvider.CONTENT_REPOSITORY)
    private readonly contentRepository: ContentRepositoryInterface,
    @Inject(FilesProvider.FILES_SERVICE)
    private readonly filesService: FilesServiceInterface,
  ) {}

  async create(dto: CreateContentDto): Promise<ContentList> {
    const newFile = dto.file
      ? await this.filesService.uploadImage(dto.file, 'upload')
      : null;

    const content = new ContentList({
      ...dto,
      file: newFile,
    });

    return await this.contentRepository.insert(content);
  }

  async update(id: number, dto: UpdateContentDto): Promise<ContentList> {
    return await this.contentRepository.update(id, dto);
  }

  async getAll(findParams: FindAllContentDto): Promise<ContentList[]> {
    const formatedParams = {};

    Object.keys(findParams).forEach((key) => {
      if (findParams[key]) {
        formatedParams[key] = findParams[key];
      }
    });

    return await this.contentRepository.findAll(formatedParams);
  }

  async getOne(findParams: FindAllContentDto): Promise<ContentList> {
    const formatedParams = {};

    Object.keys(findParams).forEach((key) => {
      if (findParams[key]) {
        formatedParams[key] = findParams[key];
      }
    });

    return await this.contentRepository.findOne(formatedParams);
  }

  async remove(id: number): Promise<void> {
    return this.contentRepository.delete(id);
  }
}
