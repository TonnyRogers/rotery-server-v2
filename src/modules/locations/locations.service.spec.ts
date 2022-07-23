import { HttpStatus} from "@nestjs/common";

import { GetLocationQueryFilter, LocationsServiceInterface } from './interfaces/service-interface';
import { LocationsRepositoryInterface } from './interfaces/repository-interface';
import { LocationRepositoryFake, fakeLocations } from './fakes/locations-repository.fake';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationType } from '../../entities/location.entity';

describe('LocationsService', () => {
  let locationsService: LocationsServiceInterface;
  let locationsRepository: LocationsRepositoryInterface;

  beforeEach(() => {
    locationsRepository = new LocationRepositoryFake();
    locationsService = new LocationsService(locationsRepository);
  })

  it('should be able to get all locations by filter', async () => {
    const data = await locationsService.getAll({} as GetLocationQueryFilter);
    
    expect(data).toHaveLength(1);
  });

  it('should be able to create new location', async () => {
    const data = await locationsService.add({
      description: 'New created location',
      location: 'New location 123',
      name: 'New Location',
      type: LocationType.PLACE,
    } as CreateLocationDto);

    expect(data).toMatchObject(expect.objectContaining({
      description: expect.any(String),
    }))
  });

  it('should not be able to create new location with same name and location', async () => {
    try {
      const data = await locationsService.add({
        description: 'New Location ',
        location: fakeLocations[0].location,
        name: fakeLocations[0].name,
        type: LocationType.PLACE,
      } as CreateLocationDto);

      expect(data).toBeCalled();
    } catch (error) {      
      expect(error.status).toBe(HttpStatus.CONFLICT);
    }
  });


  it('should be able to update location', async () => {
    const data = await locationsService.update(fakeLocations[0].id,{
      description: 'Updated created location',
      location: 'Updated location 123',
      name: 'Updated Location',
      type: LocationType.PLACE,
    } as CreateLocationDto);

    expect(data).toMatchObject(expect.objectContaining({
      description: expect.any(String),
    }))
  });

  it('should not be able to update location with an existing one', async () => {
    const newData = await locationsService.add({
      description: 'New 2 created location',
      location: 'New 2 location 123',
      name: 'New 2 Location',
      type: LocationType.PLACE,
    } as CreateLocationDto);

    expect(newData).toBeTruthy();    

    try {
    const data = await locationsService.update(newData.id,{
      description: 'Updated created location',
      location: fakeLocations[0].location,
      name: fakeLocations[0].name,
      type: LocationType.PLACE,
    } as CreateLocationDto);    

    expect(data).toBeCalled();
    } catch (error) {      
      expect(error.status).toBe(HttpStatus.CONFLICT);
    }
  });

  it('should be able to remove location', async () => {
    const newData = await locationsService.add({
      description: 'New 3 created location',
      location: 'New 3 location 123',
      name: 'New 3 Location',
      type: LocationType.PLACE,
    } as CreateLocationDto);

    expect(newData).toBeTruthy();    

    await locationsService.remove(newData.id);

    const data = await locationsService.getAll({} as GetLocationQueryFilter);
    
    expect(data).toHaveLength(3);
  });

});