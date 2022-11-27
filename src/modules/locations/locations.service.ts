import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { EntityData } from '@mikro-orm/core';

import {
  FormatedLocationDetailingResponseDto,
  GetLocationQueryFilter,
  LocationsServiceInterface,
} from './interfaces/service-interface';

import { LocationActivity } from '@/entities/location-activity.entity';
import {
  LocationDetailing,
  LocationDetailingType,
} from '@/entities/location-detailing.entity';
import { LocationLodging } from '@/entities/location-lodging.entity';
import { LocationPhoto } from '@/entities/location-photo.entity';
import { LocationTransport } from '@/entities/location-transport.entity';
import { Location } from '@/entities/location.entity';
import { formatDetailingValidation } from '@/utils/constants';
import { findRegionByState } from '@/utils/functions';
import { PaginatedResponse } from '@/utils/types';

import { CreateLocationDto } from './dto/create-location.dto';
import { GetLocationFeedQueryFilter } from './dto/get-feed-query-filter.dto';
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

  private formatDetailing(detailing: LocationDetailing) {
    const detailingIcon = {
      [LocationDetailingType.ANIMAL_PRESENCE]: 'pets',
      [LocationDetailingType.CHILDREN_ACCESS]: 'child-care',
      [LocationDetailingType.DURATION]: 'clock-outline',
      [LocationDetailingType.FOOD_PROXIMITY]: 'food',
      [LocationDetailingType.GUIDE_REQUESTED]: 'person-pin-circle',
      [LocationDetailingType.MOBILE_SIGNAL]: 'signal-variant',
      [LocationDetailingType.MOBILITY_ACCESS]: 'accessible',
      [LocationDetailingType.WEEKLY_PRESENCE]: 'trending-up',
    };

    // material: react-native-vector-icons/MaterialIcons
    // default: react-native-vector-icons/MaterialCommunityIcons
    const detailingIconType = {
      [LocationDetailingType.ANIMAL_PRESENCE]: 'material',
      [LocationDetailingType.CHILDREN_ACCESS]: 'material',
      [LocationDetailingType.DURATION]: 'default',
      [LocationDetailingType.FOOD_PROXIMITY]: 'default',
      [LocationDetailingType.GUIDE_REQUESTED]: 'material',
      [LocationDetailingType.MOBILE_SIGNAL]: 'default',
      [LocationDetailingType.MOBILITY_ACCESS]: 'material',
      [LocationDetailingType.WEEKLY_PRESENCE]: 'default',
    };

    return {
      ...detailing,
      icon: detailingIcon[detailing.type],
      iconType: detailingIconType[detailing.type],
      text: detailing.text
        .replace(
          '*V*',
          formatDetailingValidation[detailing.type][
            detailing.validation ? 0 : 1
          ],
        )
        .replace('*Q*', String(detailing.quantity))
        .replace('*M*', detailing.measure),
      location: detailing.location.id,
    };
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
      locationJson: restDto.locationJson
        ? {
            ...restDto.locationJson,
            region: findRegionByState(String(restDto.locationJson.state)),
          }
        : null,
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

    const locationUpdated = this.locationsRepository.update(
      {
        ...restDto,
        alias: this.sanetizedAlias(`${restDto.name} ${restDto.location}`),
        locationJson: restDto.locationJson
          ? {
              ...restDto.locationJson,
              region: findRegionByState(String(restDto.locationJson.state)),
            }
          : null,
      },
      id,
    );

    const activityEntityList: EntityData<LocationActivity>[] = [];
    const lodgingEntityList: EntityData<LocationLodging>[] = [];
    const photoEntityList: EntityData<LocationPhoto>[] = [];
    const transportEntityList: EntityData<LocationTransport>[] = [];

    activities?.length &&
      activities.forEach(async (activity) => {
        activityEntityList.push({
          ...activity,
          location: location.id,
        });
      });

    lodgings?.length &&
      lodgings.forEach(async (lodging) => {
        lodgingEntityList.push({
          ...lodging,
          location: location.id,
        });
      });

    photos?.length &&
      photos.forEach(async (photo) => {
        photoEntityList.push({
          ...photo,
          location: location.id,
        });
      });

    transports?.length &&
      transports.forEach(async (transport) => {
        transportEntityList.push({
          ...transport,
          location: location.id,
        });
      });

    await Promise.all([
      this.locationsActivityRepository.insertJoinTable(activityEntityList, {
        location: id,
      }),
      this.locationsLodgingRepository.insertJoinTable(lodgingEntityList, {
        location: id,
      }),
      this.locationsPhotoRepository.insertJoinTable(photoEntityList, {
        location: id,
      }),
      this.locationsTransportRepository.insertJoinTable(transportEntityList, {
        location: id,
      }),
    ]);

    return locationUpdated;
  }

  async remove(id: number): Promise<void> {
    return this.locationsRepository.delete(id);
  }

  async getFeed(
    params: GetLocationFeedQueryFilter,
  ): Promise<PaginatedResponse<FormatedLocationDetailingResponseDto>> {
    const locations = await this.locationsRepository.findAsFeed(params);

    const formattedLocationsDetailings: FormatedLocationDetailingResponseDto[] =
      locations.items.map((location) => {
        const formattedDetailings = location.detailings
          .getItems()
          .map((detailing) => this.formatDetailing(detailing));

        return {
          ...location,
          detailings: formattedDetailings,
          ratingAvg: location.ratingAvg,
        } as FormatedLocationDetailingResponseDto;
      });

    return {
      items: formattedLocationsDetailings,
      meta: locations.meta,
    };
  }
}
