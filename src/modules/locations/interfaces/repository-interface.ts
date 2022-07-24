import { Location } from "@/entities/location.entity";
import { GetLocationQueryFilter } from "./service-interface";

export interface FindOneLocationRepositoryFilter { id?: number, name?: string, location?: string, alias?: string };

export interface LocationsRepositoryInterface {
  findAll(filters: GetLocationQueryFilter): Promise<Location[] | null>;
  findOne(filters: FindOneLocationRepositoryFilter ): Promise<Location | null>;
  create(entity: Location): Promise<Location>;
  update(entity: Location): Promise<Location>;
  delete(id: number): Promise<void>;
}