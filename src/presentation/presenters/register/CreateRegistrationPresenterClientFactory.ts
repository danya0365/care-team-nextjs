import { CreateRegistrationPresenter } from './CreateRegistrationPresenter';
import { apiRegistrationRepository } from '@/src/infrastructure/repositories/api/ApiRegistrationRepository';
import { apiEventRepository } from '@/src/infrastructure/repositories/api/ApiEventRepository';

/**
 * Factory for creating CreateRegistrationPresenter on the client
 */
export function createClientCreateRegistrationPresenter(): CreateRegistrationPresenter {
  return new CreateRegistrationPresenter(
    apiRegistrationRepository,
    apiEventRepository
  );
}
