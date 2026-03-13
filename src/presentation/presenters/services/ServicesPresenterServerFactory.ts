import { ServicesPresenter } from './ServicesPresenter';
import { StaticServiceRepository } from '@/src/infrastructure/repositories/static/StaticServiceRepository';

export class ServicesPresenterServerFactory {
  static create(): ServicesPresenter {
    const serviceRepository = new StaticServiceRepository();
    return new ServicesPresenter(serviceRepository);
  }
}

export function createServerServicesPresenter(): ServicesPresenter {
  return ServicesPresenterServerFactory.create();
}
