import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '../../entities/profile.entity';
import { UpdateProfileFileDto } from './dto/update-profile-avatar.dto';

const profilePopulate = [
  'user',
  'user.email',
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
        ['user', 'file', 'user.ratings'],
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
        profilePopulate,
      );

      return profile;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      await this.profileRepository.nativeUpdate(
        { user: { id } },
        updateProfileDto,
      );

      const profile = await this.profileRepository.findOneOrFail(
        { user: { id } },
        profilePopulate,
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
        ['user', 'file'],
      );

      return profile;
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }
}
