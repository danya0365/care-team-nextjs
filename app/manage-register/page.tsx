import { ManageRegisterView } from '@/src/presentation/components/register/ManageRegisterView';
import { createServerManageRegisterPresenter } from '@/src/presentation/presenters/register/ManageRegisterPresenterServerFactory';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerManageRegisterPresenter();
  return presenter.generateMetadata();
}

/**
 * Manage Registration Page
 * View and manage submitted registrations
 */
export default async function ManageRegisterPage() {
  const presenter = createServerManageRegisterPresenter();
  const initialViewModel = await presenter.getViewModel();

  return <ManageRegisterView initialViewModel={initialViewModel} />;
}
