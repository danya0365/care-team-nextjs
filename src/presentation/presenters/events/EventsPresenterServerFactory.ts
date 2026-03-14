import { EventsPresenter } from './EventsPresenter';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

export class EventsPresenterServerFactory {
  static create(): EventsPresenter {
    return new EventsPresenter(drizzleEventRepository);
  }
}

export function createServerEventsPresenter(): EventsPresenter {
  return EventsPresenterServerFactory.create();
}
