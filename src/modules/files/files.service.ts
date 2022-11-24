import { HttpException, Inject, Injectable } from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';

import { S3 } from 'aws-sdk';
import fs from 'fs';

import {
  FilePathOption,
  FilesServiceInterface,
} from './interfaces/files-service.interface';

import { digitalSpaces } from '../../config';
import { File } from '../../entities/file.entity';
import { s3 } from '../../providers/spaces';
import { FilesProvider } from './enums/files-provider.enums';
import { FilesRepositoryInterface } from './interfaces/files-repository';

@Injectable()
export class FilesService implements FilesServiceInterface {
  constructor(
    @Inject(FilesProvider.FILES_REPOSITORY)
    private readonly filesRepository: FilesRepositoryInterface,
  ) {}

  async findOne(id: number): Promise<string> {
    const file = await this.filesRepository.findOne(id);
    return file.url;
  }

  async uploadImage(
    file: Express.Multer.File,
    filePathOption: FilePathOption,
  ): Promise<File> {
    try {
      const { mimetype } = file;
      const fileSuffix = Date.now() + Math.round(Math.random() * 1e9);
      const extname = file.originalname.split('.')[1];
      const fileName = `${fileSuffix}.${extname}`;
      const newFilePayload = {
        name: `${fileName}`,
        url: ``,
        type: mimetype,
        subtype: extname,
      };

      // if (process.env.NODE_ENV === 'production') {
      const options: S3.PutObjectRequest = {
        Bucket: digitalSpaces.bucket,
        ACL: 'public-read',
        Key: `${filePathOption}/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResponse = s3.putObject(options, (err, data) => {
        if (err) {
          throw new HttpException('Error on upload file.', 400);
        }

        return data;
      });

      const {
        path,
        endpoint: { host, protocol },
      } = uploadResponse.httpRequest;

      const fileUrl = `${protocol}//${host}${path}`;

      newFilePayload.url = fileUrl;
      // } else {
      //   fs.writeFile(`./tmp/${fileName}`, file.buffer, (err) => {
      //     if (err) {
      //       throw new HttpException('Error on write local file.', 400);
      //     }
      //   });

      //   newFilePayload.url = `./tmp/${fileName}`;
      // }

      const newFile = new File(newFilePayload);

      return await this.filesRepository.insert(newFile);
    } catch (error) {
      throw new HttpException('Error on upload file.', 400);
    }
  }
}
