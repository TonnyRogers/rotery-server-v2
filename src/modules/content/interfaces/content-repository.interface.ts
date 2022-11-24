import { ContentList, ContentType } from '@/entities/content-list.entity';

export interface FindAllContentRepositoryQueryParams {
  type?: ContentType;
  key?: string;
}

export interface ContentRepositoryInterface {
  insert(entity: ContentList): Promise<ContentList>;
  update(id: number, entity: Partial<ContentList>): Promise<ContentList>;
  findAll(param: FindAllContentRepositoryQueryParams): Promise<ContentList[]>;
  findOne(param: FindAllContentRepositoryQueryParams): Promise<ContentList>;
  delete(id: number): Promise<void>;
}
