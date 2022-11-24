import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  GetLocationQueryFilter,
  LocationsServiceInterface,
} from './interfaces/service-interface';
import { LocationsService } from './locations.service';

import { Location, LocationType } from '../../entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationsProvider } from './enums/locations-provider.enum';
import { fakeLocations } from './fakes/locations-repository.fake';

describe('LocationsService', () => {
  let locationsService: LocationsServiceInterface;

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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: LocationsProvider.LOCATION_REPOSITORY,
          useValue: mockLocationRepo,
        },
      ],
    }).compile();

    locationsService =
      moduleRef.get<LocationsServiceInterface>(LocationsService);
  });

  it('should be able to get all locations by filter', async () => {
    const data = await locationsService.getAll({} as GetLocationQueryFilter);

    expect(data).toHaveLength(1);
  });

  it('should be able to create new location', async () => {
    mockLocationRepo.findOne.mockResolvedValueOnce(null);

    const data = await locationsService.add({
      description: 'New created location',
      location: 'New location 123',
      name: 'New Location',
      type: LocationType.PLACE,
    } as CreateLocationDto);

    expect(data).toMatchObject(
      expect.objectContaining({
        description: expect.any(String),
      }),
    );
  });

  it('should not be able to create new location with same name and location', async () => {
    try {
      const data = await locationsService.add({
        description: 'New Location ',
        location: 'New location 123',
        name: 'New Location',
        type: LocationType.PLACE,
      } as CreateLocationDto);

      expect(data).toBeCalled();
    } catch (error) {
      expect(error.status).toBe(HttpStatus.CONFLICT);
    }
  });

  it('should be able to update location', async () => {
    // need to follow the order of requisitions to mock that right
    mockLocationRepo.findOne.mockResolvedValueOnce(fakeLocations[0]);
    mockLocationRepo.findOne.mockResolvedValueOnce(null);
    const data = await locationsService.update(fakeLocations[0].id, {
      description: 'Updated created location',
      location: 'Updated location 123',
      name: 'Updated Location',
      type: LocationType.PLACE,
    } as CreateLocationDto);

    expect(data).toMatchObject(
      expect.objectContaining({
        description: expect.any(String),
      }),
    );
  });

  it('should not be able to update location with an existing one', async () => {
    const updatedPayload = {
      description: 'Updated created location',
      location: 'Updated location',
      name: 'Updated location name',
      type: LocationType.PLACE,
    };

    mockLocationRepo.findOne.mockResolvedValueOnce(fakeLocations[0]);
    mockLocationRepo.findOne.mockResolvedValueOnce({
      ...fakeLocations[0],
      ...updatedPayload,
    });
    try {
      const data = await locationsService.update(
        1,
        updatedPayload as CreateLocationDto,
      );

      expect(data).toBeCalled();
    } catch (error) {
      expect(error.status).toBe(HttpStatus.CONFLICT);
    }
  });

  it('should be able to remove location', async () => {
    const remove = await locationsService.remove(1);
    expect(remove).toBe(undefined);
  });

  it('should not be able to remove unknow location', async () => {
    mockLocationRepo.delete.mockRejectedValue(
      new UnprocessableEntityException("Can't find this location."),
    );

    try {
      const data = await locationsService.remove(2);

      expect(data).toBeCalled();
    } catch (error) {
      expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });
});
