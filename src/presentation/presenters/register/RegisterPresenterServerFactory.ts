import { RegisterPresenter } from './RegisterPresenter';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

export class RegisterPresenterServerFactory {
  static create(): RegisterPresenter {
    return new RegisterPresenter(drizzleRegistrationRepository, drizzleEventRepository);
  }
}

export function createServerRegisterPresenter(): RegisterPresenter {
  return RegisterPresenterServerFactory.create();
}
