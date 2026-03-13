/**
 * HomePresenterServerFactory
 * Factory for creating HomePresenter instances on the server side
 * ✅ Injects static repositories for development
 */

import { HomePresenter } from './HomePresenter';
import { StaticServiceRepository } from '@/src/infrastructure/repositories/static/StaticServiceRepository';
import { StaticOrganizationRepository } from '@/src/infrastructure/repositories/static/StaticOrganizationRepository';
import { StaticNavigationRepository } from '@/src/infrastructure/repositories/static/StaticNavigationRepository';

export class HomePresenterServerFactory {
  static create(): HomePresenter {
    const serviceRepository = new StaticServiceRepository();
    const organizationRepository = new StaticOrganizationRepository();
    const navigationRepository = new StaticNavigationRepository();

    return new HomePresenter(serviceRepository, organizationRepository, navigationRepository);
  }
}

export function createServerHomePresenter(): HomePresenter {
  return HomePresenterServerFactory.create();
}
