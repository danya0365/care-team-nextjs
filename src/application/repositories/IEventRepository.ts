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

export interface IEventRepository {
  getById(id: string): Promise<Event | null>;
  getAll(): Promise<Event[]>;
  create(data: Omit<Event, 'createdAt' | 'updatedAt'>): Promise<Event>;
  update(id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event>;
  delete(id: string): Promise<void>;
}
