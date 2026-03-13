import { RegisterView } from '@/src/presentation/components/register/RegisterView';
import { createServerRegisterPresenter } from '@/src/presentation/presenters/register/RegisterPresenterServerFactory';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerRegisterPresenter();
  return presenter.generateMetadata();
}

/**
 * Registration Page
 * Implementation using Clean Architecture
 */
export default function RegisterPage() {
  return <RegisterView />;
}
