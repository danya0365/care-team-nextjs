import { IEventRepository, Event } from '@/src/application/repositories/IEventRepository';

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

  async getAll(): Promise<Event[]> {
    // Implement if needed for the UI
    const response = await fetch(this.baseUrl);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.map((item: any) => this.mapToDomain(item));
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
    if (!response.ok) throw new Error('Failed to delete event');
  }
}

export const apiEventRepository = new ApiEventRepository();
