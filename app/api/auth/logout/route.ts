import { NextRequest, NextResponse } from 'next/server';
import { createServerAuthPresenter } from '@/src/presentation/presenters/auth/AuthPresenterServerFactory';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const presenter = createServerAuthPresenter();
  
  if (token) {
    await presenter.logout(token);
  }

  const response = NextResponse.json({ success: true });

  // Clear session cookie
  response.cookies.set('session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
