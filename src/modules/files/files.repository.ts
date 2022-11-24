import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { File } from '@/entities/file.entity';

import { FilesRepositoryInterface } from './interfaces/files-repository';

export class FilesRepository implements FilesRepositoryInterface {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
  ) {}

  async insert(entity: File): Promise<File> {
    const newFile = this.fileRepository.create(entity);

    await this.fileRepository.persistAndFlush(newFile);

    return newFile;
  }

  async findOne(id: number): Promise<File> {
    const file = await this.fileRepository.findOne({ id });

    if (!file) {
      throw new UnprocessableEntityException('File not found.');
    }

    return file;
  }
}
