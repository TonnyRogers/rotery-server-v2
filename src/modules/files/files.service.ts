import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import fs from 'fs';
import { digitalSpaces } from 'src/config';
import { s3 } from '../../providers/spaces';
import { File } from '../../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: EntityRepository<File>,
  ) {}

  async findOne(id: number): Promise<string> {
    try {
      const file = await this.filesRepository.findOneOrFail({ id });
      return file.url;
    } catch (error) {
      throw new HttpException('File not found.', 404);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<File> {
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

      if (process.env.NODE_ENV === 'production') {
        const options: S3.PutObjectRequest = {
          Bucket: digitalSpaces.bucket,
          ACL: 'public-read',
          Key: `upload/${fileName}`,
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
      } else {
        fs.writeFile(`./tmp/${fileName}`, file.buffer, (err) => {
          if (err) {
            throw new HttpException('Error on write local file.', 400);
          }
        });

        newFilePayload.url = `./tmp/${fileName}`;
      }

      const newFile = new File(newFilePayload);

      await this.filesRepository.persistAndFlush(newFile);

      return newFile;
    } catch (error) {
      throw new HttpException('Error on upload file.', 400);
    }
  }
}
