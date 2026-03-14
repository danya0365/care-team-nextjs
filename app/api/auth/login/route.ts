import { NextRequest, NextResponse } from 'next/server';
import { JwtSecurityService } from '@/src/infrastructure/services/JwtSecurityService';
import { createServerAuthPresenter } from '@/src/presentation/presenters/auth/AuthPresenterServerFactory';

const presenter = createServerAuthPresenter();
const security = new JwtSecurityService();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    const user = await presenter.login(email, password);
    if (!user) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const token = await security.signToken({
      userId: user.userId,
      email: user.email
    });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    await presenter.saveSession(user.userId, token, expiresAt);

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
      expires: expiresAt,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
