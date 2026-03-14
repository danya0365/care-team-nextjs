import { RegistrationsPresenter } from './RegistrationsPresenter';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

export class RegistrationsPresenterServerFactory {
  static create(): RegistrationsPresenter {
    return new RegistrationsPresenter(drizzleRegistrationRepository, drizzleEventRepository);
  }
}

export function createServerRegistrationsPresenter(): RegistrationsPresenter {
  return RegistrationsPresenterServerFactory.create();
}
