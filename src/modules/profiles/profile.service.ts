import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { validateCPF } from '@/utils/functions';

import { Profile } from '../../entities/profile.entity';
import { User } from '../../entities/user.entity';
import { UpdateProfileFileDto } from './dto/update-profile-avatar.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

const profilePopulate: any = [
  'user',
  'user.email',
  'user.customerId',
  'file',
  'phone',
  'document',
  'locationJson',
];
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: EntityRepository<Profile>,
  ) {}

  async create(user: User) {
    try {
      const profile = new Profile(user);
      await this.profileRepository.persistAndFlush(profile);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async find(id: number) {
    try {
      const profilePayload = await this.profileRepository.findOneOrFail(
        { user: { id } },
        { populate: ['user', 'file', 'user.ratings'] },
      );

      delete profilePayload.user.id;
      delete profilePayload.id;

      return profilePayload;
    } catch (error) {
      throw new HttpException("Can't find this user.", 404);
    }
  }

  async show(authUserId: number) {
    try {
      const profile = await this.profileRepository.findOneOrFail(
        { user: { id: authUserId } },
        { populate: profilePopulate },
      );

      return profile;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    if (!validateCPF(updateProfileDto.document)) {
      throw new HttpException('Invalid document.', HttpStatus.BAD_REQUEST);
    }

    const validateDocumentUnique = await this.profileRepository.count({
      $not: { user: id },
      document: updateProfileDto.document,
    });

    if (validateDocumentUnique > 0) {
      throw new UnprocessableEntityException('Document duplicated.');
    }

    try {
      await this.profileRepository.nativeUpdate(
        { user: { id } },
        updateProfileDto,
      );

      const profile = await this.profileRepository.findOneOrFail(
        { user: { id } },
        { populate: profilePopulate },
      );

      return profile;
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  async updateAvatar(id: number, updateProfileDto: UpdateProfileFileDto) {
    try {
      await this.profileRepository.nativeUpdate(
        { user: { id } },
        updateProfileDto,
      );

      const profile = await this.profileRepository.findOneOrFail(
        { user: { id } },
        { populate: ['user', 'file'] },
      );

      return profile;
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }
}
