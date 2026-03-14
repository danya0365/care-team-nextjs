'use client';

import { RegistrationsPresenter } from './RegistrationsPresenter';
import { ApiRegistrationRepository } from '@/src/infrastructure/repositories/api/ApiRegistrationRepository';

export class RegistrationsPresenterClientFactory {
  static create(): RegistrationsPresenter {
    const repository = new ApiRegistrationRepository();
    return new RegistrationsPresenter(repository);
  }
}

export function createClientRegistrationsPresenter(): RegistrationsPresenter {
  return RegistrationsPresenterClientFactory.create();
}
