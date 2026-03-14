import { AuthPresenter } from './AuthPresenter';
import { DrizzleAuthRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleAuthRepository';
import { JwtSecurityService } from '@/src/infrastructure/services/JwtSecurityService';
import { DrizzleUserProfileRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleUserProfileRepository';

/**
 * AuthPresenterServerFactory
 * Factory for creating AuthPresenter instances on the server side
 * Following Clean Architecture - Injects the appropriate server-side infrastructure
 */
export class AuthPresenterServerFactory {
  static create(): AuthPresenter {
    const securityService = new JwtSecurityService();
    const profileRepository = new DrizzleUserProfileRepository();
    const repository = new DrizzleAuthRepository(securityService, profileRepository);
    
    return new AuthPresenter(repository);
  }
}

export function createServerAuthPresenter(): AuthPresenter {
  return AuthPresenterServerFactory.create();
}
