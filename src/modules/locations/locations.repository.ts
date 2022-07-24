import { Location } from "@/entities/location.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { FindOneLocationRepositoryFilter, LocationsRepositoryInterface } from "./interfaces/repository-interface";
import { GetLocationQueryFilter } from "./interfaces/service-interface";

export class LocationsRepository implements LocationsRepositoryInterface {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: EntityRepository<Location>,
  ) {}

  async findAll(filters: GetLocationQueryFilter): Promise<Location[] | never> {
    const { city, state } = filters;

    return this.locationsRepository.find({
      ...(city || state ? { locationJson: { city, state } } : {}),
    });
  }

  async findOne(filters: FindOneLocationRepositoryFilter): Promise<Location> {
    const { id, location, name, alias } = filters;
    return this.locationsRepository.findOne({
        ...( id ? {id} : {}),
        ...(alias ? { alias } : {}),
        ...( location && name ? { $and: [ {location, name} ]} : {})
    });
  }

  async create(entity: Location): Promise<Location> {
    const newLocation = this.locationsRepository.create(entity);
    await this.locationsRepository.persistAndFlush(newLocation);

    return newLocation;
  }

  async update(entity: Location): Promise<Location> {
    await this.locationsRepository.nativeUpdate({ id: entity.id }, entity);
    return this.findOne({ id: entity.id });
  }

  async delete(id: number): Promise<void> {
    const location = await this.locationsRepository.findOneOrFail({id});
    await this.locationsRepository.removeAndFlush(location);
  }
  
}