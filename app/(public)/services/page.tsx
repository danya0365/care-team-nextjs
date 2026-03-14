import { ServicesView } from '@/src/presentation/components/home/ServicesView';
import { createServerServicesPresenter } from '@/src/presentation/presenters/services/ServicesPresenterServerFactory';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerServicesPresenter();
  return presenter.generateMetadata();
}

export default async function ServicesPage() {
  const presenter = createServerServicesPresenter();
  const viewModel = await presenter.getViewModel();

  return <ServicesView initialViewModel={viewModel} />;
}
