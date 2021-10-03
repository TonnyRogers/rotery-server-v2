import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpException, Injectable } from '@nestjs/common';
import { Lodging } from '../../entities/lodging.entity';
import { CreateLodgingDto } from './dto/create-lodging.dto';

@Injectable()
export class LodgingsService {
  constructor(
    @InjectRepository(Lodging)
    private lodgingRepository: EntityRepository<Lodging>,
  ) {}

  async create(createLodgingDto: CreateLodgingDto) {
    try {
      const exists = await this.findOne(createLodgingDto.name);

      if (exists) {
        throw new HttpException('This lodging already exists.', 401);
      }

      const newLodging = new Lodging(createLodgingDto);
      await this.lodgingRepository.persistAndFlush(newLodging);

      return newLodging;
    } catch (error) {
      console.log(error);

      throw new HttpException('Fail on create new lodging.', 400);
    }
  }

  async findAll() {
    try {
      return this.lodgingRepository.findAll();
    } catch (error) {
      throw new HttpException('Error on list lodgings.', 400);
    }
  }

  async findOne(lodgingName: string) {
    try {
      return this.lodgingRepository.findOne({ name: lodgingName });
    } catch (error) {
      throw new HttpException('Error on list lodgings.', 400);
    }
  }
}
