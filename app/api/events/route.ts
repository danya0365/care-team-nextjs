import { NextRequest, NextResponse } from 'next/server';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

/**
 * API Route: /api/events
 * Handles fetching all events and creating new events
 */
export async function GET() {
  try {
    const events = await drizzleEventRepository.getAll();
    return NextResponse.json(events);
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
