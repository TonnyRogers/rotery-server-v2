import { Response } from 'express';

import { User } from '@/entities/user.entity';

export type LoginResponse = {
  access_token: string;
  user: Omit<User, 'password'>;
  expires: number;
};

export interface AuthServiceInterface {
  validateUser(email: string, pass: string): Promise<User>;
  login(user: Omit<User, 'password'>, res: Response): Promise<LoginResponse>;
  logout(deviceToken?: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<Omit<LoginResponse, 'user'>>;
}
