'use client';

import { ApiRegistrationRepository } from '@/src/infrastructure/repositories/api/ApiRegistrationRepository';
import { ApiEventRepository } from '@/src/infrastructure/repositories/api/ApiEventRepository';
import { RegisterPresenter } from './RegisterPresenter';

/**
 * RegisterPresenterClientFactory
 * Factory for creating RegisterPresenter instances on the client side
 * 
 * ✅ Uses ApiRegistrationRepository to avoid bundling DB client in browser
 */
export class RegisterPresenterClientFactory {
  static create(): RegisterPresenter {
    const registrationRepo = new ApiRegistrationRepository();
    const eventRepo = new ApiEventRepository();
    return new RegisterPresenter(registrationRepo, eventRepo);
  }
}

export function createClientRegisterPresenter(): RegisterPresenter {
  return RegisterPresenterClientFactory.create();
}
