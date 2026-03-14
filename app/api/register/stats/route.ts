import { NextResponse } from 'next/server';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';

/**
 * API Route: /api/register/stats
 * Fetches global registration statistics
 */
export async function GET() {
  try {
    const stats = await drizzleRegistrationRepository.getStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Registration Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration statistics' },
      { status: 500 }
    );
  }
}
