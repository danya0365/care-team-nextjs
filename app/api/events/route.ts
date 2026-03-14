import { NextRequest, NextResponse } from 'next/server';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

/**
 * API Route: /api/events
 * Handles fetching all events and creating new events
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      search: searchParams.get('search') || undefined,
      isActive: searchParams.get('isActive') === 'true' ? true : 
                searchParams.get('isActive') === 'false' ? false : undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    };

    const result = await drizzleEventRepository.getAll(options);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Events GET API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.title) {
      return NextResponse.json(
        { error: 'กรุณาระบุชื่อกิจกรรม' },
        { status: 400 }
      );
    }

    const newEvent = await drizzleEventRepository.create({
      id: body.id || `event-${Date.now()}`,
      title: body.title,
      description: body.description || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('Events POST API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
