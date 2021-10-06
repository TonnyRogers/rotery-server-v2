import { Request } from 'express';

export interface RequestUser extends Request {
  user: { userId: number };
}

export interface ParamId {
  id: number;
}
