import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { GuideUserLocationsServiceInterface } from './interfaces/guide-user-locations-service.interface';

import { User } from '@/entities/user.entity';

import { LocationsProvider } from '../locations/enums/locations-provider.enum';
import { LocationsRepositoryInterface } from '../locations/interfaces/repository-interface';

@Injectable()
export class GuideUserLocationsService
  implements GuideUserLocationsServiceInterface
{
  constructor(
    @Inject(LocationsProvider.LOCATION_REPOSITORY)
    private readonly locationRepository: LocationsRepositoryInterface,
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
  ) {}

  private async validateLocationAndUser({
    alias,
    id,
  }: {
    alias: string;
    id: number;
  }): Promise<User> {
    const location = await this.locationRepository.findOne({ alias });

    if (!location)
      throw new HttpException(
        "Can't find location with this alias.",
        HttpStatus.CONFLICT,
      );

    const user = await this.usersRepository.findOne({ id });

    if (!user.isHost)
      throw new HttpException(
        "You can't do this, guides only.",
        HttpStatus.CONFLICT,
      );

    return user;
  }

  async add(alias: string, id: number): Promise<User> {
    const user = await this.validateLocationAndUser({ alias, id });

    let aliasArray = [];
    const verifyIfIsNotNull = user.locationAliasArray !== null;

    if (verifyIfIsNotNull) {
      aliasArray = [...user.locationAliasArray];
    }

    if (
      verifyIfIsNotNull &&
      user.locationAliasArray.find((aliasStr) => aliasStr === alias)
    ) {
      throw new HttpException(
        'You already joined to this location.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    aliasArray.push(alias);
    await this.usersRepository.nativeUpdate(
      { id },
      { locationAliasArray: aliasArray },
    );
    return await this.usersRepository.findOne({ id }, { flushMode: 0 });
  }

  async remove(alias: string, id: number): Promise<User> {
    const user = await this.validateLocationAndUser({ alias, id });

    const aliasIndex = user.locationAliasArray.findIndex(
      (aliasItem) => aliasItem === alias,
    );

    if (aliasIndex !== -1) {
      user.locationAliasArray.splice(aliasIndex, 1);
    }

    await this.usersRepository.nativeUpdate(
      { id },
      { locationAliasArray: user.locationAliasArray },
    );
    return await this.usersRepository.findOne({ id });
  }

  async findAll(alias: string): Promise<User[]> {
    return await this.usersRepository.find({
      locationAliasArray: { $contains: [alias] },
      isHost: true,
      isActive: true,
    });
  }
}
