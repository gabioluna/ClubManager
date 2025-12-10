
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

export const RESERVATION_META: Record<string, { label: string, color: string, tailwind: string }> = {
  'Normal': { label: 'Normal', color: '#1B3530', tailwind: 'bg-[#1B3530] text-[#C7F269] hover:bg-[#112320]' },
  'Fijo': { label: 'Fijo / Abonado', color: '#EAB308', tailwind: 'bg-yellow-500 text-white hover:bg-yellow-600' },
  'Clase': { label: 'Clase / Escuela', color: '#2563EB', tailwind: 'bg-blue-600 text-white hover:bg-blue-700' },
  'Torneo': { label: 'Torneo', color: '#9333EA', tailwind: 'bg-purple-600 text-white hover:bg-purple-700' },
  'Cumpleaños': { label: 'Cumpleaños', color: '#F97316', tailwind: 'bg-orange-500 text-white hover:bg-orange-600' }
};

export const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 9); // 09:00 to 23:00
