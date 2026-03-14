import { LoginView } from '@/src/presentation/components/auth/LoginView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Care Team Songkhla',
  description: 'Admin login for Care Team Songkhla management panel',
};

export default function LoginPage() {
  return <LoginView />;
}
