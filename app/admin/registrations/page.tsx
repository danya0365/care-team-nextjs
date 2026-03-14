import { RegistrationsManagementView } from '@/src/presentation/components/admin/registrations/RegistrationsManagementView';
import { createServerRegistrationsPresenter } from '@/src/presentation/presenters/register/RegistrationsPresenterServerFactory';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerRegistrationsPresenter();
  return presenter.generateMetadata();
}

/**
 * Registrations Management Page
 * View and manage submitted registrations
 */
export default async function RegistrationsPage() {
  const presenter = createServerRegistrationsPresenter();
  const initialViewModel = await presenter.getViewModel();

  return <RegistrationsManagementView initialViewModel={initialViewModel} />;
}
