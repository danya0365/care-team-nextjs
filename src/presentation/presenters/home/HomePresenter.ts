/**
 * HomePresenter
 * Handles business logic for the Homepage
 * Receives repositories via dependency injection
 */

import { Metadata } from 'next';
import {
  IServiceRepository,
  ServiceItem,
  ServiceStats,
} from '@/src/application/repositories/IServiceRepository';
import {
  IOrganizationRepository,
  OrganizationStats,
} from '@/src/application/repositories/IOrganizationRepository';
import {
  INavigationRepository,
  NavigationItem,
} from '@/src/application/repositories/INavigationRepository';

export interface HomeViewModel {
  services: ServiceItem[];
  serviceStats: ServiceStats;
  orgStats: OrganizationStats;
  footerLinks: NavigationItem[];
}

export class HomePresenter {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly navigationRepository: INavigationRepository
  ) {}

  async getViewModel(): Promise<HomeViewModel> {
    const [services, serviceStats, orgStats, footerLinks] = await Promise.all([
      this.serviceRepository.getRRTTPRSteps(),
      this.serviceRepository.getStats(),
      this.organizationRepository.getStats(),
      this.navigationRepository.getFooterMenu(),
    ]);

    return {
      services,
      serviceStats,
      orgStats,
      footerLinks,
    };
  }

  generateMetadata(): Metadata {
    return {
      title: 'Care Team Songkhla | กลุ่มคนทำงานดูแลผู้ใช้สารเสพติดจังหวัดสงขลา',
      description:
        'ให้บริการด้านสุขภาพและสังคมแก่กลุ่มผู้ใช้สารเสพติด โดยมุ่งเน้นการลดอันตรายจากการใช้ยา (Harm Reduction) และการป้องกันโรคติดต่อ',
    };
  }
}
