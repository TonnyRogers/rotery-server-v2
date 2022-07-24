import { User } from "@/entities/user.entity";

export interface GuideUserLocationsServiceInterface {
  add(alias: string, id: number): Promise<User>;
  remove(alias: string, id: number): Promise<User>;
  findAll(alias: string): Promise<User[]>;
}