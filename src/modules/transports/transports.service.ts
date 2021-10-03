import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Injectable } from '@nestjs/common';
import { Transport } from '../../entities/transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';

@Injectable()
export class TransportsService {
  constructor(
    @InjectRepository(Transport)
    private TransportRepository: EntityRepository<Transport>,
  ) {}

  async create(createTransportDto: CreateTransportDto) {
    try {
      const exists = await this.findOne(createTransportDto.name);

      if (exists) {
        throw new HttpException('This transport already exists.', 401);
      }

      const newTransport = new Transport(createTransportDto);
      await this.TransportRepository.persistAndFlush(newTransport);

      return newTransport;
    } catch (error) {
      throw new HttpException('Fail on create new transport.', 400);
    }
  }

  async findAll() {
    try {
      return this.TransportRepository.findAll();
    } catch (error) {
      throw new HttpException('Error on list transports.', 400);
    }
  }

  async findOne(transportName: string) {
    try {
      return this.TransportRepository.findOne({ name: transportName });
    } catch (error) {
      throw new HttpException('Error on list transports.', 400);
    }
  }
}
