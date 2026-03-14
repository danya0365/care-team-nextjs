import { db } from '../../database/client';
import { events, registrations } from '../../database/schema';
import { eq, and, or, like, desc, asc, count, sql } from 'drizzle-orm';
import { IEventRepository, Event, EventQueryOptions, PaginatedResult } from '@/src/application/repositories/IEventRepository';

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

  async getAll(options: EventQueryOptions = {}): Promise<PaginatedResult<Event>> {
    const { 
      search, 
      isActive, 
      sortBy = 'createdAt', 
      sortOrder = 'desc', 
      page = 1, 
      limit = 10 
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(events.title, `%${search}%`),
          like(events.description, `%${search}%`)
        )
      );
    }

    // Status filter
    if (isActive !== undefined && isActive !== null) {
      conditions.push(eq(events.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(events)
      .where(whereClause);
    
    const total = totalResult[0].count;

    // Sorting
    let orderBy;
    const sortField = (events as any)[sortBy] || events.createdAt;
    orderBy = sortOrder === 'desc' ? desc(sortField) : asc(sortField);

    // Get paginated data
    const result = await db
      .select()
      .from(events)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const data = result.map(e => ({
      ...e,
      isActive: Boolean(e.isActive),
      startDate: e.startDate ? new Date(e.startDate) : null,
      endDate: e.endDate ? new Date(e.endDate) : null,
    })) as Event[];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
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

  async getRegistrationCount(eventId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(registrations)
      .where(eq(registrations.eventId, eventId));
    
    return result[0].count;
  }
}

export const drizzleEventRepository = new DrizzleEventRepository();
