/**
 * AboutPresenter
 * Handles business logic for the About page
 */

import { Metadata } from 'next';
import {
  IOrganizationRepository,
  TeamMember,
  OrganizationStats,
} from '@/src/application/repositories/IOrganizationRepository';
import { siteConfig } from '@/src/config/site';

export interface AboutViewModel {
  teamMembers: TeamMember[];
  stats: OrganizationStats;
  siteName: string;
  siteThaiName: string;
  description: string;
  vision: string;
  mission: string[];
  partners: string[];
}

export class AboutPresenter {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  async getViewModel(): Promise<AboutViewModel> {
    const [teamMembers, stats] = await Promise.all([
      this.organizationRepository.getTeamMembers(),
      this.organizationRepository.getStats(),
    ]);

    return {
      teamMembers,
      stats,
      siteName: siteConfig.name,
      siteThaiName: siteConfig.nameThai,
      description: siteConfig.description,
      vision: 'ให้บริการด้านสุขภาพและสังคมแก่กลุ่มผู้ใช้สารเสพติด โดยมุ่งเน้นการลดอันตรายจากการใช้ยา (Harm Reduction) และการป้องกันโรคติดต่อ',
      mission: [
        'เข้าถึงกลุ่มเป้าหมายเพื่อลดอันตรายจากการใช้ยา',
        'ให้บริการตรวจคัดกรองโรคติดต่อที่สำคัญ',
        'ส่งต่อผู้ป่วยเข้าสู่กระบวนการรักษาที่ได้มาตรฐาน',
        'ติดตามผลและสนับสนุนการใช้ชีวิตในสังคมอย่างมีคุณภาพ',
      ],
      partners: [...siteConfig.partners],
    };
  }

  generateMetadata(): Metadata {
    return {
      title: `เกี่ยวกับเรา | ${siteConfig.name}`,
      description: `ทำความรู้จักกับ ${siteConfig.name} วิสัยทัศน์ พันธกิจ และทีมงานของเรา`,
    };
  }
}
