import {
  IRegistrationRepository,
  PaginatedResult,
  Registration,
  RegistrationQueryOptions,
} from '@/src/application/repositories/IRegistrationRepository';
import { IEventRepository, Event } from '@/src/application/repositories/IEventRepository';
import { Metadata } from 'next';

export interface RegistrationsViewModel {
  registrations: Registration[];
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

/**
 * ManageRegisterPresenter
 * Handles business logic for the Registration Management page
 * Following Clean Architecture - Presentation layer
 */
export class RegistrationsPresenter {
  constructor(
    private repository: IRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async getViewModel(options: RegistrationQueryOptions = {}): Promise<RegistrationsViewModel> {
    const [paginatedResult, stats, eventsResult] = await Promise.all([
      this.repository.getAll(options),
      this.repository.getStats(),
      this.eventRepository.getAll()
    ]);
    
    return {
      registrations: paginatedResult.items,
      events: eventsResult.data,
      total: paginatedResult.total,
      page: paginatedResult.page,
      limit: paginatedResult.limit,
      totalPages: paginatedResult.totalPages,
      stats,
    };
  }

  async updateStatus(id: string, status: string): Promise<Registration> {
    return await this.repository.updateStatus(id, status);
  }

  async deleteRegistration(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  generateMetadata(): Metadata {
    return {
      title: 'จัดการการลงทะเบียน | Care Team Songkhla',
      description: 'ระบบจัดการข้อมูลผู้ลงทะเบียน Care Team Songkhla',
    };
  }
}
