import { redirect } from 'next/navigation';

/**
 * Legacy Registration Page
 * Redirect to home page as registrations are now activity-specific
 */
export default function RegisterPage() {
  redirect('/');
}
