import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import {
  GetLocationQueryFilter,
  LocationsServiceInterface,
} from './interfaces/service-interface';

import { LocationActivity } from '@/entities/location-activity.entity';
import { LocationLodging } from '@/entities/location-lodging.entity';
import { LocationPhoto } from '@/entities/location-photo.entity';
import { LocationTransport } from '@/entities/location-transport.entity';
import { Location } from '@/entities/location.entity';

import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsProvider } from './enums/locations-provider.enum';
import {
  LocationBaseRelatedRepositoryInterface,
  LocationsRepositoryInterface,
} from './interfaces/repository-interface';

@Injectable()
export class LocationsService implements LocationsServiceInterface {
  constructor(
    @Inject(LocationsProvider.LOCATION_REPOSITORY)
    private readonly locationsRepository: LocationsRepositoryInterface,
    @Inject(LocationsProvider.LOCATION_ACTIVITY_REPOSITORY)
    private readonly locationsActivityRepository: LocationBaseRelatedRepositoryInterface<LocationActivity>,
    @Inject(LocationsProvider.LOCATION_LODGING_REPOSITORY)
    private readonly locationsLodgingRepository: LocationBaseRelatedRepositoryInterface<LocationLodging>,
    @Inject(LocationsProvider.LOCATION_PHOTO_REPOSITORY)
    private readonly locationsPhotoRepository: LocationBaseRelatedRepositoryInterface<LocationPhoto>,
    @Inject(LocationsProvider.LOCATION_TRANSPORT_REPOSITORY)
    private readonly locationsTransportRepository: LocationBaseRelatedRepositoryInterface<LocationTransport>,
  ) {}

  private async valideDuplicatedLocation({
    name,
    location,
  }: {
    name: string;
    location: string;
  }): Promise<void> {
    const findLocation = await this.locationsRepository.findOne({
      name,
      location,
    });

    if (findLocation)
      throw new HttpException(
        'This location already exists.',
        HttpStatus.CONFLICT,
      );
  }

  private sanetizedAlias(text: string): string {
    return text.toLowerCase().replace(/,/g, '').replace(/ /g, '-');
  }

  async getAll(params: GetLocationQueryFilter): Promise<Location[]> {
    return this.locationsRepository.findAll(params);
  }

  async add(createLocationDto: CreateLocationDto): Promise<Location> {
    const { activities, photos, lodgings, transports, ...restDto } =
      createLocationDto;

    await this.valideDuplicatedLocation({
      location: restDto.location,
      name: restDto.name,
    });

    const newLocation = new Location({
      ...restDto,
      alias: this.sanetizedAlias(`${restDto.name} ${restDto.location}`),
    });

    const location = await this.locationsRepository.create(newLocation);

    const activityEntityList: LocationActivity[] = [];
    const lodgingEntityList: LocationLodging[] = [];
    const photoEntityList: LocationPhoto[] = [];
    const transportEntityList: LocationTransport[] = [];

    activities?.length &&
      activities.forEach(async (activity) => {
        activityEntityList.push(
          new LocationActivity({
            ...activity,
            location,
          }),
        );
      });

    lodgings?.length &&
      lodgings.forEach(async (lodging) => {
        lodgingEntityList.push(
          new LocationLodging({
            ...lodging,
            location,
          }),
        );
      });

    photos?.length &&
      photos.forEach(async (photo) => {
        photoEntityList.push(
          new LocationPhoto({
            ...photo,
            location,
          }),
        );
      });

    transports?.length &&
      transports.forEach(async (transport) => {
        transportEntityList.push(
          new LocationTransport({
            ...transport,
            location,
          }),
        );
      });

    await Promise.all([
      this.locationsActivityRepository.insertJoinTable(
        activityEntityList,
        undefined,
      ),
      this.locationsLodgingRepository.insertJoinTable(
        lodgingEntityList,
        undefined,
      ),
      this.locationsPhotoRepository.insertJoinTable(photoEntityList, undefined),
      this.locationsTransportRepository.insertJoinTable(
        transportEntityList,
        undefined,
      ),
    ]);

    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.locationsRepository.findOne({ id });

    const { activities, lodgings, photos, transports, ...restDto } =
      updateLocationDto;

    if (
      location.name !== restDto.name ||
      location.location !== restDto.location
    ) {
      await this.valideDuplicatedLocation({
        location: restDto.location,
        name: restDto.name,
      });
    }

    const locationUpdated = this.locationsRepository.update({
      ...location,
      ...restDto,
      alias: this.sanetizedAlias(`${restDto.name} ${restDto.location}`),
    });

    const activityEntityList: LocationActivity[] = [];
    const lodgingEntityList: LocationLodging[] = [];
    const photoEntityList: LocationPhoto[] = [];
    const transportEntityList: LocationTransport[] = [];

    activities?.length &&
      activities.forEach(async (activity) => {
        activityEntityList.push(
          new LocationActivity({
            ...activity,
            location,
          }),
        );
      });

    lodgings?.length &&
      lodgings.forEach(async (lodging) => {
        lodgingEntityList.push(
          new LocationLodging({
            ...lodging,
            location,
          }),
        );
      });

    photos?.length &&
      photos.forEach(async (photo) => {
        photoEntityList.push(
          new LocationPhoto({
            ...photo,
            location,
          }),
        );
      });

    transports?.length &&
      transports.forEach(async (transport) => {
        transportEntityList.push(
          new LocationTransport({
            ...transport,
            location,
          }),
        );
      });

    await Promise.all([
      this.locationsActivityRepository.insertJoinTable(
        activityEntityList,
        undefined,
      ),
      this.locationsLodgingRepository.insertJoinTable(
        lodgingEntityList,
        undefined,
      ),
      this.locationsPhotoRepository.insertJoinTable(photoEntityList, undefined),
      this.locationsTransportRepository.insertJoinTable(
        transportEntityList,
        undefined,
      ),
    ]);

    return locationUpdated;
  }

  async remove(id: number): Promise<void> {
    return this.locationsRepository.delete(id);
  }
}
