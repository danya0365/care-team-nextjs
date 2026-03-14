import {
  IRegistrationRepository,
  Registration,
  RegistrationData,
} from '@/src/application/repositories/IRegistrationRepository';
import { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';

import {
  IEventRepository,
  Event
} from '@/src/application/repositories/IEventRepository';

/**
 * RegisterPresenter
 * Handles business logic for the Registration page
 * Following Clean Architecture - Presentation layer
 */
export class RegisterPresenter {
  constructor(
    private readonly registrationRepository: IRegistrationRepository,
    private readonly eventRepository: IEventRepository
  ) {}

  async getEventById(id: string): Promise<Event | null> {
    try {
      return await this.eventRepository.getById(id);
    } catch (error) {
      console.error('Error getting event details:', error);
      return null;
    }
  }

  async submitRegistration(data: RegistrationData): Promise<Registration> {
    // Basic validation
    if (!data.name || !data.phone || !data.targetGroup) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, เบอร์โทรศัพท์, กลุ่มเป้าหมาย)');
    }

    // Phone validation (basic)
    if (data.phone.length < 9) {
      throw new Error('เบอร์โทรศัพท์ไม่ถูกต้อง');
    }

    return await this.registrationRepository.create(data);
  }

  getTargetGroups(): string[] {
    return ['ผู้ใช้ยาฉีด (PWID)', 'กลุ่ม MSM', 'พนักงานบริการ (Sex Worker)', 'ประชากรกลุ่มเปราะบาง (อื่นๆ)'];
  }

  generateMetadata(): Metadata {
    return {
      title: `ลงทะเบียน | ${siteConfig.name}`,
      description: `แบบฟอร์มลงทะเบียนเข้าร่วมโครงการ ${siteConfig.name}`,
    };
  }
}
