import { ManageRegisterPresenter } from './ManageRegisterPresenter';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';

export class ManageRegisterPresenterServerFactory {
  static create(): ManageRegisterPresenter {
    return new ManageRegisterPresenter(drizzleRegistrationRepository);
  }
}

export function createServerManageRegisterPresenter(): ManageRegisterPresenter {
  return ManageRegisterPresenterServerFactory.create();
}
