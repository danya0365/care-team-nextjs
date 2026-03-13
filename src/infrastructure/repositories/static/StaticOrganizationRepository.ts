/**
 * StaticOrganizationRepository
 * Static data implementation for organization structure
 * Following Clean Architecture - Infrastructure layer
 */

import {
  IOrganizationRepository,
  OrganizationStats,
  TeamMember,
} from '@/src/application/repositories/IOrganizationRepository';

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'director',
    name: 'คุณนูซาบะห์ สะมาเฮาะ',
    role: 'Director',
    roleTh: 'ผู้อำนวยการ',
  },
  {
    id: 'coordinator',
    name: 'คุณอัมพรรัตน์ ประไพวงศ์',
    role: 'Project Coordinator',
    roleTh: 'ผู้ประสานงานโครงการ',
  },
  {
    id: 'field-pwid',
    name: 'ทีม PWID',
    role: 'Field Team',
    roleTh: 'ทีมปฏิบัติการภาคสนาม',
    teamName: 'PWID',
  },
  {
    id: 'field-msm',
    name: 'ทีม MSM/Online',
    role: 'Field Team',
    roleTh: 'ทีมปฏิบัติการภาคสนาม',
    teamName: 'MSM/Online',
  },
  {
    id: 'field-sw',
    name: 'ทีม Sex Worker',
    role: 'Field Team',
    roleTh: 'ทีมปฏิบัติการภาคสนาม',
    teamName: 'Sex Worker',
  },
  {
    id: 'clinic',
    name: 'ทีมคลินิก',
    role: 'Clinical Team',
    roleTh: 'พยาบาลวิชาชีพ',
  },
  {
    id: 'case-manager',
    name: 'ผู้จัดการรายกรณี',
    role: 'Case Manager',
    roleTh: 'การจัดการข้อมูลและรายกรณี',
  },
  {
    id: 'support',
    name: 'ทีมสนับสนุน',
    role: 'Support Team',
    roleTh: 'บัญชี การเงิน และธุรการ',
  },
];

const ORG_STATS: OrganizationStats = {
  yearsOfService: 5,
  areasServed: 2,
  partnersCount: 4,
  targetGroupsReached: 4,
};

export class StaticOrganizationRepository implements IOrganizationRepository {
  async getTeamMembers(): Promise<TeamMember[]> {
    return [...TEAM_MEMBERS];
  }

  async getStats(): Promise<OrganizationStats> {
    return { ...ORG_STATS };
  }
}

export const staticOrganizationRepository = new StaticOrganizationRepository();
