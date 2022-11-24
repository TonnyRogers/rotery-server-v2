import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ContentList } from '@/entities/content-list.entity';

import {
  ContentRepositoryInterface,
  FindAllContentRepositoryQueryParams,
} from './interfaces/content-repository.interface';

export class ContentRepository implements ContentRepositoryInterface {
  constructor(
    @InjectRepository(ContentList)
    private readonly contentRepository: EntityRepository<ContentList>,
  ) {}

  async insert(entity: ContentList): Promise<ContentList> {
    const newContent = this.contentRepository.create(entity);
    await this.contentRepository.persistAndFlush(newContent);
    return newContent;
  }

  async update(id: number, entity: Partial<ContentList>): Promise<ContentList> {
    const content = await this.contentRepository.findOne({ id });

    if (!content) {
      throw new UnprocessableEntityException("Can't find this content.");
    }

    await this.contentRepository.nativeUpdate({ id }, entity);

    return await this.contentRepository.findOne({ id });
  }

  async findAll(
    param: FindAllContentRepositoryQueryParams,
  ): Promise<ContentList[]> {
    return await this.contentRepository.find(param);
  }

  async findOne(
    param: FindAllContentRepositoryQueryParams,
  ): Promise<ContentList> {
    return await this.contentRepository.findOne(param);
  }

  async delete(id: number): Promise<void> {
    await this.contentRepository.nativeDelete({ id });
  }
}
