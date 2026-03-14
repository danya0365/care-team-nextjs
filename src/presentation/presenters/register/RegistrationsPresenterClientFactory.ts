'use client';

import { RegistrationsPresenter } from './RegistrationsPresenter';
import { ApiRegistrationRepository } from '@/src/infrastructure/repositories/api/ApiRegistrationRepository';
import { ApiEventRepository } from '@/src/infrastructure/repositories/api/ApiEventRepository';

export class RegistrationsPresenterClientFactory {
  static create(): RegistrationsPresenter {
    const repository = new ApiRegistrationRepository();
    const eventRepository = new ApiEventRepository();
    return new RegistrationsPresenter(repository, eventRepository);
  }
}

export function createClientRegistrationsPresenter(): RegistrationsPresenter {
  return RegistrationsPresenterClientFactory.create();
}
