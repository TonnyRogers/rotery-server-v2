import { ContentList } from '@/entities/content-list.entity';

import { CreateContentDto } from '../dto/create-content.dto';
import { FindAllContentDto } from '../dto/find-all-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';

export interface ContentServiceInterface {
  create(dto: CreateContentDto): Promise<ContentList>;
  update(id: number, dto: UpdateContentDto): Promise<ContentList>;
  getAll(findParams: FindAllContentDto): Promise<ContentList[]>;
  getOne(findParams: FindAllContentDto): Promise<ContentList>;
  remove(id: number): Promise<void>;
}
