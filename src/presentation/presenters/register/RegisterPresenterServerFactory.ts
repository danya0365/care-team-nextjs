import { RegisterPresenter } from './RegisterPresenter';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';

export class RegisterPresenterServerFactory {
  static create(): RegisterPresenter {
    return new RegisterPresenter(drizzleRegistrationRepository);
  }
}

export function createServerRegisterPresenter(): RegisterPresenter {
  return RegisterPresenterServerFactory.create();
}
