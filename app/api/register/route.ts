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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      eventId: searchParams.get('eventId') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    };

    const result = await drizzleRegistrationRepository.getAll(options);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Registration API GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

/**
 * API Route: /api/register/[id]
 * Since Next.js App Router uses folders for dynamic routes, 
 * I should actually create a separate file, but for simplicity 
 * if I want to keep it in one file I need to check how to handle it.
 * Actually, I'll create a new folder app/api/register/[id]/route.ts
 */
