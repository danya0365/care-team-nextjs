import { IEventRepository, Event, EventQueryOptions, PaginatedResult } from '@/src/application/repositories/IEventRepository';

/**
 * ApiEventRepository
 * Implementation of IEventRepository that calls the backend API
 * Following Clean Architecture - Infrastructure layer (Client-side)
 */
export class ApiEventRepository implements IEventRepository {
  private baseUrl = '/api/events';

  private mapToDomain(data: any): Event {
    return {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  async getById(id: string): Promise<Event | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch event');
      }
      const data = await response.json();
      return this.mapToDomain(data);
    } catch (error) {
      console.error('ApiEventRepository Error:', error);
      return null;
    }
  }

  async getAll(options: EventQueryOptions = {}): Promise<PaginatedResult<Event>> {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.isActive !== undefined && options.isActive !== null) {
      params.append('isActive', String(options.isActive));
    }
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options.page) params.append('page', String(options.page));
    if (options.limit) params.append('limit', String(options.limit));

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const result = await response.json();
    
    return {
      ...result,
      data: result.data.map((item: any) => this.mapToDomain(item))
    };
  }

  async create(data: Omit<Event, 'createdAt' | 'updatedAt'>): Promise<Event> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to create event');
    const result = await response.json();
    return this.mapToDomain(result);
  }

  async update(id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to update event');
    const result = await response.json();
    return this.mapToDomain(result);
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete event');
    }
  }

  async getRegistrationCount(eventId: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}/${eventId}/registration-count`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch registration count');
    }
    const data = await response.json();
    return data.count;
  }
}

export const apiEventRepository = new ApiEventRepository();
