
import { Court, CourtType, Reservation, ReservationStatus, SurfaceType, User, Product, Client } from "./types";

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
    isPaid: true,
    createdBy: "Juan Admin"
  },
  {
    id: "r2",
    courtId: "c2",
    clientName: "Torneo Local",
    startTime: setTime(10),
    endTime: setTime(12),
    price: 9000,
    status: ReservationStatus.CONFIRMED,
    isPaid: false,
    createdBy: "Laura Recepción"
  },
  {
    id: "r3",
    courtId: "c1",
    clientName: "Escuelita",
    startTime: setTime(16),
    endTime: setTime(17),
    price: 4000,
    status: ReservationStatus.PENDING,
    isPaid: false,
    createdBy: "Juan Admin"
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Carlos Admin', role: 'OWNER', email: 'admin@club.com', status: 'ACTIVE' },
  { id: 'u2', name: 'Laura Recepción', role: 'RECEPTIONIST', email: 'laura@club.com', status: 'ACTIVE' },
  { id: 'u3', name: 'Pedro Mantenimiento', role: 'ADMIN', email: 'pedro@club.com', status: 'INACTIVE' }
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'cl1', name: 'Juan Pérez', email: 'juan.perez@gmail.com', phone: '+54 9 11 2345 6789', totalBookings: 12, totalSpent: 60000, lastBooking: setTime(18) },
  { id: 'cl2', name: 'María Gomez', email: 'maria.g@hotmail.com', phone: '+54 9 11 9876 5432', totalBookings: 5, totalSpent: 25000, lastBooking: setTime(14) },
  { id: 'cl3', name: 'Club de Amigos', email: 'contacto@clubamigos.com', phone: '+54 9 11 1111 2222', totalBookings: 45, totalSpent: 225000, lastBooking: setTime(20) },
];

export const MOCK_INVENTORY: Product[] = [
  { 
    id: 'p1', code: 'BEB-001', name: 'Gatorade 500ml', type: 'Bebidas', stock: 45, 
    purchasePrice: 1000, salePrice: 1500, showInStock: true, active: true, 
    lastModified: new Date(Date.now() - 86400000).toISOString() 
  },
  { 
    id: 'p2', code: 'BEB-002', name: 'Agua Mineral', type: 'Bebidas', stock: 12, 
    purchasePrice: 400, salePrice: 800, showInStock: true, active: true, 
    lastModified: new Date(Date.now() - 172800000).toISOString() 
  },
  { 
    id: 'p3', code: 'EQ-001', name: 'Alquiler Paleta', type: 'Equipamiento', stock: 0, 
    purchasePrice: 15000, salePrice: 2000, showInStock: true, active: true, 
    lastModified: new Date(Date.now() - 259200000).toISOString() 
  },
  { 
    id: 'p4', code: 'VEN-001', name: 'Pelotas Tenis x3', type: 'Venta', stock: 30, 
    purchasePrice: 3500, salePrice: 5000, showInStock: true, active: true, 
    lastModified: new Date(Date.now() - 345600000).toISOString() 
  },
];

export const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 9); // 09:00 to 23:00