import { Location, LocationType } from "@/entities/location.entity";
import { FindOneLocationRepositoryFilter, LocationsRepositoryInterface } from "../interfaces/repository-interface";
import { GetLocationQueryFilter } from "../interfaces/service-interface";

export const fakeLocations = [
  {
    id: 1,
    alias: 'fake-location-name-fake-location',
    createdAt: new Date(),
    description: 'fake description',
    location: 'fake location',
    name: 'fake location name',
    type: LocationType.PLACE,
    updatedAt: new Date(),
    locationJson: undefined,
  }
];

export class LocationRepositoryFake implements LocationsRepositoryInterface {
  private readonly location: Location[] = fakeLocations;

  async findAll(filters: GetLocationQueryFilter): Promise<Location[]> {
    return this.location;
  }

  async create(entity: Location): Promise<Location> {

    if(entity instanceof Location) {
      const newLocation = {
        id: this.location.length + 1,
        ...entity
      };

      this.location.push(newLocation);
      return newLocation;
    }
    
    return null;
  }

  async findOne(filters: FindOneLocationRepositoryFilter): Promise<Location> {
    const { id, location, name } = filters;
    const findLocation = this.location.find((item) => (item.name === name && item.location === location) || item.id === id );
    if(findLocation) return findLocation;

    return null;
  }

  async update(entity: Location): Promise<Location> {
    const location = await this.findOne({ id: entity.id });
    const updatedLocation = {
      ...location,
      ...entity,
    };

    const locationIndex = this.location.findIndex((locationItem) => locationItem.id === entity.id );
    if(locationIndex !== -1) {
      this.location[locationIndex] = {...updatedLocation};
      return updatedLocation;
    }

    return null;
  }

  async delete(id: number): Promise<void> {
    const locationIndex = this.location.findIndex((locationItem) => locationItem.id === id );
    if(locationIndex !== -1) {
      this.location.splice(locationIndex,1);
    }
  }
}