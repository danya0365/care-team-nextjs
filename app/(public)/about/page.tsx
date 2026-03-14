import { AboutView } from '@/src/presentation/components/about/AboutView';
import { createServerAboutPresenter } from '@/src/presentation/presenters/about/AboutPresenterServerFactory';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerAboutPresenter();
  return presenter.generateMetadata();
}

export default async function AboutPage() {
  const presenter = createServerAboutPresenter();
  const viewModel = await presenter.getViewModel();

  return <AboutView initialViewModel={viewModel} />;
}
