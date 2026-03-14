/**
 * IRegistrationRepository
 * Repository interface for user registration
 * Following Clean Architecture - Application layer
 */

export interface RegistrationData {
  name: string;
  email: string | null;
  phone: string;
  targetGroup: string;
  address: string | null;
  note: string | null;
  eventId: string | null;
}

export interface Registration extends RegistrationData {
  id: string;
  eventId: string | null;
  eventTitle?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  eventId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IRegistrationRepository {
  create(data: RegistrationData): Promise<Registration>;
  getAll(options?: RegistrationQueryOptions): Promise<PaginatedResult<Registration>>;
  getStats(): Promise<{ total: number; pending: number; approved: number; rejected: number }>;
  getById(id: string): Promise<Registration | null>;
  updateStatus(id: string, status: string): Promise<Registration>;
  update(id: string, data: Partial<RegistrationData>): Promise<Registration>;
  delete(id: string): Promise<void>;
}
