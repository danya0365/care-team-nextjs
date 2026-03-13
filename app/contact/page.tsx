import { ContactView } from '@/src/presentation/components/contact/ContactView';
import { ContactPresenter } from '@/src/presentation/presenters/contact/ContactPresenter';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = new ContactPresenter();
  return presenter.generateMetadata();
}

export default async function ContactPage() {
  const presenter = new ContactPresenter();
  const viewModel = await presenter.getViewModel();

  return <ContactView initialViewModel={viewModel} />;
}
