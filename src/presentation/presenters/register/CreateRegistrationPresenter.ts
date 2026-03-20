import {
  IRegistrationRepository,
  Registration,
  RegistrationData,
} from '@/src/application/repositories/IRegistrationRepository';
import { IEventRepository, Event } from '@/src/application/repositories/IEventRepository';
import { Metadata } from 'next';

export interface CreateRegistrationViewModel {
  events: Event[];
}

/**
 * CreateRegistrationPresenter
 * Handles logic for creating a new registration by administrator
 */
export class CreateRegistrationPresenter {
  constructor(
    private registrationRepository: IRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async getViewModel(): Promise<CreateRegistrationViewModel> {
    const eventsResult = await this.eventRepository.getAll({ isActive: true, limit: 100 });
    
    return {
      events: eventsResult.data,
    };
  }

  async createRegistration(data: RegistrationData): Promise<Registration> {
    // Basic validation
    if (!data.name || !data.phone) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
    }

    return await this.registrationRepository.create(data);
  }

  generateMetadata(): Metadata {
    return {
      title: 'เพิ่มการลงทะเบียนใหม่ | Care Team Songkhla',
      description: 'เพิ่มข้อมูลผู้ลงทะเบียนใหม่โดยผู้ดูแลระบบ',
    };
  }
}
