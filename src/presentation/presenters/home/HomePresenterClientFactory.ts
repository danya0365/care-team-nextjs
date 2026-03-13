'use client';

/**
 * HomePresenterClientFactory
 * Factory for creating HomePresenter instances on the client side
 * ✅ Injects static repositories for development
 */

import { HomePresenter } from './HomePresenter';
import { StaticServiceRepository } from '@/src/infrastructure/repositories/static/StaticServiceRepository';
import { StaticOrganizationRepository } from '@/src/infrastructure/repositories/static/StaticOrganizationRepository';
import { StaticNavigationRepository } from '@/src/infrastructure/repositories/static/StaticNavigationRepository';

export class HomePresenterClientFactory {
  static create(): HomePresenter {
    const serviceRepository = new StaticServiceRepository();
    const organizationRepository = new StaticOrganizationRepository();
    const navigationRepository = new StaticNavigationRepository();

    return new HomePresenter(serviceRepository, organizationRepository, navigationRepository);
  }
}

export function createClientHomePresenter(): HomePresenter {
  return HomePresenterClientFactory.create();
}
