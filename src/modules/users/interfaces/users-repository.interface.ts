import { User } from '@/entities/user.entity';

export interface FindAndValidateUserRepositoryFilter {
  id?: number;
  email?: string;
}

export interface FindUserRepositoryFilter {
  id?: number;
  email?: string;
  deviceToken?: string;
}

export interface UsersRepositoryInterface {
  findOne(filters: FindUserRepositoryFilter, populate?: any[]): Promise<User>;
  activateGuide(userId: number): Promise<any>;
  findAndValidate(filters: FindAndValidateUserRepositoryFilter): Promise<User>;
  getDeviceToken(id: number): Promise<User>;
  setDeviceToken(id: number, deviceToken: string | null): Promise<void>;
  update(id: number, payload: Partial<User>): Promise<User>;
}
