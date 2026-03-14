import { NextRequest, NextResponse } from 'next/server';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

/**
 * API Route: /api/events/[id]/registration-count
 * Returns the number of registrations for a specific event
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const count = await drizzleEventRepository.getRegistrationCount(id);
    
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Registration Count API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
