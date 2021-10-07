import { Request } from 'express';

export interface RequestUser extends Request {
  user: { userId: number };
}

export interface ParamId {
  id: number;
}

export type PageMeta = {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};
export interface PaginatedResponse<T> {
  items: T[];
  meta: PageMeta;
}
