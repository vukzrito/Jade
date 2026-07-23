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
  isActive: boolean;
}

export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string;
  userId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  client?: Pick<Client, 'id' | 'firstName' | 'lastName' | 'phone'>;
  user?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  service?: Pick<Service, 'id' | 'name' | 'duration' | 'price'>;
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


