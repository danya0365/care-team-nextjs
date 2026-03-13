/**
 * IOrganizationRepository
 * Repository interface for organization structure data
 * Following Clean Architecture - Application layer
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleTh: string;
  teamName?: string;
}

export interface OrganizationStats {
  yearsOfService: number;
  areasServed: number;
  partnersCount: number;
  targetGroupsReached: number;
}

export interface IOrganizationRepository {
  getTeamMembers(): Promise<TeamMember[]>;
  getStats(): Promise<OrganizationStats>;
}
