import { db } from '../../database/client';
import { registrations } from '../../database/schema';
import {
  IRegistrationRepository,
  Registration,
  RegistrationData,
} from '@/src/application/repositories/IRegistrationRepository';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

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

  async getAll(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  async getById(id: string): Promise<Registration | null> {
    const result = await db.select().from(registrations).where(eq(registrations.id, id));
    return result[0] || null;
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

  async delete(id: string): Promise<void> {
    await db.delete(registrations).where(eq(registrations.id, id));
  }
}

export const drizzleRegistrationRepository = new DrizzleRegistrationRepository();
