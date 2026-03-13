'use client';

import { ServicesPresenter } from './ServicesPresenter';
import { StaticServiceRepository } from '@/src/infrastructure/repositories/static/StaticServiceRepository';

export class ServicesPresenterClientFactory {
  static create(): ServicesPresenter {
    const serviceRepository = new StaticServiceRepository();
    return new ServicesPresenter(serviceRepository);
  }
}

export function createClientServicesPresenter(): ServicesPresenter {
  return ServicesPresenterClientFactory.create();
}
