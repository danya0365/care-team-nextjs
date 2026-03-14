import { IEventRepository, Event } from '@/src/application/repositories/IEventRepository';

/**
 * EventsViewModel
 * Represents the state of the Events Management UI
 */
export interface EventsViewModel {
  events: Event[];
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

  async getViewModel(): Promise<EventsViewModel> {
    try {
      const events = await this.eventRepository.getAll();
      return {
        events: events.sort((a, b) => {
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
          return timeB - timeA;
        }),
        loading: false,
        error: null,
      };
    } catch (error) {
      console.error('EventsPresenter Error:', error);
      return {
        events: [],
        loading: false,
        error: 'Failed to load events',
      };
    }
  }

  async createEvent(data: Omit<Event, 'createdAt' | 'updatedAt'>): Promise<Event> {
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
