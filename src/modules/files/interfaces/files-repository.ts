import { File } from '@/entities/file.entity';

export interface FilesRepositoryInterface {
  insert(entity: File): Promise<File>;
  findOne(id: number): Promise<File>;
}
