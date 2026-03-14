import { NextRequest, NextResponse } from 'next/server';
import { AuthPresenter } from '@/src/presentation/presenters/auth/AuthPresenter';
import { drizzleAuthRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleAuthRepository';

const presenter = new AuthPresenter(drizzleAuthRepository);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await presenter.getCurrentUser(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
