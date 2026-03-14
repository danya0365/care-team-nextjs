import { IEventRepository, Event, EventQueryOptions } from '@/src/application/repositories/IEventRepository';

/**
 * EventsViewModel
 * Represents the state of the Events Management UI
 */
export interface EventsViewModel {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

/**
 * EventsPresenter
 * Handles business logic for Events Management
 * Following Clean Architecture - Presentation layer
 */
export class EventsPresenter {
  constructor(private readonly eventRepository: IEventRepository) {}

  async getViewModel(options: EventQueryOptions = {}): Promise<EventsViewModel> {
    try {
      const result = await this.eventRepository.getAll(options);
      return {
        events: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        loading: false,
        error: null,
      };
    } catch (error) {
      console.error('EventsPresenter Error:', error);
      return {
        events: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        loading: false,
        error: 'Failed to load events',
      };
    }
  }

  async createEvent(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Event> {
    if (!data.title) throw new Error('title is required');
    return await this.eventRepository.create(data);
  }

  async updateEvent(id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event> {
    return await this.eventRepository.update(id, data);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
