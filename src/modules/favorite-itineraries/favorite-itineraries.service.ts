import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { ItinerariesService } from '../itineraries/itineraries.service';

@Injectable()
export class FavoriteItinerariesService {
  constructor(
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @Inject(ItinerariesService)
    private itinerariesService: ItinerariesService,
  ) {}

  async list(authUserId: number) {
    try {
      const user = await this.userRepository.findOneOrFail({ id: authUserId }, [
        'favoriteItineraries.owner.profile.file',
        'favoriteItineraries.photos.file',
        'favoriteItineraries.members.user',
        'favoriteItineraries.questions',
        'favoriteItineraries.activities',
        'favoriteItineraries.transports',
        'favoriteItineraries.lodgings',
      ]);
      user.favoriteItineraries.populated(true);

      return user.favoriteItineraries;
    } catch (error) {
      throw new HttpException("Can't find favorites.", 400);
    }
  }

  async add(authUserId: number, itineraryId: number) {
    try {
      const user = await this.userRepository.findOneOrFail({ id: authUserId });
      const itinerary = await this.itinerariesService.show(itineraryId);

      user.favoriteItineraries.add(itinerary);
      await this.userRepository.flush();

      return itinerary;
    } catch (error) {
      throw new HttpException("Can't favorite this.", 400);
    }
  }

  async remove(authUserId: number, itineraryId: number) {
    try {
      const user = await this.userRepository.findOneOrFail({ id: authUserId }, [
        'favoriteItineraries',
      ]);
      const itinerary = await this.itinerariesService.show(itineraryId);

      user.favoriteItineraries.remove(itinerary);
      await this.userRepository.flush();
    } catch (error) {
      throw new HttpException("Can't unfavorite this.", 400);
    }
  }
}
