'use client';

import { ApiRegistrationRepository } from '@/src/infrastructure/repositories/api/ApiRegistrationRepository';
import { RegisterPresenter } from './RegisterPresenter';

/**
 * RegisterPresenterClientFactory
 * Factory for creating RegisterPresenter instances on the client side
 * 
 * ✅ Uses ApiRegistrationRepository to avoid bundling DB client in browser
 */
export class RegisterPresenterClientFactory {
  static create(): RegisterPresenter {
    const repository = new ApiRegistrationRepository();
    return new RegisterPresenter(repository);
  }
}

export function createClientRegisterPresenter(): RegisterPresenter {
  return RegisterPresenterClientFactory.create();
}
