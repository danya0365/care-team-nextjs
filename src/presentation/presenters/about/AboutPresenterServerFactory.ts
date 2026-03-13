import { AboutPresenter } from './AboutPresenter';
import { StaticOrganizationRepository } from '@/src/infrastructure/repositories/static/StaticOrganizationRepository';

export class AboutPresenterServerFactory {
  static create(): AboutPresenter {
    const organizationRepository = new StaticOrganizationRepository();
    return new AboutPresenter(organizationRepository);
  }
}

export function createServerAboutPresenter(): AboutPresenter {
  return AboutPresenterServerFactory.create();
}
