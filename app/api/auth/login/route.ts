import { NextRequest, NextResponse } from 'next/server';
import { AuthPresenter } from '@/src/presentation/presenters/auth/AuthPresenter';
import { drizzleAuthRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleAuthRepository';

const presenter = new AuthPresenter(drizzleAuthRepository);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    const { token, user } = await presenter.login(email, password);

    const response = NextResponse.json({ 
      success: true, 
      user 
    });

    // Set secure HttpOnly cookie
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
