/**
 * StaticServiceRepository
 * Static data implementation for RRTTPR service steps
 * Following Clean Architecture - Infrastructure layer
 */

import {
  IServiceRepository,
  ServiceItem,
  ServiceStats,
} from '@/src/application/repositories/IServiceRepository';

const RRTTPR_STEPS: ServiceItem[] = [
  {
    id: 'reach',
    step: 1,
    code: 'R',
    titleEn: 'Reach',
    titleTh: 'เข้าถึง',
    description:
      'เจ้าหน้าที่ภาคสนามลงพื้นที่เข้าถึงกลุ่มเป้าหมายผ่านศูนย์ Drop-In หรือการลงพื้นที่รายบุคคล',
    icon: '🤝',
    color: '#4FC3F7',
  },
  {
    id: 'recruit',
    step: 2,
    code: 'R',
    titleEn: 'Recruit',
    titleTh: 'รับเข้า',
    description:
      'การรับสมัครเข้าร่วมโครงการด้วยความสมัครใจ หรือการให้ความรู้เพื่อเตรียมความพร้อม',
    icon: '📋',
    color: '#81C784',
  },
  {
    id: 'test',
    step: 3,
    code: 'T',
    titleEn: 'Test',
    titleTh: 'ตรวจ',
    description:
      'คัดกรองเบื้องต้นโรคติดต่อ 5 ชนิด (HIV, TB, Syphilis, Hep B, Hep C) โดยเจ้าหน้าที่และพยาบาลวิชาชีพ',
    icon: '🔬',
    color: '#FFB74D',
  },
  {
    id: 'treat',
    step: 4,
    code: 'T',
    titleEn: 'Treat',
    titleTh: 'รักษา',
    description:
      'ส่งต่อผู้ที่ตรวจพบเชื้อเข้าสู่กระบวนการรักษาอย่างเหมาะสม',
    icon: '💊',
    color: '#E57373',
  },
  {
    id: 'prevent',
    step: 5,
    code: 'P',
    titleEn: 'Prevent',
    titleTh: 'ป้องกัน',
    description:
      'ให้เครื่องมือป้องกัน PrEP/PEP อุปกรณ์สะอาดและความรู้เพื่อลดอันตราย',
    icon: '🛡️',
    color: '#9575CD',
  },
  {
    id: 'retain',
    step: 6,
    code: 'R',
    titleEn: 'Retain',
    titleTh: 'ติดตาม',
    description:
      'การติดตามผลอย่างต่อเนื่องทุก 6 เดือนจนสิ้นสุดโครงการ',
    icon: '📊',
    color: '#4DB6AC',
  },
];

const TARGET_GROUPS = [
  'ผู้ใช้ยาฉีด (PWID)',
  'กลุ่ม MSM',
  'พนักงานบริการ (Sex Worker)',
  'ประชากรกลุ่มเปราะบาง',
];

export class StaticServiceRepository implements IServiceRepository {
  async getAll(): Promise<ServiceItem[]> {
    return [...RRTTPR_STEPS];
  }

  async getRRTTPRSteps(): Promise<ServiceItem[]> {
    return [...RRTTPR_STEPS];
  }

  async getStats(): Promise<ServiceStats> {
    return {
      totalServices: RRTTPR_STEPS.length + 1, // +1 for methadone service
      totalRRTTPRSteps: RRTTPR_STEPS.length,
      targetGroups: [...TARGET_GROUPS],
    };
  }
}

export const staticServiceRepository = new StaticServiceRepository();
