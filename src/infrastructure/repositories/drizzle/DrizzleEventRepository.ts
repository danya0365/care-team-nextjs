import { db } from '../../database/client';
import { events } from '../../database/schema';
import { IEventRepository, Event } from '@/src/application/repositories/IEventRepository';
import { eq } from 'drizzle-orm';

/**
 * DrizzleEventRepository
 * Implementation of IEventRepository using Drizzle ORM
 * Following Clean Architecture - Infrastructure layer
 */
export class DrizzleEventRepository implements IEventRepository {
  async getById(id: string): Promise<Event | null> {
    const result = await db.select().from(events).where(eq(events.id, id));
    if (result.length === 0) return null;
    
    // Map database model to domain model
    const dbEvent = result[0];
    return {
      ...dbEvent,
      isActive: Boolean(dbEvent.isActive),
      startDate: dbEvent.startDate ? new Date(dbEvent.startDate) : null,
      endDate: dbEvent.endDate ? new Date(dbEvent.endDate) : null,
    } as Event;
  }

  async getAll(): Promise<Event[]> {
    const result = await db.select().from(events);
    return result.map(e => ({
      ...e,
      isActive: Boolean(e.isActive),
      startDate: e.startDate ? new Date(e.startDate) : null,
      endDate: e.endDate ? new Date(e.endDate) : null,
    })) as Event[];
  }

  async create(data: Omit<Event, 'createdAt' | 'updatedAt'>): Promise<Event> {
    const result = await db.insert(events).values({
      ...data,
      isActive: data.isActive,
    }).returning();
    
    return {
      ...result[0],
      isActive: Boolean(result[0].isActive),
    } as Event;
  }

  async update(id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event> {
    const updateData: any = { ...data };
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }
    
    const result = await db
      .update(events)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Event not found');
    }

    return {
      ...result[0],
      isActive: Boolean(result[0].isActive),
    } as Event;
  }

  async delete(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }
}

export const drizzleEventRepository = new DrizzleEventRepository();
