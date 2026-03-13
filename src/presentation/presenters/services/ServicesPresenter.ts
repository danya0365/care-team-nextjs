/**
 * ServicesPresenter
 * Handles business logic for the Services page
 */

import { Metadata } from 'next';
import {
  IServiceRepository,
  ServiceItem,
  ServiceStats,
} from '@/src/application/repositories/IServiceRepository';
import { siteConfig } from '@/src/config/site';

export interface ServicesViewModel {
  rrttprSteps: ServiceItem[];
  stats: ServiceStats;
  methadoneService: {
    title: string;
    description: string;
    steps: string[];
    icon: string;
  };
}

export class ServicesPresenter {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async getViewModel(): Promise<ServicesViewModel> {
    const [rrttprSteps, stats] = await Promise.all([
      this.serviceRepository.getRRTTPRSteps(),
      this.serviceRepository.getStats(),
    ]);

    return {
      rrttprSteps,
      stats,
      methadoneService: {
        title: 'บริการเมทาโดนระยะยาว (Methadone Maintenance Treatment)',
        description: 'การให้บริการยาเมทาโดนเพื่อทดแทนการใช้สารเสพติดกลุ่มฝิ่นและอนุพันธ์ของฝิ่นอย่างต่อเนื่องเพื่อคุณภาพชีวิตที่ดีขึ้น',
        steps: [
          'ให้คำปรึกษาและประเมินความพร้อมก่อนรับบริการ',
          'ตรวจร่างกายและคัดกรองโรคติดต่อ',
          'รับประทานยาเมทาโดนภายใต้การดูแลของพยาบาล',
          'ติดตามผลการรักษาและปรับขนาดยาตามความเหมาะสม',
          'สนับสนุนด้านสุขภาพจิตและสังคมสงเคราะห์',
        ],
        icon: '💊',
      },
    };
  }

  generateMetadata(): Metadata {
    return {
      title: `บริการของเรา | ${siteConfig.name}`,
      description: `รายละเอียดบริการ RRTTPR และบริการเมทาโดนของ ${siteConfig.name}`,
    };
  }
}
