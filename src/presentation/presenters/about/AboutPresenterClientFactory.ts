'use client';

import { AboutPresenter } from './AboutPresenter';
import { StaticOrganizationRepository } from '@/src/infrastructure/repositories/static/StaticOrganizationRepository';

export class AboutPresenterClientFactory {
  static create(): AboutPresenter {
    const organizationRepository = new StaticOrganizationRepository();
    return new AboutPresenter(organizationRepository);
  }
}

export function createClientAboutPresenter(): AboutPresenter {
  return AboutPresenterClientFactory.create();
}
