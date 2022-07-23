import { Location } from "@/entities/location.entity";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { LocationsProvider } from "./enums/locations-provider.enum";
import { LocationsRepositoryInterface } from "./interfaces/repository-interface";
import { GetLocationQueryFilter, LocationsServiceInterface } from "./interfaces/service-interface";

@Injectable()
export class LocationsService implements LocationsServiceInterface {
  constructor(
    @Inject(LocationsProvider.LOCATION_REPOSITORY)
    private readonly locationsRepository: LocationsRepositoryInterface,
  ) {}

  private async valideDuplicatedLocation({ name, location }: { name: string, location: string }): Promise<void> {
    const findLocation = await this.locationsRepository.findOne({
      name,
      location
    });    

    if(findLocation) throw new HttpException('This location already exists.', HttpStatus.CONFLICT);
  }

  private sanetizedAlias(text: string): string {
    return text.toLowerCase()
      .replace(/,/g,'')
      .replace(/ /g,'-');
  }

  async getAll(params: GetLocationQueryFilter): Promise<Location[]> {
    return this.locationsRepository.findAll(params);
  }

  async add(createLocationDto: CreateLocationDto): Promise<Location> {

    await this.valideDuplicatedLocation({
      location: createLocationDto.location,
      name: createLocationDto.name,
    });

    const newLocation = new Location({
      ...createLocationDto,
      alias: this.sanetizedAlias(`${createLocationDto.name} ${createLocationDto.location}`),    
    });

    return this.locationsRepository.create(newLocation);
  }

  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.locationsRepository.findOne({ id });

    if(location.name !== updateLocationDto.name || location.location !== updateLocationDto.location) {
      await this.valideDuplicatedLocation({
        location: updateLocationDto.location,
        name: updateLocationDto.name,
      });
    }
    
    return this.locationsRepository.update({
      ...location,
      ...updateLocationDto,
      alias: this.sanetizedAlias(`${updateLocationDto.name} ${updateLocationDto.location}`),
    });
  }

  async remove(id: number): Promise<void> {
    return this.locationsRepository.delete(id);
  }
}