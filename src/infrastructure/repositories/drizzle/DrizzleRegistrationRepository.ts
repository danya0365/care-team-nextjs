import { db } from '../../database/client';
import { registrations, events } from '../../database/schema';
import {
  IRegistrationRepository,
  PaginatedResult,
  Registration,
  RegistrationData,
  RegistrationQueryOptions,
} from '@/src/application/repositories/IRegistrationRepository';
import { v4 as uuidv4 } from 'uuid';
import { eq, and, like, or, sql, desc, asc } from 'drizzle-orm';

/**
 * DrizzleRegistrationRepository
 * Implementation of IRegistrationRepository using Drizzle ORM
 * Following Clean Architecture - Infrastructure layer
 */
export class DrizzleRegistrationRepository implements IRegistrationRepository {
  async create(data: RegistrationData): Promise<Registration> {
    const id = uuidv4();
    const newRegistration = {
      id,
      ...data,
      status: 'pending',
    };

    const result = await db.insert(registrations).values(newRegistration).returning();
    
    if (result.length === 0) {
      throw new Error('Failed to create registration');
    }

    return result[0];
  }

  async getAll(options: RegistrationQueryOptions = {}): Promise<PaginatedResult<Registration>> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      eventId, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = options;
    
    const offset = (page - 1) * limit;

    // 1. Build where clause
    const conditions = [];
    if (search) {
      conditions.push(or(
        like(registrations.name, `%${search}%`),
        like(registrations.nickname, `%${search}%`),
        like(registrations.email, `%${search}%`),
        like(registrations.phone, `%${search}%`)
      ));
    }
    if (status) {
      conditions.push(eq(registrations.status, status));
    }
    if (eventId) {
      conditions.push(eq(registrations.eventId, eventId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 2. Build order by
    let orderBy;
    const sortCol = sortBy === 'eventTitle' ? events.title : (registrations as any)[sortBy];
    if (sortCol) {
      orderBy = sortOrder === 'desc' ? desc(sortCol) : asc(sortCol);
    } else {
      orderBy = desc(registrations.createdAt);
    }

    // 3. Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(registrations)
      .where(whereClause);
    const total = Number(totalResult[0]?.count || 0);

    // 4. Get paginated items
    const itemsResult = await db
      .select({
        registration: registrations,
        eventTitle: events.title,
      })
      .from(registrations)
      .leftJoin(events, eq(registrations.eventId, events.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const items = itemsResult.map((row) => ({
      ...row.registration,
      eventTitle: row.eventTitle,
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats(): Promise<{ total: number; pending: number; approved: number; rejected: number }> {
    const result = await db
      .select({
        status: registrations.status,
        count: sql<number>`count(*)`
      })
      .from(registrations)
      .groupBy(registrations.status);

    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    result.forEach(row => {
      const count = Number(row.count);
      stats.total += count;
      if (row.status === 'pending') stats.pending = count;
      else if (row.status === 'approved') stats.approved = count;
      else if (row.status === 'rejected') stats.rejected = count;
    });

    return stats;
  }

  async getById(id: string): Promise<Registration | null> {
    const result = await db
      .select({
        registration: registrations,
        eventTitle: events.title,
      })
      .from(registrations)
      .leftJoin(events, eq(registrations.eventId, events.id))
      .where(eq(registrations.id, id));

    if (result.length === 0) return null;

    return {
      ...result[0].registration,
      eventTitle: result[0].eventTitle,
    };
  }

  async updateStatus(id: string, status: string): Promise<Registration> {
    const result = await db
      .update(registrations)
      .set({ status, updatedAt: new Date() })
      .where(eq(registrations.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Registration not found');
    }

    return result[0];
  }

  async update(id: string, data: Partial<RegistrationData>): Promise<Registration> {
    const result = await db
      .update(registrations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(registrations.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Registration not found');
    }

    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db.delete(registrations).where(eq(registrations.id, id));
  }
}

export const drizzleRegistrationRepository = new DrizzleRegistrationRepository();
