/**
 * IServiceRepository
 * Repository interface for service/RRTTPR data access
 * Following Clean Architecture - Application layer
 */

export interface ServiceItem {
  id: string;
  step: number;
  code: string;
  titleEn: string;
  titleTh: string;
  description: string;
  icon: string;
  color: string;
}

export interface ServiceStats {
  totalServices: number;
  totalRRTTPRSteps: number;
  targetGroups: string[];
}

export interface IServiceRepository {
  getAll(): Promise<ServiceItem[]>;
  getRRTTPRSteps(): Promise<ServiceItem[]>;
  getStats(): Promise<ServiceStats>;
}
