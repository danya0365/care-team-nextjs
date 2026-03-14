import { RegistrationsPresenter } from './RegistrationsPresenter';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';

export class RegistrationsPresenterServerFactory {
  static create(): RegistrationsPresenter {
    return new RegistrationsPresenter(drizzleRegistrationRepository);
  }
}

export function createServerRegistrationsPresenter(): RegistrationsPresenter {
  return RegistrationsPresenterServerFactory.create();
}
