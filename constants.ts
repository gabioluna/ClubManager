
import { Court, CourtType, Reservation, ReservationStatus, SurfaceType, User, Product } from "./types";

export const SPORTS_LIST = [
  "Básquet 3vs3", "Básquet 5vs5", "Beach Tenis", "Beach Volley", "Frontón", 
  "Fútbol 4", "Fútbol 5", "Fútbol 6", "Fútbol 7", "Fútbol 8", "Fútbol 9", 
  "Fútbol 10", "Fútbol 11", "Fútgolf", "Futvóley", "Golf Virtual", "Handball", 
  "Hockey", "Natación", "Padbol", "Pádel", "Padel Single", "Pickleball", 
  "Ping Pong", "Squash", "Surf", "Tenis", "Vóley"
];

export const SURFACE_LIST = [
  "Parquet", "Flotante", "Sintético", "Cemento", "Césped Natural", "Muro", 
  "Sintético y Blindex", "Sintético y Muro", "Cemento y Blindex", 
  "Polvo de Ladrillo", "Court-Flex", "Agua", "Arena"
];

export const MOCK_COURTS: Court[] = [
  {
    id: "c1",
    name: "Cancha Central",
    types: ["Fútbol 5"],
    surface: "Sintético",
    isIndoor: true,
    hasLighting: true,
    forceStart: 'ON_HOUR'
  },
  {
    id: "c2",
    name: "Pádel Panorámica",
    types: ["Pádel"],
    surface: "Sintético y Blindex",
    isIndoor: false,
    hasLighting: true,
    forceStart: 'HALF_HOUR'
  },
  {
    id: "c3",
    name: "Estadio F8",
    types: ["Fútbol 8"],
    surface: "Césped Natural",
    isIndoor: false,
    hasLighting: true,
    forceStart: 'NO_ROUNDING'
  }
];

const today = new Date();
const setTime = (h: number) => {
  const d = new Date(today);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
};

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: "r1",
    courtId: "c1",
    clientName: "Juan Pérez",
    startTime: setTime(18),
    endTime: setTime(19),
    price: 5000,
    status: ReservationStatus.CONFIRMED,
    isPaid: true
  },
  {
    id: "r2",
    courtId: "c2",
    clientName: "Torneo Local",
    startTime: setTime(10),
    endTime: setTime(12),
    price: 9000,
    status: ReservationStatus.CONFIRMED,
    isPaid: false
  },
  {
    id: "r3",
    courtId: "c1",
    clientName: "Escuelita",
    startTime: setTime(16),
    endTime: setTime(17),
    price: 4000,
    status: ReservationStatus.PENDING,
    isPaid: false
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Carlos Admin', role: 'OWNER', email: 'admin@club.com', status: 'ACTIVE' },
  { id: 'u2', name: 'Laura Recepción', role: 'RECEPTIONIST', email: 'laura@club.com', status: 'ACTIVE' },
  { id: 'u3', name: 'Pedro Mantenimiento', role: 'ADMIN', email: 'pedro@club.com', status: 'INACTIVE' }
];

export const MOCK_INVENTORY: Product[] = [
  { id: 'p1', name: 'Gatorade 500ml', category: 'Bebidas', stock: 45, price: 1500, status: 'IN_STOCK' },
  { id: 'p2', name: 'Agua Mineral', category: 'Bebidas', stock: 12, price: 800, status: 'LOW_STOCK' },
  { id: 'p3', name: 'Alquiler Paleta', category: 'Equipamiento', stock: 0, price: 2000, status: 'OUT_OF_STOCK' },
  { id: 'p4', name: 'Pelotas Tenis x3', category: 'Venta', stock: 30, price: 5000, status: 'IN_STOCK' },
];

export const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 9); // 09:00 to 23:00
