'use client';

import { EditRegistrationPresenter } from './EditRegistrationPresenter';
import { ApiRegistrationRepository } from '@/src/infrastructure/repositories/api/ApiRegistrationRepository';

export class EditRegistrationPresenterClientFactory {
  static create(): EditRegistrationPresenter {
    const repository = new ApiRegistrationRepository();
    return new EditRegistrationPresenter(repository);
  }
}

export function createClientEditRegistrationPresenter(): EditRegistrationPresenter {
  return EditRegistrationPresenterClientFactory.create();
}
