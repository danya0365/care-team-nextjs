import {
  IRegistrationRepository,
  Registration,
  RegistrationData,
} from '@/src/application/repositories/IRegistrationRepository';

/**
 * ApiRegistrationRepository
 * Client-side implementation of IRegistrationRepository using API calls
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For CLIENT-SIDE use only
 */
export class ApiRegistrationRepository implements IRegistrationRepository {
  private baseUrl = '/api/register';

  private mapToDomain(data: any): Registration {
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  async create(data: RegistrationData): Promise<Registration> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to submit registration');
    }

    const result = await res.json();
    return this.mapToDomain(result);
  }

  async getAll(): Promise<Registration[]> {
    const res = await fetch(this.baseUrl);
    const data = await res.json();
    return data.map((item: any) => this.mapToDomain(item));
  }

  async getById(id: string): Promise<Registration | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return this.mapToDomain(data);
  }

  async updateStatus(id: string, status: string): Promise<Registration> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update status');
    }

    const result = await res.json();
    return this.mapToDomain(result);
  }

  async update(id: string, data: Partial<RegistrationData>): Promise<Registration> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update registration');
    }

    const result = await res.json();
    return this.mapToDomain(result);
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete registration');
    }
  }
}

export const apiRegistrationRepository = new ApiRegistrationRepository();
