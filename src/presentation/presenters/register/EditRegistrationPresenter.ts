import {
  IRegistrationRepository,
  Registration,
  RegistrationData,
} from '@/src/application/repositories/IRegistrationRepository';
import { Metadata } from 'next';

export interface EditRegistrationViewModel {
  registration: Registration;
}

/**
 * EditRegistrationPresenter
 * Handles logic for editing an existing registration
 */
export class EditRegistrationPresenter {
  constructor(private repository: IRegistrationRepository) {}

  async getViewModel(id: string): Promise<EditRegistrationViewModel> {
    const registration = await this.repository.getById(id);
    if (!registration) {
      throw new Error('ไม่พบข้อมูลการลงทะเบียน');
    }

    return {
      registration,
    };
  }

  async updateRegistration(id: string, data: Partial<RegistrationData>): Promise<Registration> {
    return await this.repository.update(id, data);
  }

  generateMetadata(name?: string): Metadata {
    return {
      title: `แก้ไขข้อมูล: ${name || 'การลงทะเบียน'} | Care Team Songkhla`,
      description: 'แก้ไขข้อมูลผู้ลงทะเบียน Care Team Songkhla',
    };
  }
}
