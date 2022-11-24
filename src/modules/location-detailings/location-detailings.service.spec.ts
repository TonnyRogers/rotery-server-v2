import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { LocationDetailingServiceInterface } from './interfaces/location-detailings-service.interface';
import { LocationDetailingService } from './location-detailings.service';

import { LocationDetailingType } from '@/entities/location-detailing.entity';

import { LocationsProvider } from '../locations/enums/locations-provider.enum';
import { fakeLocations } from '../locations/fakes/locations-repository.fake';
import { UpdateLocationDetailingsDto } from './dto/update-location-detailings.dto';
import { LocationDetailingsProvider } from './enums/location-detailings-provider.enum';
import { fakeLocationDetailings } from './fakes/location-detailings-repository.fake';

describe('LocationDetailingService', () => {
  let locationDetailingService: LocationDetailingServiceInterface;

  const mockLocationDetailingRepo = {
    create: jest.fn().mockImplementation((entity) => {
      return Promise.resolve(fakeLocationDetailings[0]);
    }),
    delete: jest.fn().mockImplementation(),
    update: jest
      .fn()
      .mockImplementation(
        (locationId: number, dto: UpdateLocationDetailingsDto) => {
          return Promise.resolve({
            ...fakeLocationDetailings[0],
            text: dto.text,
            type: dto.type,
            id: 8,
          });
        },
      ),
  };

  const mockLocationRepo = {
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve(fakeLocations[0]);
    }),
    count: jest.fn().mockImplementation(() => {
      return Promise.resolve(0);
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocationDetailingService,
        {
          provide: LocationDetailingsProvider.LOCATION_DETAILING_REPOSITORY,
          useValue: mockLocationDetailingRepo,
        },
        {
          provide: LocationsProvider.LOCATION_REPOSITORY,
          useValue: mockLocationRepo,
        },
      ],
    }).compile();

    locationDetailingService = moduleRef.get<LocationDetailingServiceInterface>(
      LocationDetailingService,
    );
  });

  it('should be able to create new location detailing', async () => {
    const data = await locationDetailingService.add(fakeLocations[0].id, {
      text: 'Caminhada',
      type: LocationDetailingType.DURATION,
    });

    expect(data).toMatchObject(
      expect.objectContaining({
        text: expect.any(String),
      }),
    );
  });

  it('should not be able to create new location detailing without location', async () => {
    // mock the expected result for that scenario
    mockLocationRepo.findOne.mockImplementationOnce(() => null);
    try {
      const data = await locationDetailingService.add(8, {
        text: 'Caminhada Falha',
        type: LocationDetailingType.ANIMAL_PRESENCE,
      });

      expect(data).toBeCalled();
    } catch (err) {
      expect(err.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });

  it('should not be able to create new location detailing with same type', async () => {
    mockLocationDetailingRepo.create.mockRejectedValueOnce(
      new UnprocessableEntityException('This detailing already exists.'),
    );

    try {
      const data = await locationDetailingService.add(fakeLocations[0].id, {
        text: 'Caminhada Duplicada',
        type: LocationDetailingType.ANIMAL_PRESENCE,
      });

      expect(data).toBeCalled();
    } catch (err) {
      expect(err.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });

  it('should be able to remove location detailing', async () => {
    const data = await locationDetailingService.remove(1, {
      type: LocationDetailingType.ANIMAL_PRESENCE,
    });

    expect(data).toBe(undefined);
  });

  it('should not be able to remove unknow location detailing', async () => {
    mockLocationDetailingRepo.delete.mockRejectedValueOnce(
      new UnprocessableEntityException("Can't find this location detailing."),
    );

    try {
      const data = await locationDetailingService.remove(1, {
        type: LocationDetailingType.ANIMAL_PRESENCE,
      });

      expect(data).toBeCalled();
    } catch (err) {
      expect(err.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });

  it('should not be able to remove unknow location detailing', async () => {
    mockLocationDetailingRepo.delete.mockRejectedValueOnce(
      new UnprocessableEntityException("Can't find this location detailing."),
    );

    try {
      const data = await locationDetailingService.remove(1, {
        type: LocationDetailingType.ANIMAL_PRESENCE,
      });

      expect(data).toBeCalled();
    } catch (err) {
      expect(err.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });

  it('should be able to update location detailing', async () => {
    const data = await locationDetailingService.update(1, {
      text: 'updated location detailing text',
      type: LocationDetailingType.CHILDREN_ACCESS,
    });

    expect(data).toMatchObject(
      expect.objectContaining({
        text: expect.any(String),
      }),
    );
  });

  it('should not be able to update location detailing with valid locationId', async () => {
    mockLocationRepo.findOne.mockImplementationOnce(() => null);

    try {
      const data = await locationDetailingService.update(51, {
        text: 'updated location detailing text',
        type: LocationDetailingType.CHILDREN_ACCESS,
      });

      expect(data).toBeCalled();
    } catch (err) {
      expect(err.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  });
});
