'use client';

import { EventsPresenter } from './EventsPresenter';
import { ApiEventRepository } from '@/src/infrastructure/repositories/api/ApiEventRepository';

export class EventsPresenterClientFactory {
  static create(): EventsPresenter {
    const repository = new ApiEventRepository();
    return new EventsPresenter(repository);
  }
}

export function createClientEventsPresenter(): EventsPresenter {
  return EventsPresenterClientFactory.create();
}
