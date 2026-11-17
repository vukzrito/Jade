export interface RedeemedReward {
  id: string;
  clientId: string;
  appointmentId?: string;
  serviceId: string;
  serviceName: string;
  stampsUsed: number;
  createdAt: string;
  service?: Pick<Service, 'id' | 'name'>;
}

export interface ClientLoyalty {
  stamps: number;
  rewardThreshold: number;
  redeemedRewards: RedeemedReward[];
  canRedeem: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'ADMIN' | 'STAFF';
  phone?: string;
  avatarUrl?: string;
  tenantId: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  timezone: string;
  commissionRate: number;
  rewardThreshold: number;
  createdAt: string;
}

export interface Client {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  notes?: string;
  stamps: number;
  createdAt: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  sortOrder: number;
  services?: Service[];
}

export interface Service {
  id: string;
  tenantId: string;
  categoryId?: string;
  category?: Category;
  name: string;
  description?: string;
  duration: number;
  price: number;
  stampsEarned: number;
  isActive: boolean;
}

export interface AppointmentService {
  id: string;
  appointmentId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  duration: number;
  service?: Pick<Service, 'id' | 'name' | 'duration' | 'price'>;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
  status: 'PAID' | 'PARTIAL' | 'PENDING';
  createdAt: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  client?: Pick<Client, 'id' | 'firstName' | 'lastName' | 'phone'>;
  user?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  services: AppointmentService[];
  payments: Payment[];
}

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
