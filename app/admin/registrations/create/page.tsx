import { CreateRegistrationView } from '@/src/presentation/components/admin/registrations/CreateRegistrationView';
import { createServerCreateRegistrationPresenter } from '@/src/presentation/presenters/register/CreateRegistrationPresenterServerFactory';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerCreateRegistrationPresenter();
  return presenter.generateMetadata();
}

/**
 * Admin Create Registration Page
 * Form for administrators to manually add a registration
 */
export default async function CreateRegistrationPage() {
  const presenter = createServerCreateRegistrationPresenter();
  const initialViewModel = await presenter.getViewModel();

  return <CreateRegistrationView initialViewModel={initialViewModel} />;
}
