import { EditRegistrationPresenter } from './EditRegistrationPresenter';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';

export class EditRegistrationPresenterServerFactory {
  static create(): EditRegistrationPresenter {
    return new EditRegistrationPresenter(drizzleRegistrationRepository);
  }
}

export function createServerEditRegistrationPresenter(): EditRegistrationPresenter {
  return EditRegistrationPresenterServerFactory.create();
}
