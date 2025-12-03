export enum CourtType {
  FUTBOL_5 = "Fútbol 5",
  FUTBOL_8 = "Fútbol 8",
  PADEL = "Pádel",
  TENNIS = "Tenis",
  BASKETBALL = "Básquet"
}

export enum SurfaceType {
  SYNTHETIC = "Sintético",
  CEMENT = "Cemento",
  GRASS = "Césped",
  PARQUET = "Parquet",
  CLAY = "Polvo de Ladrillo"
}

export interface Court {
  id: string;
  name: string;
  types: CourtType[];
  surface: SurfaceType;
  isIndoor: boolean;
  basePrice: number;
}

export enum ReservationStatus {
  CONFIRMED = "Confirmed",
  PENDING = "Pending",
  CANCELLED = "Cancelled",
  BLOCKED = "Blocked"
}

export interface Reservation {
  id: string;
  courtId: string;
  clientName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  price: number;
  status: ReservationStatus;
  isPaid: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'RECEPTIONIST' | 'OWNER';
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface FinancialMetric {
  date: string;
  revenue: number;
  category: string;
}