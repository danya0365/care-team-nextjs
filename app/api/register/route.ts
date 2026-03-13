import { NextRequest, NextResponse } from 'next/server';
import { drizzleRegistrationRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleRegistrationRepository';

/**
 * API Route: /api/register
 * Handles registration requests from the client-side presenter
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Call the server-side Drizzle repository
    const result = await drizzleRegistrationRepository.create(data);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await drizzleRegistrationRepository.getAll();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
