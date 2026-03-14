'use client';

import { AuthPresenter } from './AuthPresenter';
import { ApiAuthRepository } from '@/src/infrastructure/repositories/api/ApiAuthRepository';

/**
 * AuthPresenterClientFactory
 * Factory for creating AuthPresenter instances on the client side
 * Following Clean Architecture - Injects the appropriate client-side infrastructure
 */
export class AuthPresenterClientFactory {
  static create(): AuthPresenter {
    const repository = new ApiAuthRepository();
    return new AuthPresenter(repository);
  }
}

export function createClientAuthPresenter(): AuthPresenter {
  return AuthPresenterClientFactory.create();
}
