import { NextRequest, NextResponse } from 'next/server';
import { drizzleEventRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleEventRepository';

/**
 * API Route: /api/events/[id]
 * Handles fetching event details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = await params;
    
    // Call the server-side Drizzle repository
    const event = await drizzleEventRepository.getById(id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลกิจกรรม' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Event GET API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;

    const updatedEvent = await drizzleEventRepository.update(id, updateData);
    
    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error('Event PATCH API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = await params;
    await drizzleEventRepository.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Event DELETE API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
