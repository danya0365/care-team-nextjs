import { EditRegistrationView } from '@/src/presentation/components/register/EditRegistrationView';
import { createServerEditRegistrationPresenter } from '@/src/presentation/presenters/register/EditRegistrationPresenterServerFactory';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const presenter = createServerEditRegistrationPresenter();
  try {
    const viewModel = await presenter.getViewModel(id);
    return presenter.generateMetadata(viewModel.registration.name);
  } catch {
    return presenter.generateMetadata();
  }
}

/**
 * Edit Registration Page
 * Allows administrators to edit registration details
 */
export default async function EditRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = createServerEditRegistrationPresenter();
  
  try {
    const initialViewModel = await presenter.getViewModel(id);
    return <EditRegistrationView id={id} initialViewModel={initialViewModel} />;
  } catch (error) {
    console.error('Error loading registration for edit:', error);
    notFound();
  }
}
