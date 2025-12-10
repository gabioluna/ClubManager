

export enum CourtType {
  BASKET_3X3 = "Básquet 3vs3",
  BASKET_5X5 = "Básquet 5vs5",
  BEACH_TENNIS = "Beach Tenis",
  BEACH_VOLLEY = "Beach Volley",
  FRONTON = "Frontón",
  FUTBOL_4 = "Fútbol 4",
  FUTBOL_5 = "Fútbol 5",
  FUTBOL_6 = "Fútbol 6",
  FUTBOL_7 = "Fútbol 7",
  FUTBOL_8 = "Fútbol 8",
  FUTBOL_9 = "Fútbol 9",
  FUTBOL_10 = "Fútbol 10",
  FUTBOL_11 = "Fútbol 11",
  FUTGOLF = "Fútgolf",
  FUTVOLEY = "Futvóley",
  GOLF_VIRTUAL = "Golf Virtual",
  HANDBALL = "Handball",
  HOCKEY = "Hockey",
  NATACION = "Natación",
  PADBOL = "Padbol",
  PADEL = "Pádel",
  PADEL_SINGLE = "Padel Single",
  PICKLEBALL = "Pickleball",
  PING_PONG = "Ping Pong",
  SQUASH = "Squash",
  SURF = "Surf",
  TENIS = "Tenis",
  VOLEY = "Vóley"
}

export enum SurfaceType {
  PARQUET = "Parquet",
  FLOTANTE = "Flotante",
  SINTETICO = "Sintético",
  CEMENTO = "Cemento",
  CESPED_NATURAL = "Césped Natural",
  MURO = "Muro",
  SINTETICO_BLINDEX = "Sintético y Blindex",
  SINTETICO_MURO = "Sintético y Muro",
  CEMENTO_BLINDEX = "Cemento y Blindex",
  POLVO_LADRILLO = "Polvo de Ladrillo",
  COURT_FLEX = "Court-Flex",
  AGUA = "Agua",
  ARENA = "Arena"
}

export type ForceStartOption = 'NO_ROUNDING' | 'ON_HOUR' | 'HALF_HOUR';

export interface Court {
  id: string;
  name: string;
  types: string[]; // List of sports
  surface: string;
  forceStart: ForceStartOption;
  isIndoor: boolean;
  hasLighting: boolean;
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
  createdBy?: string;
  paymentMethod?: string;
  cancellationReason?: string;
  type?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'RECEPTIONIST' | 'OWNER';
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string; // ISO Date
}

export interface Product {
  id: string;
  code: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  type: string; // Category
  showInStock: boolean;
  active: boolean;
  lastModified: string;
  stock: number;
}

export interface FinancialMetric {
  date: string;
  revenue: number;
  category: string;
}