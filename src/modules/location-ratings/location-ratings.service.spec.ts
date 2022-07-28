import { Test } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ProfileService } from '../profiles/profile.service';
import { UsersService } from '../users/users.service';
import { LocationRatingsServiceInterface } from './interfaces/location-ratings-service.interface';
import { LocationRatingsService } from './location-ratings.service';

import { LocationRating } from '@/entities/location-rating';
import { Location } from '@/entities/location.entity';
import { User } from '@/entities/user.entity';

import { LocationsProvider } from '../locations/enums/locations-provider.enum';
import { fakeLocations } from '../locations/fakes/locations-repository.fake';
import { fakeUsers } from '../users/fakes/user.fake';
import { FindLocationRatingsDto } from './dto/find-location-ratings.dto';
import { LocationRatingsProvider } from './enums/location-ratings-provider.enum';
import { fakeLocationRatings } from './fakes/location-ratings.fake';

describe('LocationRatingsService', () => {
  let locationRatingsService: LocationRatingsServiceInterface;

  const mockLocationRatingsRepo = {
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve(fakeLocationRatings[0]);
    }),
    create: jest.fn().mockImplementation((entity: LocationRating) => {
      return Promise.resolve({ ...entity, id: 5 });
    }),
  };

  const mockLocationRepo = {
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve(fakeLocations);
    }),
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve(fakeLocations[0]);
    }),
    count: jest.fn().mockImplementation(() => {
      return Promise.resolve(0);
    }),
    create: jest.fn().mockImplementation((entity: Location) => {
      return Promise.resolve({ ...entity, id: 5 });
    }),
    update: jest.fn().mockImplementation((entity: Location) => {
      return Promise.resolve({ ...entity, id: 8 });
    }),
    delete: jest.fn().mockImplementation(),
  };

  const mockUserRepo = {
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve(fakeUsers);
    }),
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve(fakeUsers[0]);
    }),
    count: jest.fn().mockImplementation(() => {
      return Promise.resolve(0);
    }),
    create: jest.fn().mockImplementation((entity: Location) => {
      return Promise.resolve({ ...entity, id: 5 });
    }),
    update: jest.fn().mockImplementation((entity: Location) => {
      return Promise.resolve({ ...entity, id: 8 });
    }),
    delete: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocationRatingsService,
        {
          provide: LocationRatingsProvider.LOCATION_RATINGS_REPOSITORY,
          useValue: mockLocationRatingsRepo,
        },
        {
          provide: LocationsProvider.LOCATION_REPOSITORY,
          useValue: mockLocationRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        UsersService,
        ProfileService,
      ],
    }).compile();

    locationRatingsService = moduleRef.get<LocationRatingsServiceInterface>(
      LocationRatingsService,
    );
  });

  it('should be able to get location ratings by filter', async () => {
    const data = await locationRatingsService.getOne(
      {} as FindLocationRatingsDto,
    );

    expect(data).toHaveLength(1);
  });
});
