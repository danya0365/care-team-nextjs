'use client';

import { ManageRegisterPresenter } from './ManageRegisterPresenter';
import { ApiRegistrationRepository } from '@/src/infrastructure/repositories/api/ApiRegistrationRepository';

export class ManageRegisterPresenterClientFactory {
  static create(): ManageRegisterPresenter {
    const repository = new ApiRegistrationRepository();
    return new ManageRegisterPresenter(repository);
  }
}

export function createClientManageRegisterPresenter(): ManageRegisterPresenter {
  return ManageRegisterPresenterClientFactory.create();
}
