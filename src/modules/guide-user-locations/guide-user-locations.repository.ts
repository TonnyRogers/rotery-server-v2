import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { GuideUserLocation } from '@/entities/guide-user-location.entity';

import { GuideUserLocationsRepositoryInterface } from './interfaces/guide-user-locations-repository.interface';

export class GuideUserLocationsRepository
  implements GuideUserLocationsRepositoryInterface
{
  constructor(
    @InjectRepository(GuideUserLocation)
    private readonly guideUserLocationsRepository: EntityRepository<GuideUserLocation>,
  ) {}

  async create(entity: GuideUserLocation): Promise<GuideUserLocation> {
    const newGuideLocation = this.guideUserLocationsRepository.create(entity);

    await this.guideUserLocationsRepository.persistAndFlush(newGuideLocation);
    return newGuideLocation;
  }

  async delete(filters: { user: number; location: number }): Promise<void> {
    await this.guideUserLocationsRepository.nativeDelete({
      location: filters.location,
      user: filters.user,
    });
  }

  async findAll(filters: { location: number }): Promise<GuideUserLocation[]> {
    return await this.guideUserLocationsRepository.find(
      {
        location: filters.location,
      },
      { populate: ['user.profile.file', 'user.ratings'] },
    );
  }

  async count(filters: { user: number; location: number }): Promise<number> {
    return await this.guideUserLocationsRepository.count({ ...filters });
  }
}
