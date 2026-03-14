import {
  IRegistrationRepository,
  Registration,
} from '@/src/application/repositories/IRegistrationRepository';
import { Metadata } from 'next';

export interface RegistrationsViewModel {
  registrations: Registration[];
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
  constructor(private repository: IRegistrationRepository) {}

  async getViewModel(): Promise<RegistrationsViewModel> {
    const list = await this.repository.getAll();
    
    // Sort by latest first
    const registrations = [...list].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const stats = registrations.reduce(
      (acc, reg) => {
        acc.total++;
        if (reg.status === 'pending') acc.pending++;
        else if (reg.status === 'approved') acc.approved++;
        else if (reg.status === 'rejected') acc.rejected++;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 }
    );

    return {
      registrations,
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
