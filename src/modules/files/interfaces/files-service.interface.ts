export type FilePathOption = 'upload' | 'upload/avatar';

import { File } from '@/entities/file.entity';

export interface FilesServiceInterface {
  findOne(id: number): Promise<string>;
  uploadImage(
    file: Express.Multer.File,
    filePathOption: FilePathOption,
  ): Promise<File>;
}
