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

    return res.json();
  }

  async getAll(): Promise<Registration[]> {
    const res = await fetch(this.baseUrl);
    return res.json();
  }

  async getById(id: string): Promise<Registration | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) return null;
    return res.json();
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

    return res.json();
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

    return res.json();
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
