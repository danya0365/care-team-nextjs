import { CreateRegistrationPresenter } from './CreateRegistrationPresenter';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

/**
 * Factory for creating CreateRegistrationPresenter on the server
 */
export function createServerCreateRegistrationPresenter(): CreateRegistrationPresenter {
  return new CreateRegistrationPresenter(
    drizzleRegistrationRepository,
    drizzleEventRepository
  );
}
