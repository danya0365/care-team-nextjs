/**
 * IEventRepository
 * Repository interface for event/activity management
 * Following Clean Architecture - Application layer
 */

export interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventQueryOptions {
  search?: string;
  isActive?: boolean | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IEventRepository {
  getById(id: string): Promise<Event | null>;
  getAll(options?: EventQueryOptions): Promise<PaginatedResult<Event>>;
  create(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Event>;
  update(id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event>;
  delete(id: string): Promise<void>;
}
