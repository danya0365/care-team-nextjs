/**
 * IRegistrationRepository
 * Repository interface for user registration
 * Following Clean Architecture - Application layer
 */

export interface RegistrationData {
  name: string;
  email: string | null;
  phone: string;
  targetGroup: string;
  address: string | null;
  note: string | null;
}

export interface Registration extends RegistrationData {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistrationRepository {
  create(data: RegistrationData): Promise<Registration>;
  getAll(): Promise<Registration[]>;
  getById(id: string): Promise<Registration | null>;
  updateStatus(id: string, status: string): Promise<Registration>;
  delete(id: string): Promise<void>;
}
