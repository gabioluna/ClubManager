import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Button, Card, Input, Badge, SideSheet, Select, MultiSelect, RadioGroup, Checkbox, Modal, AutocompleteInput, Textarea, Snackbar } from './components/UI';
import { SPORTS_LIST, SURFACE_LIST, RESERVATION_META } from './constants';
import { Court, Reservation, ReservationStatus, User, Product, ForceStartOption, Client } from './types';
import { Search, Plus, Filter, DollarSign, MapPin, Edit2, Trash2, Check, Calendar, List, Ban, ChevronRight, Image as ImageIcon, Link2, Clock, Map as MapIcon, Phone, TrendingUp, Users as UsersIcon, Clock as ClockIcon, Activity, User as UserIcon, Mail, Key, FileSpreadsheet, ChevronLeft, Eye, Upload, ChevronDown, Star, MessageSquare, Flag, FileText, FileType, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown, PackageOpen, Trophy, Shield, Palette, Star as StarIcon, Info, Plug, Power, Camera, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { supabase } from './lib/supabase';

// --- Auth Components ---

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            // Fetch additional profile info if exists
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            onLogin({
                id: data.user.id,
                email: data.user.email,
                name: profile?.name || data.user.email?.split('@')[0],
                role: profile?.role || 'OWNER', // Default to OWNER if no profile found
                full_name: profile?.name
            });
        }
    } catch (err: any) {
        console.error("Login error:", err);
        setError(err.message || 'Credenciales incorrectas o error de conexión.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-none">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#1B3530] rounded-xl flex items-center justify-center text-[#C7F269] font-bold text-xl mb-4">
            G
          </div>
          <h1 className="text-2xl font-bold text-[#112320]">Iniciar Sesión</h1>
          <p className="text-gray-500">Acceso exclusivo para personal autorizado</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email" 
            type="email" 
            placeholder="usuario@club.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
            icon={Mail}
          />
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required 
            icon={Key}
          />
          
          <Button type="submit" className="w-full py-3.5" isLoading={loading}>
            Ingresar
          </Button>
        </form>
      </Card>
    </div>
  );
};

// --- Page Components ---

const ReservasPage = ({ 
  courts, 
  reservations, 
  onAddReservation,
  onSelectReservation,
  selectedDate,
  onDateChange,
  schedule
}: { 
  courts: Court[], 
  reservations: Reservation[], 
  onAddReservation: (date?: string, time?: string, courtId?: string, clientName?: string) => void,
  onSelectReservation: (res: Reservation) => void,
  selectedDate: string,
  onDateChange: (date: string) => void,
  schedule: any[]
}) => {
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
  const [currentTime, setCurrentTime] = useState(new Date());
  const itemsPerPage = 10;
  const [listPage, setListPage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const newDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const newDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    onDateChange(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    const newDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    onDateChange(newDate);
  };

  const formattedDateDisplay = (() => {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('es-ES', { month: 'short' });
      return `${weekday} ${dayNum} de ${month}`;
  })();

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h < 24; h++) {
        slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getReservation = (courtId: string, timeString: string) => {
    return reservations.find(r => {
      if (r.status === ReservationStatus.CANCELLED) return false;
      const [resDate, resFullTime] = r.startTime.split('T');
      const resTime = resFullTime.substring(0, 5);
      return r.courtId === courtId && resDate === selectedDate && resTime === timeString;
    });
  };

  const handleSlotClick = (courtId: string, timeString: string) => {
    onAddReservation(selectedDate, timeString, courtId);
  };
  
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

  const isClosed = (timeString: string) => {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      
      const daySchedule = schedule.find(s => s.day === dayNameCapitalized);
      
      // Basic check for schedule existence
      if (!daySchedule || !daySchedule.open) return true;
      
      const time = parseInt(timeString.split(':')[0]);
      const start = parseInt(daySchedule.start.split(':')[0]);
      const end = parseInt(daySchedule.end.split(':')[0]);
      
      return time < start || time >= end;
  };

  const getReservationColor = (type: string | undefined, status: string) => {
     if (status === ReservationStatus.BLOCKED) return 'bg-gray-100 border border-gray-200 text-gray-500';
     if (status === ReservationStatus.PENDING) return 'bg-yellow-50 border border-yellow-200 text-yellow-900';
     if (status === ReservationStatus.CANCELLED) return 'bg-red-50 border border-red-200 text-red-900';
     
     const meta = RESERVATION_META[type || 'Normal'];
     return meta ? meta.tailwind : RESERVATION_META['Normal'].tailwind;
  };

  // List view state
  const filteredReservationsList = viewMode === 'CALENDAR' 
      ? reservations.filter(r => r.startTime.startsWith(selectedDate) && r.status !== ReservationStatus.CANCELLED)
      : [...reservations].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  
  const totalPages = Math.ceil(filteredReservationsList.length / itemsPerPage);
  const paginatedReservations = filteredReservationsList.slice((listPage - 1) * itemsPerPage, listPage * itemsPerPage);

  if (courts.length === 0 && viewMode === 'CALENDAR') {
      return (
        <div className="p-8 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-[#112320] mb-2">Reservas</h1>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#112320] mb-2">No hay canchas configuradas</h3>
                <p className="text-gray-500 mb-6">Para comenzar a tomar reservas, primero debes agregar canchas en la sección "Canchas".</p>
                <Button onClick={() => window.location.hash = '#/courts'}>Ir a Canchas</Button>
            </div>
        </div>
      );
  }

  return (
    <div className="p-8 space-y-6 flex flex-col h-full overflow-hidden">
      <header className="flex flex-col gap-6 flex-shrink-0">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#112320]">Reservas</h1>
            </div>
            <div className="flex gap-3">
                 <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
                    <button 
                        onClick={() => setViewMode('CALENDAR')} 
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'CALENDAR' ? 'bg-white text-[#1B3530] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <Calendar size={16} /> Calendario
                    </button>
                    <button 
                        onClick={() => setViewMode('LIST')} 
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'LIST' ? 'bg-white text-[#1B3530] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <List size={16} /> Historial
                    </button>
                </div>
                {courts.length > 0 && (
                    <Button onClick={() => onAddReservation(selectedDate)}>
                        <Plus className="w-4 h-4 mr-2" /> Nueva Reserva
                    </Button>
                )}
            </div>
        </div>

        {viewMode === 'CALENDAR' && (
            <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-gray-200 w-fit shadow-sm">
                <Button variant="ghost" onClick={handleToday} className="h-9 px-4 text-sm font-semibold hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-full">
                    Hoy
                </Button>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                    <button onClick={handlePrevDay} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-semibold text-[#112320] min-w-[240px] text-center capitalize select-none">
                        {formattedDateDisplay}
                    </span>
                    <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        )}
      </header>

      {viewMode === 'CALENDAR' ? (
        <Card className="p-0 border border-gray-200 bg-white flex-1 overflow-auto custom-scrollbar relative">
            <div className="sticky top-0 z-40 flex border-b border-gray-200 bg-[#F8F8F8] min-w-max">
            <div className="sticky left-0 z-50 w-24 p-4 border-r border-gray-200 font-bold text-sm text-[#112320] uppercase tracking-wider flex items-center justify-center bg-[#F8F8F8]">
                Hora
            </div>
            <div 
                className="flex-1 grid divide-x divide-gray-200 min-w-[600px]"
                style={{ gridTemplateColumns: `repeat(${courts.length}, minmax(200px, 1fr))` }}
            >
                {courts.map(court => (
                    <div key={court.id} className="text-center py-4 px-2 flex flex-col justify-center items-center bg-[#F8F8F8]">
                    <span className="text-base font-bold text-[#112320] truncate w-full">{court.name}</span>
                    <span className="text-sm text-gray-500 font-medium mt-0.5">
                        {court.isIndoor ? 'Techada' : 'Aire Libre'}
                    </span>
                    </div>
                ))}
            </div>
            </div>

            <div className="min-w-max">
            {timeSlots.map(time => {
                const slotHour = parseInt(time.split(':')[0]);
                const showTimeIndicator = isToday && slotHour === currentHour;
                const topPercentage = (currentMinute / 60) * 100;
                const closed = isClosed(time);
                
                return (
                <div key={time} className="flex border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors min-h-[80px] relative">
                    <div className="sticky left-0 z-30 w-24 border-r border-gray-200 flex items-center justify-center bg-white text-sm font-bold text-gray-900 flex-shrink-0">
                    {time}
                    </div>
                    <div 
                    className={`flex-1 grid divide-x divide-gray-200 min-w-[600px] relative`}
                    style={{ gridTemplateColumns: `repeat(${courts.length}, minmax(200px, 1fr))` }}
                    >
                    {showTimeIndicator && (
                        <div 
                            className="absolute left-0 right-0 border-t-2 border-dashed border-red-500 z-20 pointer-events-none flex items-center"
                            style={{ top: `${topPercentage}%` }}
                        >
                            <div className="absolute left-2 -top-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-30">
                                {currentTimeString}
                            </div>
                            <div className="absolute -left-1 w-2.5 h-2.5 bg-red-500 rounded-full -translate-y-1/2"></div>
                        </div>
                    )}

                    {courts.map(court => {
                            const res = getReservation(court.id, time);
                            
                            if (closed && !res) {
                                return (
                                    <div key={`${court.id}-${time}`} className="relative h-full bg-[image:repeating-linear-gradient(45deg,#f3f4f6_0px,#f3f4f6_10px,#e5e7eb_10px,#e5e7eb_20px)] opacity-60"></div>
                                );
                            }

                            return (
                            <div key={`${court.id}-${time}`} className="relative p-1 h-full z-10">
                                {res ? (
                                <div 
                                    onClick={() => onSelectReservation(res)}
                                    className={`w-full h-full rounded-xl p-3 text-xs flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ${getReservationColor(res.type, res.status)}`}
                                >
                                    <div className="truncate font-bold text-sm">
                                    {res.status === ReservationStatus.BLOCKED ? (
                                        <span className="flex items-center gap-1"><Ban size={12}/> Bloqueado</span>
                                    ) : res.clientName}
                                    </div>
                                    <div className="flex justify-between items-end mt-1">
                                    <span className="opacity-90 font-semibold">
                                        {res.status === ReservationStatus.BLOCKED ? res.clientName : `$${res.price}`}
                                    </span>
                                    {res.isPaid && <Check size={14} className="opacity-70" />}
                                    </div>
                                </div>
                                ) : (
                                <div 
                                    onClick={() => handleSlotClick(court.id, time)}
                                    className="w-full h-full rounded-xl hover:bg-gray-100 cursor-pointer transition-all flex items-center justify-center group/cell"
                                >
                                    <Plus className="text-gray-400 w-5 h-5 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                </div>
                                )}
                            </div>
                            );
                        })}
                    </div>
                </div>
                );
            })}
            </div>
        </Card>
      ) : (
          <Card className="p-0 overflow-hidden flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                   <h2 className="font-bold text-[#112320]">Historial de Reservas</h2>
              </div>
              <div className="overflow-auto custom-scrollbar flex-1">
                <table className="w-full text-left">
                    <thead className="bg-[#F8F8F8] border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Fecha y Hora</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Cancha</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Creado Por</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedReservations.length > 0 ? (
                             paginatedReservations.map(res => {
                                 const courtName = courts.find(c => c.id === res.courtId)?.name || 'Desconocida';
                                 return (
                                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-base font-medium text-gray-900">
                                            <div className="text-sm font-bold text-[#112320]">{new Date(res.startTime).toLocaleDateString()}</div>
                                            <div className="text-sm text-gray-500">{res.startTime.split('T')[1].substring(0, 5)} - {res.endTime.split('T')[1].substring(0, 5)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-base font-bold text-[#112320]">{courtName}</td>
                                        <td className="px-6 py-4 text-base text-gray-600">{res.clientName}</td>
                                        <td className="px-6 py-4 text-base text-gray-500 italic">{res.createdBy || '-'}</td>
                                        <td className="px-6 py-4">
                                            <Badge color="gray">{res.type || 'Normal'}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-base font-bold text-[#1B3530]">${res.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-semibold ${res.status === ReservationStatus.CONFIRMED ? 'text-green-600' : res.status === ReservationStatus.CANCELLED ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {res.status === ReservationStatus.CONFIRMED ? 'Confirmada' : res.status === ReservationStatus.CANCELLED ? 'Cancelada' : res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="secondary" className="px-0 w-9 h-9 rounded-full flex items-center justify-center" onClick={() => onSelectReservation(res)}>
                                                <Eye size={16}/>
                                            </Button>
                                        </td>
                                    </tr>
                                 )
                             })
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    No hay historial de reservas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
              </div>
              {filteredReservationsList.length > itemsPerPage && (
                   <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white">
                       <Button variant="ghost" disabled={listPage === 1} onClick={() => setListPage(p => p - 1)} className="text-sm">Anterior</Button>
                       <span className="text-sm text-gray-600">Página {listPage} de {totalPages}</span>
                       <Button variant="ghost" disabled={listPage === totalPages} onClick={() => setListPage(p => p + 1)} className="text-sm">Siguiente</Button>
                   </div>
              )}
          </Card>
      )}
    </div>
  );
};

const ReportsPage = ({ onExport, reservations }: { onExport: () => void, reservations: Reservation[] }) => {
  const [dateRange, setDateRange] = useState('7_DAYS');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // --- Real Analytics Logic ---
  const analyticsData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    // Determine Date Range
    if (dateRange === '7_DAYS') {
        startDate.setDate(now.getDate() - 7);
    } else if (dateRange === '30_DAYS') {
        startDate.setDate(now.getDate() - 30);
    } else if (dateRange === '60_DAYS') {
        startDate.setDate(now.getDate() - 60);
    } else if (dateRange === 'LAST_MONTH') {
        startDate.setMonth(now.getMonth() - 1);
        startDate.setDate(1);
        endDate.setMonth(now.getMonth());
        endDate.setDate(0);
    } else if (dateRange === 'CUSTOM' && customStart && customEnd) {
        startDate = new Date(customStart);
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
    } else {
        // Default to 7 days
        startDate.setDate(now.getDate() - 7);
    }

    const filteredReservations = reservations.filter(r => {
        const rDate = new Date(r.startTime);
        return rDate >= startDate && rDate <= endDate && r.status !== ReservationStatus.CANCELLED;
    });

    const totalRevenue = filteredReservations.reduce((acc, curr) => acc + curr.price, 0);
    const totalBookings = filteredReservations.length;
    
    const totalMinutes = filteredReservations.reduce((acc, curr) => {
        const start = new Date(curr.startTime).getTime();
        const end = new Date(curr.endTime).getTime();
        return acc + ((end - start) / 60000);
    }, 0);
    const avgSession = totalBookings > 0 ? Math.round(totalMinutes / totalBookings) : 0;
    
    // Data for Graphs
    const revenueByDayMap = new Map<string, number>();
    const bookingsByWeekdayMap = { 'Lun': 0, 'Mar': 0, 'Mie': 0, 'Jue': 0, 'Vie': 0, 'Sab': 0, 'Dom': 0 };
    const hourlyDistributionMap = new Array(24).fill(0);
    
    // Customer Segments (based on type)
    const segmentsMap: Record<string, number> = {};
    Object.keys(RESERVATION_META).forEach(k => segmentsMap[k] = 0);

    filteredReservations.forEach(r => {
        // Revenue Line
        const dateKey = new Date(r.startTime).toLocaleDateString('es-ES', { weekday: 'short' });
        revenueByDayMap.set(dateKey, (revenueByDayMap.get(dateKey) || 0) + r.price);

        // Weekday Bar
        const dayName = new Date(r.startTime).toLocaleDateString('es-ES', { weekday: 'short' });
        // Normalize day name key
        const normalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');
        // Simple mapping attempt
        if (normalizedDay.startsWith('Lu')) bookingsByWeekdayMap['Lun']++;
        else if (normalizedDay.startsWith('Ma')) bookingsByWeekdayMap['Mar']++;
        else if (normalizedDay.startsWith('Mi')) bookingsByWeekdayMap['Mie']++;
        else if (normalizedDay.startsWith('Ju')) bookingsByWeekdayMap['Jue']++;
        else if (normalizedDay.startsWith('Vi')) bookingsByWeekdayMap['Vie']++;
        else if (normalizedDay.startsWith('Sá') || normalizedDay.startsWith('Sa')) bookingsByWeekdayMap['Sab']++;
        else if (normalizedDay.startsWith('Do')) bookingsByWeekdayMap['Dom']++;

        // Hourly
        const hour = new Date(r.startTime).getHours();
        hourlyDistributionMap[hour]++;

        // Segments
        const type = r.type || 'Normal';
        if (segmentsMap[type] !== undefined) segmentsMap[type]++;
        else segmentsMap['Normal']++;
    });

    const revenueData = Array.from(revenueByDayMap).map(([name, value]) => ({ name, value }));
    
    const bookingsByWeekday = Object.keys(bookingsByWeekdayMap).map(key => ({ 
        name: key, 
        // @ts-ignore
        value: bookingsByWeekdayMap[key] 
    }));

    const hourlyData = hourlyDistributionMap.map((val, idx) => ({ hour: `${idx}:00`, value: val })).slice(8, 24); 

    const customerSegments = Object.keys(segmentsMap)
        .filter(key => segmentsMap[key] > 0)
        .map(key => ({
            name: key,
            value: segmentsMap[key],
            color: RESERVATION_META[key]?.color || '#9CA3AF'
        }));

    return {
        dateLabel: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        kpis: [
            { label: 'Total Revenue', value: `$ ${totalRevenue.toLocaleString()}`, change: '+0%', trend: 'up', icon: DollarSign, color: 'bg-green-100 text-green-700' },
            { label: 'Total Bookings', value: `${totalBookings}`, change: '+0%', trend: 'up', icon: Calendar, color: 'bg-blue-100 text-blue-700' },
            { label: 'Avg. Session', value: `${avgSession}m`, change: '0%', trend: 'down', icon: ClockIcon, color: 'bg-orange-100 text-orange-700' },
            { label: 'Utilization', value: `${totalBookings > 0 ? 'High' : 'Low'}`, change: '0%', trend: 'up', icon: Activity, color: 'bg-purple-100 text-purple-700' },
        ],
        revenueData,
        bookingsByWeekday,
        hourlyData,
        customerSegments
    };

  }, [reservations, dateRange, customStart, customEnd]);

  return (
    <div className="p-8 space-y-8 pb-20 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-[#112320]">Reportes</h1>
           <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
             <Clock size={14}/> Periodo: <span className="font-semibold text-[#112320]">{analyticsData.dateLabel}</span>
           </p>
        </div>
        <div className="flex gap-3 items-center">
            {dateRange === 'CUSTOM' && (
                <div className="flex gap-2 animate-in fade-in">
                    <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#1B3530]" />
                    <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#1B3530]" />
                </div>
            )}
            <div className="relative">
                <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:border-[#1B3530] cursor-pointer"
                >
                    <option value="7_DAYS">Últimos 7 días</option>
                    <option value="30_DAYS">Últimos 30 días</option>
                    <option value="60_DAYS">Últimos 60 días</option>
                    <option value="CUSTOM">Seleccionar otra fecha</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                </div>
            </div>
            <Button onClick={onExport} variant="secondary"><FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.kpis.map((kpi, i) => (
            <Card key={i} className="p-6 relative overflow-hidden group bg-white border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                         <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
                         <h3 className="text-3xl font-bold text-[#112320] tracking-tight">{kpi.value}</h3>
                         <div className="mt-2 flex items-center gap-1">
                            {kpi.trend === 'up' ? 
                                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    <TrendingUp size={12} className="mr-1"/> {kpi.change}
                                </span> :
                                <span className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                    <TrendingUp size={12} className="mr-1 rotate-180"/> {kpi.change}
                                </span>
                            }
                            <span className="text-xs text-gray-400 font-medium">vs. prev period</span>
                         </div>
                    </div>
                    <div className={`p-3 rounded-2xl ${kpi.color}`}>
                        <kpi.icon size={24} />
                    </div>
                </div>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 flex flex-col">
              <h3 className="text-lg font-bold text-[#112320] mb-6">Revenue Overview (Daily)</h3>
              <div className="h-64 w-full">
                 {analyticsData.revenueData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="value" stroke="#1B3530" strokeWidth={3} dot={{r: 4, fill: "#1B3530"}} activeDot={{ r: 8 }} />
                    </LineChart>
                 </ResponsiveContainer>
                 ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400">
                         <TrendingUp size={32} className="mb-2 opacity-20"/>
                         <p className="text-sm">Sin datos de ingresos</p>
                     </div>
                 )}
              </div>
          </Card>

          <Card className="p-6 flex flex-col">
              <h3 className="text-lg font-bold text-[#112320] mb-6">Customer Segments</h3>
              <div className="h-64 w-full">
                {analyticsData.customerSegments.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={analyticsData.customerSegments}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {analyticsData.customerSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <PieChartIcon size={32} className="mb-2 opacity-20"/>
                        <p className="text-sm">Sin datos de segmentos</p>
                    </div>
                )}
              </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 flex flex-col">
                <h3 className="text-lg font-bold text-[#112320] mb-6">Bookings by Weekday</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.bookingsByWeekday}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#F8F8F8'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                            <Bar dataKey="value" fill="#1B3530" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-6 flex flex-col">
                <h3 className="text-lg font-bold text-[#112320] mb-6">Hourly Distribution</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.hourlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#F8F8F8'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                            <Bar dataKey="value" fill="#C7F269" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
      </div>
    </div>
  );
}

const CourtsPage = ({ 
  courts, 
  onAddCourt, 
  onEditCourt 
}: { 
  courts: Court[], 
  onAddCourt: () => void, 
  onEditCourt: (c: Court) => void 
}) => {
  const [sortConfig, setSortConfig] = useState<{key: keyof Court, direction: 'asc' | 'desc'} | null>(null);

  const handleSort = (key: keyof Court) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCourts = React.useMemo(() => {
    if (!sortConfig) return courts;
    return [...courts].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }, [courts, sortConfig]);

  const renderSortIcon = (key: keyof Court) => {
      if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="ml-1 text-gray-300" />;
      return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1 text-[#1B3530]" /> : <ArrowDown size={14} className="ml-1 text-[#1B3530]" />;
  };

  return (
    <div className="p-8 space-y-6 h-full overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-[#112320]">Canchas</h1>
        </div>
        <div className="flex gap-3">
          <Button onClick={onAddCourt}><Plus className="w-4 h-4 mr-2"/>Agregar Cancha</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left">
        <thead className="bg-[#F8F8F8] border-b border-gray-200">
            <tr>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center">Nombre {renderSortIcon('name')}</div>
            </th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors" onClick={() => handleSort('surface')}>
                <div className="flex items-center">Superficie {renderSortIcon('surface')}</div>
            </th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Características</th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider text-right">Acciones</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {sortedCourts.length > 0 ? (
                sortedCourts.map(court => (
                <tr key={court.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-base font-bold text-[#112320]">{court.name}</td>
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">{court.types.join(', ')}</td>
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">{court.surface}</td>
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">
                        {court.isIndoor && <span className="mr-2">Techada</span>}
                        {court.hasLighting && <span>Iluminación</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Button variant="secondary" className="px-0 w-9 h-9 rounded-full flex items-center justify-center" onClick={() => onEditCourt(court)}><Edit2 size={16}/></Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                            <PackageOpen size={32} className="mb-2 opacity-20"/>
                            No hay canchas configuradas.
                        </div>
                    </td>
                </tr>
            )}
        </tbody>
        </table>
    </Card>
    </div>
  );
};

const UsersPage = ({ 
  users, 
  onAddUser, 
  onEditUser, 
  onDeleteUser 
}: { 
  users: User[], 
  onAddUser: () => void, 
  onEditUser: (u: User) => void, 
  onDeleteUser: (id: string) => void
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
         <div className="flex items-center gap-2">
            <UsersIcon className="text-gray-400" size={20} />
            <h3 className="text-lg font-bold text-[#112320]">Gestión de Usuarios</h3>
         </div>
         <Button onClick={onAddUser} className="h-9 text-sm px-4"><Plus className="w-4 h-4 mr-2"/>Agregar Usuario</Button>
      </div>

      <Card className="p-0 overflow-hidden w-full">
        <table className="w-full text-left">
          <thead className="bg-[#F8F8F8] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
                users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-base font-bold text-[#112320]">{user.name}</td>
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                    <Badge color={user.role === 'OWNER' ? 'blue' : user.role === 'ADMIN' ? 'gray' : 'yellow'}>
                        {user.role === 'OWNER' ? 'Dueño' : user.role === 'ADMIN' ? 'Encargado' : 'Empleado'}
                    </Badge>
                    </td>
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-[#C7F269]' : 'bg-red-500'}`}></div>
                        <span className="text-base font-medium text-gray-600">{user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</span>
                    </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="p-2 flex items-center justify-center border border-gray-200 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100" onClick={() => onEditUser(user)}><Edit2 size={16}/></button>
                        <button className="p-2 flex items-center justify-center border border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full" onClick={() => onDeleteUser(user.id)}><Trash2 size={16}/></button>
                    </div>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No hay usuarios registrados.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const ClientsPage = ({ 
  clients, 
  onAddClient, 
  onViewClient,
  onBookClient
}: { 
  clients: Client[], 
  onAddClient: () => void, 
  onViewClient: (client: Client) => void,
  onBookClient: (client: Client) => void
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-bold text-[#112320]">Clientes</h1>
             </div>
             <Button onClick={onAddClient}><Plus className="w-4 h-4 mr-2"/>Agregar Cliente</Button>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar por nombre o email..." 
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-[#1B3530] focus:ring-1 focus:ring-[#1B3530] text-base bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card className="p-0 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#F8F8F8] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Bookings</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Total Gastado</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Última Reserva</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-bold text-[#112320] text-base">{client.name}</div>
                            <div className="text-base text-gray-500 font-medium">{client.email}</div>
                        </td>
                        <td className="px-6 py-4 text-base text-gray-500 font-medium">{client.phone}</td>
                        <td className="px-6 py-4 text-base text-[#112320] font-bold">{client.totalBookings}</td>
                        <td className="px-6 py-4 text-base text-[#1B3530] font-bold">${client.totalSpent.toLocaleString()}</td>
                        <td className="px-6 py-4 text-base text-gray-500 font-medium">{new Date(client.lastBooking).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" className="px-4 h-9 text-xs rounded-full" onClick={() => onViewClient(client)}>Ver</Button>
                            <Button className="px-4 h-9 text-xs rounded-full" onClick={() => onBookClient(client)}>Reservar</Button>
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                             No hay clientes registrados.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      );
};

const InventoryPage = ({ inventory, onAddProduct, onEditProduct, onImport }: { inventory: Product[], onAddProduct: () => void, onEditProduct: (p: Product) => void, onImport: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof Product, direction: 'asc' | 'desc'} | null>(null);

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredInventory = React.useMemo(() => {
    let data = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
        data.sort((a, b) => {
            // @ts-ignore
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            // @ts-ignore
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return data;
  }, [inventory, searchTerm, sortConfig]);

  const renderSortIcon = (key: keyof Product) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="ml-1 text-gray-300" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1 text-[#1B3530]" /> : <ArrowDown size={14} className="ml-1 text-[#1B3530]" />;
  };

  return (
    <div className="p-8 space-y-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-[#112320]">Inventario</h1>
         </div>
         <div className="flex gap-2">
            <Button variant="secondary" onClick={onImport}><Upload className="w-4 h-4 mr-2"/> Importar</Button>
            <Button onClick={onAddProduct}><Plus className="w-4 h-4 mr-2"/>Agregar Producto</Button>
         </div>
      </div>

       <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar por nombre o código..." 
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-[#1B3530] focus:ring-1 focus:ring-[#1B3530] text-base bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
       </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F8F8F8] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('code')}>
                 <div className="flex items-center">Código {renderSortIcon('code')}</div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                 <div className="flex items-center">Nombre {renderSortIcon('name')}</div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('purchasePrice')}>
                 <div className="flex items-center">Precio Compra {renderSortIcon('purchasePrice')}</div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('salePrice')}>
                 <div className="flex items-center">Precio Venta {renderSortIcon('salePrice')}</div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('type')}>
                 <div className="flex items-center">Tipo {renderSortIcon('type')}</div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('stock')}>
                 <div className="flex items-center">Stock {renderSortIcon('stock')}</div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Activo</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Últ. Modif.</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.length > 0 ? (
                filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">{item.code || '-'}</td>
                    <td className="px-6 py-4 text-base font-bold text-[#112320]">{item.name}</td>
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">${item.purchasePrice}</td>
                    <td className="px-6 py-4 text-base font-bold text-[#1B3530]">${item.salePrice}</td>
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">{item.type}</td>
                    <td className="px-6 py-4">
                        <span className={`text-base font-bold ${item.stock <= 5 ? 'text-red-600' : 'text-[#112320]'}`}>
                            {item.stock} u.
                        </span>
                        {item.showInStock && <span className="ml-2 text-xs text-gray-400 border border-gray-200 rounded px-1">Visible</span>}
                    </td>
                    <td className="px-6 py-4">
                        <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </td>
                    <td className="px-6 py-4 text-base text-gray-500 font-medium">{new Date(item.lastModified).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[#1B3530] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                        onClick={() => onEditProduct(item)}
                        >
                            <Edit2 size={18}/>
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                            <PackageOpen size={32} className="mb-2 opacity-20"/>
                            Aún no hay productos en el inventario.
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const UserProfilePage = ({ 
    user, 
    email, 
    onUpdateProfile, 
    onUpdatePassword 
}: { 
    user: any, 
    email: string, 
    onUpdateProfile: (data: any) => void, 
    onUpdatePassword: (pass: string) => void 
}) => {
    const [fullName, setFullName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY'>('PROFILE');

    useEffect(() => {
        if(user?.name) setFullName(user.name);
    }, [user]);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile({ full_name: fullName });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        onUpdatePassword(password);
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-[#112320]">Mi Perfil</h1>
            
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-full w-fit">
                <button
                    onClick={() => setActiveTab('PROFILE')}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'PROFILE' ? 'bg-white shadow-sm text-[#1B3530]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Información Personal
                </button>
                <button
                    onClick={() => setActiveTab('SECURITY')}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'SECURITY' ? 'bg-white shadow-sm text-[#1B3530]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Seguridad
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'PROFILE' && (
                    <Card className="p-6 max-w-2xl">
                        <h3 className="text-xl font-bold text-[#112320] mb-6 flex items-center gap-2">
                            <UserIcon size={20}/> Editar Información
                        </h3>
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <Input label="Email" value={email || ''} disabled icon={Mail} className="bg-gray-50 text-gray-500" />
                            <Input label="Nombre Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} icon={UserIcon} />
                            <div className="pt-2">
                                <Button type="submit">Actualizar Perfil</Button>
                            </div>
                        </form>
                    </Card>
                )}

                {activeTab === 'SECURITY' && (
                    <Card className="p-6 max-w-2xl">
                        <h3 className="text-xl font-bold text-[#112320] mb-6 flex items-center gap-2">
                            <Shield size={20}/> Cambiar Contraseña
                        </h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <Input label="Nueva Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={Key} />
                            <Input label="Confirmar Contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={Key} />
                            <div className="pt-2">
                                <Button type="submit" variant="secondary" disabled={!password}>Actualizar Contraseña</Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </div>
    );
};

const MyClubPage = ({ 
    clubConfig,
    onUpdateClub,
}: { 
    clubConfig: any,
    onUpdateClub: (data: any) => void,
}) => {
    const [activeTab, setActiveTab] = useState<'BASIC' | 'INTEGRATIONS' | 'SCHEDULE' | 'SERVICES' | 'APPEARANCE'>('BASIC');
    const [schedule, setSchedule] = useState(clubConfig.schedule || []);
    const [services, setServices] = useState<string[]>(clubConfig.services || []);
    
    // Basic Data
    const [basicData, setBasicData] = useState({
        name: clubConfig.name || 'Mi Club Deportivo',
        address: clubConfig.address || '',
        lat: clubConfig.lat || '',
        lng: clubConfig.lng || '',
        phone: clubConfig.phone || '',
        isActive: clubConfig.isActive !== undefined ? clubConfig.isActive : true
    });

    // Appearance
    const [description, setDescription] = useState(clubConfig.description || '');

    useEffect(() => {
        if(clubConfig.schedule) setSchedule(clubConfig.schedule);
        if(clubConfig.services) setServices(clubConfig.services);
        setBasicData(prev => ({
            ...prev,
            name: clubConfig.name || prev.name,
            address: clubConfig.address || prev.address,
            lat: clubConfig.lat || prev.lat,
            lng: clubConfig.lng || prev.lng,
            phone: clubConfig.phone || prev.phone,
            isActive: clubConfig.isActive !== undefined ? clubConfig.isActive : prev.isActive
        }));
        if(clubConfig.description) setDescription(clubConfig.description);
    }, [clubConfig]);

    const handleScheduleChange = (index: number, field: string, value: any) => {
        const newSchedule = [...schedule];
        // @ts-ignore
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const saveConfig = () => {
        onUpdateClub({ 
            schedule, 
            services, 
            description,
            ...basicData 
        });
    };

    const amenitiesList = [
        'Wi-Fi', 'Vestuario', 'Gimnasio', 'Estacionamiento', 'Ayuda Médica', 'Torneos', 
        'Cumpleaños', 'Parrilla', 'Escuelita deportiva', 'Colegios', 'Bar / Restaurante', 'Quincho'
    ];

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto pb-24">
            <h1 className="text-3xl font-bold text-[#112320]">Mi Club</h1>

             <div className="flex space-x-1 bg-gray-100 p-1 rounded-full w-fit overflow-x-auto max-w-full">
                <button onClick={() => setActiveTab('BASIC')} className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'BASIC' ? 'bg-white shadow-sm text-[#1B3530]' : 'text-gray-500 hover:text-gray-700'}`}>
                    Datos Básicos
                </button>
                <button onClick={() => setActiveTab('INTEGRATIONS')} className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'INTEGRATIONS' ? 'bg-white shadow-sm text-[#1B3530]' : 'text-gray-500 hover:text-gray-700'}`}>
                    Integraciones
                </button>
                <button onClick={() => setActiveTab('SCHEDULE')} className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'SCHEDULE' ? 'bg-white shadow-sm text-[#1B3530]' : 'text-gray-500 hover:text-gray-700'}`}>
                    Horarios
                </button>
                <button onClick={() => setActiveTab('SERVICES')} className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'SERVICES' ? 'bg-white shadow-sm text-[#1B3530]' : 'text-gray-500 hover:text-gray-700'}`}>
                    Servicios
                </button>
                <button onClick={() => setActiveTab('APPEARANCE')} className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'APPEARANCE' ? 'bg-white shadow-sm text-[#1B3530]' : 'text-gray-500 hover:text-gray-700'}`}>
                    Apariencia
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl">
                {activeTab === 'BASIC' && (
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-[#112320] mb-6 flex items-center gap-2">
                            <Info size={20}/> Información General
                        </h3>
                        <div className="space-y-6">
                            <Input label="Nombre del Club" value={basicData.name} onChange={e => setBasicData({...basicData, name: e.target.value})} />
                            <Input label="Dirección" value={basicData.address} onChange={e => setBasicData({...basicData, address: e.target.value})} icon={MapPin} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Latitud" value={basicData.lat} onChange={e => setBasicData({...basicData, lat: e.target.value})} placeholder="-34.1234" />
                                <Input label="Longitud" value={basicData.lng} onChange={e => setBasicData({...basicData, lng: e.target.value})} placeholder="-58.1234" />
                            </div>
                            <Input label="Teléfono" value={basicData.phone} onChange={e => setBasicData({...basicData, phone: e.target.value})} icon={Phone} />
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <span className="font-medium text-[#112320]">Estado del Complejo</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={basicData.isActive} onChange={(e) => setBasicData({...basicData, isActive: e.target.checked})} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B3530]"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">{basicData.isActive ? 'Activo' : 'Inactivo'}</span>
                                </label>
                            </div>
                            
                            <div className="flex justify-end mt-6">
                                <Button onClick={saveConfig} className="px-8">Guardar Datos</Button>
                            </div>
                        </div>
                    </Card>
                )}

                {activeTab === 'INTEGRATIONS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 flex flex-col items-center text-center space-y-4">
                             <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                                 <DollarSign size={32} />
                             </div>
                             <h3 className="text-lg font-bold">MercadoPago</h3>
                             <p className="text-sm text-gray-500">Conecta tu cuenta para recibir pagos de señas y reservas online.</p>
                             <Button variant="secondary" className="w-full mt-auto"><Plug size={16} className="mr-2"/> Conectar</Button>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center space-y-4">
                             <div className="w-16 h-16 bg-[#1B3530] rounded-full flex items-center justify-center text-[#C7F269] mb-2">
                                 <Camera size={32} />
                             </div>
                             <h3 className="text-lg font-bold">Beelup</h3>
                             <p className="text-sm text-gray-500">Sistema de grabación automática de partidos. Integra tus cámaras.</p>
                             <Button variant="secondary" className="w-full mt-auto"><Plug size={16} className="mr-2"/> Conectar</Button>
                        </Card>
                    </div>
                )}

                {activeTab === 'SCHEDULE' && (
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-[#112320] mb-6 flex items-center gap-2">
                            <ClockIcon size={20}/> Horarios de Apertura
                        </h3>
                        <div className="space-y-4">
                            {schedule.map((day: any, index: number) => (
                                <div key={day.day} className="flex items-center justify-between gap-4 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                                    <div className="w-24 font-medium text-gray-700">{day.day}</div>
                                    <div className="flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={day.open} onChange={(e) => handleScheduleChange(index, 'open', e.target.checked)} />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1B3530]"></div>
                                        </label>
                                    </div>
                                    {day.open ? (
                                        <div className="flex items-center gap-2 text-sm">
                                            <input type="time" value={day.start} onChange={(e) => handleScheduleChange(index, 'start', e.target.value)} className="border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-[#1B3530] outline-none" />
                                            <span className="text-gray-400">a</span>
                                            <input type="time" value={day.end} onChange={(e) => handleScheduleChange(index, 'end', e.target.value)} className="border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-[#1B3530] outline-none" />
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">Cerrado</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                             <Button onClick={saveConfig} className="px-8">Guardar Horarios</Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'SERVICES' && (
                     <Card className="p-6">
                        <h3 className="text-xl font-bold text-[#112320] mb-6 flex items-center gap-2"><Palette size={20}/> Servicios del Club</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {amenitiesList.map(item => (
                                <div key={item} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#1B3530]/30 hover:bg-gray-50 transition-all cursor-pointer" onClick={() => {
                                    if (services.includes(item)) setServices(services.filter(s => s !== item));
                                    else setServices([...services, item]);
                                }}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${services.includes(item) ? 'bg-[#1B3530] border-[#1B3530]' : 'border-gray-300 bg-white'}`}>
                                        {services.includes(item) && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className="text-sm font-medium text-[#112320]">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-4">
                             <Button onClick={saveConfig} className="px-8">Guardar Servicios</Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'APPEARANCE' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <Card className="p-6">
                                <h4 className="font-bold text-[#112320] mb-4">Logo del Club</h4>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                    <ImageIcon size={40} className="text-gray-300 mb-2" />
                                    <span className="text-sm text-gray-500">Click para subir imagen</span>
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="text-xs text-gray-400">Recomendado: 500x500px</p>
                                    <p className="text-xs text-gray-400">Formato: PNG, JPG (Max 2MB)</p>
                                </div>
                             </Card>
                             <Card className="p-6">
                                <h4 className="font-bold text-[#112320] mb-4">Imagen de Portada</h4>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                    <ImageIcon size={40} className="text-gray-300 mb-2" />
                                    <span className="text-sm text-gray-500">Click para subir imagen</span>
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="text-xs text-gray-400">Recomendado: 1920x1080px</p>
                                    <p className="text-xs text-gray-400">Formato: JPG, WEBP (Max 5MB)</p>
                                </div>
                             </Card>
                        </div>

                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-[#112320] mb-4 flex items-center gap-2"><FileText size={20}/> Descripción del complejo</h3>
                            <Textarea 
                                placeholder="Escribe una descripción atractiva para tus clientes..."
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                            />
                            <div className="mt-4 flex justify-end">
                                 <Button onClick={saveConfig} className="px-8">Guardar Apariencia</Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [clubConfig, setClubConfig] = useState<any>({}); // Init as empty object
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const [reviews, setReviews] = useState<any[]>([]); // Initialize empty reviews

  const [activeSheet, setActiveSheet] = useState<null | 'RESERVATION' | 'COURT' | 'USER' | 'CLIENT' | 'VIEW_CLIENT' | 'PRODUCT' | 'VIEW_RESERVATION' | 'EXPORT_OPTIONS' | 'IMPORT_INVENTORY' | 'DELETE_USER_CONFIRMATION' | 'DELETE_RESERVATION_CONFIRMATION' | 'REPLY_REVIEW' | 'REPORT_REVIEW' | 'LOGOUT_CONFIRMATION'>(null);
  
  // Default Schedule
  const [schedule, setSchedule] = useState([
    { day: 'Domingo', open: true, start: '10:00', end: '22:00' },
    { day: 'Lunes', open: true, start: '09:00', end: '23:00' },
    { day: 'Martes', open: true, start: '09:00', end: '23:00' },
    { day: 'Miércoles', open: true, start: '09:00', end: '23:00' },
    { day: 'Jueves', open: true, start: '09:00', end: '23:00' },
    { day: 'Viernes', open: true, start: '09:00', end: '23:00' },
    { day: 'Sábado', open: true, start: '09:00', end: '23:00' },
    { day: 'Feriado', open: true, start: '10:00', end: '22:00' },
  ]);
  
  const [clubServices, setClubServices] = useState<string[]>(['Wi-Fi', 'Estacionamiento', 'Vestuario']);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
  };

  // --- Initialize & Data Fetching ---
  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
          setIsAuthenticated(true);
          setUserProfile({
             email: session.user.email,
             name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
             id: session.user.id
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
         setIsAuthenticated(true);
      } else {
         setIsAuthenticated(false);
      }
    });

    const fetchData = async () => {
        try {
            const { data: courtsData } = await supabase.from('courts').select('*');
            if (courtsData) setCourts(courtsData);

            const { data: reservationsData } = await supabase.from('reservations').select('*');
            if (reservationsData) setReservations(reservationsData);

            const { data: clientsData } = await supabase.from('clients').select('*');
            if (clientsData) setClients(clientsData);

            const { data: productsData } = await supabase.from('products').select('*');
            if (productsData) setInventory(productsData);

            const { data: profilesData } = await supabase.from('profiles').select('*');
            if (profilesData) {
                 const mappedUsers = profilesData.map((p: any) => ({
                     id: p.id,
                     name: p.name,
                     email: p.email,
                     role: p.role,
                     status: p.status || 'ACTIVE'
                 }));
                 setUsers(mappedUsers);
            }
            
            // Fetch Club Settings
            const { data: clubData } = await supabase.from('club_settings').select('*').single();
            if (clubData) {
                setClubConfig(clubData);
                if (clubData.schedule) setSchedule(clubData.schedule);
                if (clubData.services) setClubServices(clubData.services);
                if (clubData.welcomeMessage) setWelcomeMessage(clubData.welcomeMessage);
            }

        } catch (error) {
            console.error("Error fetching data from Supabase:", error);
        }
    };
    
    if (isAuthenticated) {
        fetchData();
    }

    return () => subscription.unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUserProfile(userData);
    showFeedback(`Bienvenido, ${userData.name}`);
  };
  
  const handleLogout = () => {
    setActiveSheet('LOGOUT_CONFIRMATION');
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setActiveSheet(null);
    setUserProfile(null);
  };

  const handleUpdateProfile = async (data: any) => {
      setUserProfile((prev: any) => ({ ...prev, full_name: data.full_name, name: data.full_name }));
      if (userProfile?.id) {
          await supabase.from('profiles').upsert({ id: userProfile.id, name: data.full_name });
      }
      showFeedback("Perfil actualizado correctamente");
  };
  
  const handleUpdatePassword = async (newPass: string) => {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) {
          showFeedback("Error al actualizar contraseña: " + error.message, 'error');
      } else {
          showFeedback("Contraseña actualizada correctamente");
      }
  }

  const handleUpdateClub = async (newData: any) => {
     // Local state update
     if (newData.schedule) setSchedule(newData.schedule);
     if (newData.services) setClubServices(newData.services);
     if (newData.welcomeMessage !== undefined) setWelcomeMessage(newData.welcomeMessage);
     
     const updatedConfig = { ...clubConfig, ...newData };
     setClubConfig(updatedConfig);

     // Persist to Supabase
     try {
         const upsertData = {
             id: clubConfig?.id, // If exists, update; else create new UUID (handled by DB default if undefined, but logic usually requires ID for update)
             name: newData.name,
             address: newData.address,
             phone: newData.phone,
             lat: newData.lat,
             lng: newData.lng,
             description: newData.description,
             isActive: newData.isActive,
             services: newData.services,
             schedule: newData.schedule,
             welcomeMessage: newData.welcomeMessage
         };
         
         // Using upsert. If clubConfig.id is undefined, Supabase will generate a new one if we don't send 'id'.
         // However, since we want a singleton row logic usually, let's check if we have an ID.
         // If we fetched data, we have an ID.
         
         const { data, error } = await supabase.from('club_settings').upsert(upsertData).select().single();
         
         if (error) throw error;
         if (data) setClubConfig(data);

         showFeedback("Configuración del club actualizada y guardada");
     } catch (error: any) {
         console.error("Error updating club settings:", error);
         showFeedback("Error al guardar en base de datos", 'error');
     }
  };

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [courtFormTypes, setCourtFormTypes] = useState<string[]>([]);
  
  const [prefillReservation, setPrefillReservation] = useState<{date: string, time: string, courtId: string, clientName?: string} | null>(null);
  const [reservationForm, setReservationForm] = useState({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      depositAmount: '',
      depositMethod: 'Efectivo',
      paymentMethod: 'Efectivo',
      notes: '',
      type: 'Normal',
      duration: '60',
      isRecurring: false,
      price: '4500'
  });
  
  const [cancellationReason, setCancellationReason] = useState('OTHER');
  const [cancellationOtherText, setCancellationOtherText] = useState('');

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [reviewActionId, setReviewActionId] = useState<number | null>(null);

  const closeSheet = () => {
    setActiveSheet(null);
  };

  const resetReservationForm = () => {
    setReservationForm({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        depositAmount: '',
        depositMethod: 'Efectivo',
        paymentMethod: 'Efectivo',
        notes: '',
        type: 'Normal',
        duration: '60',
        isRecurring: false,
        price: '4500'
    });
    setPrefillReservation(null);
    setSelectedReservation(null);
  };

  const handleClientNameChange = (val: string) => {
    setReservationForm(prev => ({ ...prev, clientName: val }));
  };

  const handleClientSelect = (client: any) => {
     setReservationForm(prev => ({
        ...prev, 
        clientName: client.name,
        clientPhone: client.phone,
        clientEmail: client.email
    }));
  };

  const handleSaveReservation = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      
      const formCourtId = prefillReservation?.courtId || courts[0].id;
      const formDate = prefillReservation?.date || selectedDate;
      const formTime = prefillReservation?.time || '10:00';

      const endTime = `${formDate}T${(parseInt(formTime.split(':')[0]) + (parseInt(reservationForm.duration) / 60)).toString().padStart(2, '0')}:${formTime.split(':')[1]}`;
      const creatorName = userProfile?.name || "Admin";

      const baseReservationData = {
        courtId: formCourtId,
        clientName: reservationForm.clientName,
        startTime: `${formDate}T${formTime}`,
        endTime: endTime,
        price: Number(reservationForm.price) || 4500,
        status: ReservationStatus.CONFIRMED,
        isPaid: false,
        createdBy: creatorName,
        paymentMethod: reservationForm.paymentMethod,
        type: reservationForm.type,
        notes: reservationForm.notes
      };

      try {
        if (selectedReservation) {
            const { error } = await supabase.from('reservations').update(baseReservationData).eq('id', selectedReservation.id);
            if (error) throw error;
            setReservations(reservations.map(r => r.id === selectedReservation.id ? { ...r, ...baseReservationData } : r));
            showFeedback("Reserva actualizada con éxito");
        } else {
            const { data, error } = await supabase.from('reservations').insert(baseReservationData).select();
             if (error) throw error;
            if (data) setReservations([...reservations, data[0]]);
            showFeedback("Reserva creada con éxito");
        }
      } catch (err) {
          console.error("Error saving reservation:", err);
          showFeedback("Error al guardar reserva", 'error');
      }
      resetReservationForm();
      setActiveSheet(null);
  };
  
  const initiateDeleteReservation = () => {
      setCancellationReason('OTHER');
      setCancellationOtherText('');
      setActiveSheet('DELETE_RESERVATION_CONFIRMATION');
  };

  const confirmDeleteReservation = async () => { 
      if (selectedReservation) {
          const reason = cancellationReason === 'OTHER' ? cancellationOtherText : 
                         cancellationReason === 'CLIENT_CANCEL' ? 'Cancelado por el cliente' :
                         cancellationReason === 'WEATHER' ? 'Clima' : 'Mantenimiento';

          const updatedReservation = { ...selectedReservation, status: ReservationStatus.CANCELLED, cancellationReason: reason };

          try {
             await supabase.from('reservations').update({ status: ReservationStatus.CANCELLED, cancellationReason: reason }).eq('id', selectedReservation.id);
             setReservations(reservations.map(r => r.id === selectedReservation.id ? updatedReservation : r));
             showFeedback("Reserva cancelada correctamente");
          } catch(err) { console.error(err); }
      }
      resetReservationForm();
      setActiveSheet(null); 
  };
  
  const handleSaveCourt = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      
      const baseCourtData = {
          name: formData.get('name') as string,
          types: courtFormTypes,
          surface: formData.get('surface') as string,
          isIndoor: formData.get('isIndoor') === 'on',
          hasLighting: formData.get('hasLighting') === 'on',
          forceStart: (formData.get('forceStart') as ForceStartOption) || 'NO_ROUNDING'
      };

      try {
        if (selectedCourt) {
            const { error } = await supabase.from('courts').update(baseCourtData).eq('id', selectedCourt.id);
            if (error) throw error;
            setCourts(courts.map(c => c.id === selectedCourt.id ? { ...baseCourtData, id: selectedCourt.id } : c));
            showFeedback("Cancha actualizada");
        } else {
            const { data, error } = await supabase.from('courts').insert(baseCourtData).select();
            if (error) throw error;
            if (data) setCourts([...courts, data[0]]);
            showFeedback("Cancha agregada exitosamente");
        }
      } catch (err) {
          console.error(err);
          showFeedback("Error al guardar cancha: " + (err as any).message, 'error');
      }

      setSelectedCourt(null);
      setActiveSheet(null); 
  };
  
  const handleSaveUser = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      // Logic for adding users in Supabase would typically involve an admin function or invitation
      // Here we simulate updating the profiles table for management view
      showFeedback("Funcionalidad de gestión de usuarios requiere privilegios administrativos en Supabase", 'error');
      setSelectedUser(null);
      setActiveSheet(null); 
  };
  
  const initiateDeleteUser = (id: string) => { setDeleteUserId(id); setActiveSheet('DELETE_USER_CONFIRMATION'); };
  const confirmDeleteUser = async () => { 
      if (deleteUserId) {
          // Supabase Auth deletion requires admin API
          await supabase.from('profiles').delete().eq('id', deleteUserId);
          setUsers(users.filter(u => u.id !== deleteUserId)); 
          showFeedback("Usuario eliminado de la lista");
      }
      setActiveSheet(null); 
  };
  
  const handleSaveClient = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      const newClient = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          totalBookings: 0,
          totalSpent: 0,
          lastBooking: new Date().toISOString()
      };
      
      const { data } = await supabase.from('clients').insert(newClient).select();
      if (data) setClients([...clients, data[0]]);
      
      showFeedback("Cliente registrado");
      setActiveSheet(null); 
  };
  
  const openBookClient = (client: Client) => { 
      setPrefillReservation({ date: selectedDate, time: '10:00', courtId: courts.length > 0 ? courts[0].id : '', clientName: client.name });
      setReservationForm(prev => ({...prev, clientName: client.name, clientPhone: client.phone, clientEmail: client.email}));
      setActiveSheet('RESERVATION');
  };
  
  const handleSaveProduct = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      const newProduct: Product = {
          id: selectedProduct ? selectedProduct.id : '',
          code: formData.get('code') as string,
          name: formData.get('name') as string,
          purchasePrice: Number(formData.get('purchasePrice')),
          salePrice: Number(formData.get('salePrice')),
          type: formData.get('type') as string,
          stock: Number(formData.get('stock')),
          showInStock: true,
          active: true,
          lastModified: new Date().toISOString()
      };

      if(selectedProduct) {
          await supabase.from('products').update(newProduct).eq('id', selectedProduct.id);
          setInventory(inventory.map(p => p.id === selectedProduct.id ? newProduct : p));
          showFeedback("Producto actualizado");
      } else {
          // Remove ID to let DB generate UUID
          const { id, ...insertData } = newProduct;
          const { data } = await supabase.from('products').insert(insertData).select();
          if (data) setInventory([...inventory, data[0]]);
          showFeedback("Producto agregado al inventario");
      }
      setSelectedProduct(null);
      setActiveSheet(null); 
  };

  const handleExport = (format: string) => {
    showFeedback(`Exportando reporte en formato ${format}...`);
    setActiveSheet(null);
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const replyText = formData.get('replyText') as string;

    setReviews(prev => prev.map(r => r.id === reviewActionId ? { ...r, reply: replyText } : r));
    showFeedback("Respuesta enviada");
    setActiveSheet(null);
    setReviewActionId(null);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const reason = formData.get('reportReason') as string;

    setReviews(prev => prev.map(r => r.id === reviewActionId ? { ...r, isReported: true, reportReason: reason } : r));
    showFeedback("Reseña reportada");
    setActiveSheet(null);
    setReviewActionId(null);
  };

  const handleEditReservation = () => {
      if (!selectedReservation) return;
      const startDate = new Date(selectedReservation.startTime);
      const endDate = new Date(selectedReservation.endTime);
      const duration = (endDate.getTime() - startDate.getTime()) / 60000;

      setPrefillReservation({
          date: selectedReservation.startTime.split('T')[0],
          time: selectedReservation.startTime.split('T')[1].substring(0, 5),
          courtId: selectedReservation.courtId,
          clientName: selectedReservation.clientName
      });
      setReservationForm({
          clientName: selectedReservation.clientName,
          clientPhone: '',
          clientEmail: '',
          depositAmount: '',
          depositMethod: 'Efectivo',
          paymentMethod: selectedReservation.paymentMethod || 'Efectivo',
          notes: selectedReservation.notes || '',
          type: selectedReservation.type || 'Normal',
          duration: duration.toString(),
          isRecurring: false,
          price: selectedReservation.price.toString()
      });
      setActiveSheet('RESERVATION');
  };

  const canAccessFullApp = userProfile?.role === 'OWNER' || userProfile?.role === 'ADMIN';

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="*" element={isAuthenticated ? (
          <div className="flex bg-[#F8F8F8] min-h-screen">
            <Sidebar onLogout={handleLogout} user={userProfile} />
            <main className="flex-1 h-screen overflow-hidden">
                <Routes>
                  <Route path="/" element={
                      <ReservasPage 
                          courts={courts} 
                          reservations={reservations} 
                          selectedDate={selectedDate}
                          onDateChange={setSelectedDate}
                          schedule={schedule}
                          onAddReservation={(date, time, courtId) => {
                              resetReservationForm();
                              setPrefillReservation({ date: date || selectedDate, time: time || '09:00', courtId: courtId || courts[0].id });
                              setActiveSheet('RESERVATION');
                          }}
                          onSelectReservation={(res) => {
                              setSelectedReservation(res);
                              setActiveSheet('VIEW_RESERVATION');
                          }}
                      />
                  } />
                  
                  <Route path="/profile" element={<UserProfilePage user={userProfile} email={userProfile?.email} onUpdateProfile={handleUpdateProfile} onUpdatePassword={handleUpdatePassword} />} />

                  {/* Restricted Routes */}
                  {canAccessFullApp ? (
                    <>
                        <Route path="/courts" element={<CourtsPage courts={courts} onAddCourt={() => { setSelectedCourt(null); setCourtFormTypes([]); setActiveSheet('COURT'); }} onEditCourt={(c) => { setSelectedCourt(c); setCourtFormTypes(c.types); setActiveSheet('COURT'); }} />} />
                        <Route path="/clients" element={<ClientsPage clients={clients} onAddClient={() => setActiveSheet('CLIENT')} onViewClient={(c) => { setSelectedClient(c); setActiveSheet('VIEW_CLIENT'); }} onBookClient={openBookClient} />} />
                        <Route path="/inventory" element={<InventoryPage inventory={inventory} onAddProduct={() => { setSelectedProduct(null); setActiveSheet('PRODUCT'); }} onEditProduct={(p) => { setSelectedProduct(p); setActiveSheet('PRODUCT'); }} onImport={() => setActiveSheet('IMPORT_INVENTORY')} />} />
                        <Route path="/reports" element={<ReportsPage onExport={() => setActiveSheet('EXPORT_OPTIONS')} reservations={reservations} />} />
                        <Route path="/my-club" element={<MyClubPage clubConfig={{...clubConfig, schedule, services: clubServices, welcomeMessage }} onUpdateClub={handleUpdateClub} />} />
                    </>
                  ) : (
                    // Redirect employees to home
                    <Route path="*" element={<Navigate to="/" />} />
                  )}

                </Routes>
            </main>

            <Snackbar 
                message={notification.message} 
                type={notification.type} 
                isVisible={notification.show} 
                onClose={() => setNotification(prev => ({ ...prev, show: false }))} 
            />

            {/* --- SIDE SHEETS --- */}
            
            <SideSheet isOpen={activeSheet === 'RESERVATION'} onClose={closeSheet} title={selectedReservation ? "Editar Reserva" : "Nueva Reserva"}>
                <form className="space-y-6" onSubmit={handleSaveReservation}>
                   <div className="space-y-4">
                       <AutocompleteInput 
                           label="Nombre del Cliente"
                           placeholder="Buscar o escribir nombre..."
                           value={reservationForm.clientName}
                           onChange={handleClientNameChange}
                           suggestions={clients}
                           onSelect={handleClientSelect}
                           required
                       />

                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Teléfono" placeholder="+54..." value={reservationForm.clientPhone} onChange={e => setReservationForm({...reservationForm, clientPhone: e.target.value})} />
                          <Input label="Email" placeholder="cliente@email.com" value={reservationForm.clientEmail} onChange={e => setReservationForm({...reservationForm, clientEmail: e.target.value})} />
                       </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-gray-100">
                       <Select label="Cancha" defaultValue={prefillReservation?.courtId} onChange={(e) => setPrefillReservation(prev => prev ? {...prev, courtId: e.target.value} : null)}>
                           {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </Select>
                       <div className="grid grid-cols-2 gap-4">
                           <Input type="date" label="Fecha" value={prefillReservation?.date} onChange={(e) => setPrefillReservation(prev => prev ? {...prev, date: e.target.value} : null)} />
                           <Input type="time" label="Hora" value={prefillReservation?.time} onChange={(e) => setPrefillReservation(prev => prev ? {...prev, time: e.target.value} : null)} />
                       </div>
                       <Select label="Duración" value={reservationForm.duration} onChange={(e) => setReservationForm({...reservationForm, duration: e.target.value})}>
                           <option value="60">1 Hora</option>
                           <option value="90">1 Hora 30 min</option>
                           <option value="120">2 Horas</option>
                       </Select>
                       <Select label="Tipo de Reserva" value={reservationForm.type} onChange={(e) => setReservationForm({...reservationForm, type: e.target.value})}>
                           {Object.entries(RESERVATION_META).map(([key, meta]) => (
                               <option key={key} value={key}>{meta.label}</option>
                           ))}
                       </Select>
                   </div>
                   
                   <div className="space-y-4 pt-4 border-t border-gray-100">
                        <Input 
                            label="Precio" 
                            type="number" 
                            icon={DollarSign} 
                            value={reservationForm.price} 
                            onChange={e => setReservationForm({...reservationForm, price: e.target.value})} 
                            required
                            disabled
                        />
                        <Select label="Método de Pago" value={reservationForm.paymentMethod} onChange={(e) => setReservationForm({...reservationForm, paymentMethod: e.target.value})}>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Mercado Pago">Mercado Pago</option>
                            <option value="Tarjeta Débito">Tarjeta Débito</option>
                            <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                        </Select>
                        <Input label="Seña (Opcional)" placeholder="$ 0.00" icon={DollarSign} value={reservationForm.depositAmount} onChange={e => setReservationForm({...reservationForm, depositAmount: e.target.value})} />
                        <Textarea label="Notas" placeholder="Comentarios adicionales..." value={reservationForm.notes} onChange={e => setReservationForm({...reservationForm, notes: e.target.value})} />
                   </div>

                   <div className="pt-6 flex gap-3">
                       <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                       <Button type="submit" className="flex-1">Confirmar Reserva</Button>
                   </div>
                </form>
            </SideSheet>

            <SideSheet isOpen={activeSheet === 'VIEW_RESERVATION'} onClose={closeSheet} title="Detalle de Reserva">
                {selectedReservation && (
                    <div className="space-y-6">
                         <div className="bg-[#F8F8F8] p-4 rounded-2xl flex items-center justify-between">
                             <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Estado</p>
                                <Badge color={selectedReservation.status === 'Confirmed' ? 'green' : selectedReservation.status === 'Cancelled' ? 'red' : 'yellow'}>
                                    {selectedReservation.status === 'Cancelled' ? 'Cancelada' : selectedReservation.status}
                                </Badge>
                             </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase">Precio Total</p>
                                <p className="text-2xl font-bold text-[#1B3530]">${selectedReservation.price}</p>
                             </div>
                         </div>

                         <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <p className="text-sm text-gray-500">Fecha</p>
                                     <p className="font-bold text-[#112320]">{new Date(selectedReservation.startTime).toLocaleDateString()}</p>
                                 </div>
                                 <div>
                                     <p className="text-sm text-gray-500">Horario</p>
                                     <p className="font-bold text-[#112320]">
                                         {selectedReservation.startTime.split('T')[1].substring(0, 5)} - {selectedReservation.endTime.split('T')[1].substring(0, 5)}
                                     </p>
                                 </div>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500">Cancha</p>
                                 <p className="font-bold text-[#112320]">{courts.find(c => c.id === selectedReservation.courtId)?.name}</p>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500">Cliente</p>
                                 <p className="font-bold text-[#112320]">{selectedReservation.clientName}</p>
                             </div>
                             <div>
                                <p className="text-sm text-gray-500">Creado Por</p>
                                <p className="font-bold text-[#112320]">{selectedReservation.createdBy || 'Sistema'}</p>
                             </div>
                             <div>
                                <p className="text-sm text-gray-500">Método de Pago</p>
                                <p className="font-bold text-[#112320]">{selectedReservation.paymentMethod || 'No especificado'}</p>
                             </div>
                             {selectedReservation.notes && (
                                <div>
                                    <p className="text-sm text-gray-500">Notas</p>
                                    <p className="text-[#112320] italic">{selectedReservation.notes}</p>
                                </div>
                             )}
                             {selectedReservation.status === ReservationStatus.CANCELLED && selectedReservation.cancellationReason && (
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                    <p className="text-xs font-bold text-red-600 uppercase mb-1">Motivo Cancelación</p>
                                    <p className="text-sm text-gray-700">{selectedReservation.cancellationReason}</p>
                                </div>
                             )}
                         </div>

                         {selectedReservation.status !== ReservationStatus.CANCELLED && (
                            <div className="pt-6 flex flex-col gap-3">
                                <Button onClick={handleEditReservation}>Editar Reserva</Button>
                                <Button variant="destructive" onClick={initiateDeleteReservation}>Cancelar Reserva</Button>
                            </div>
                         )}
                    </div>
                )}
            </SideSheet>

            <SideSheet isOpen={activeSheet === 'COURT'} onClose={closeSheet} title={selectedCourt ? "Editar Cancha" : "Nueva Cancha"}>
                <form className="space-y-6" onSubmit={handleSaveCourt}>
                    <Input name="name" label="Nombre de la Cancha" placeholder="Ej. Cancha 1" defaultValue={selectedCourt?.name} required />
                    
                    <div className="space-y-2">
                        <MultiSelect 
                            label="Deportes" 
                            options={SPORTS_LIST} 
                            selected={courtFormTypes} 
                            onChange={setCourtFormTypes} 
                        />
                    </div>

                    <Select name="surface" label="Superficie" defaultValue={selectedCourt?.surface}>
                        {SURFACE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>

                    <RadioGroup 
                        label="Forzar Inicio de Turnos"
                        name="forceStart"
                        defaultValue={selectedCourt?.forceStart || 'NO_ROUNDING'}
                        options={[
                            { label: 'No redondear (Cualquier horario)', value: 'NO_ROUNDING' },
                            { label: 'En punto (XX:00)', value: 'ON_HOUR' },
                            { label: 'Y media (XX:30)', value: 'HALF_HOUR' }
                        ]}
                    />

                    <div className="space-y-3">
                        <label className="text-base font-medium text-[#112320]">Atributos</label>
                        <div className="flex flex-col gap-3">
                            <Checkbox name="isIndoor" label="Techada" defaultChecked={selectedCourt?.isIndoor} />
                            <Checkbox name="hasLighting" label="Iluminación" defaultChecked={selectedCourt?.hasLighting} />
                        </div>
                    </div>
                    
                    <div className="pt-6 flex gap-3">
                       <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                       <Button type="submit" className="flex-1">Guardar</Button>
                   </div>
                </form>
            </SideSheet>

            <SideSheet isOpen={activeSheet === 'USER'} onClose={closeSheet} title={selectedUser ? "Editar Usuario" : "Nuevo Usuario"}>
                <form className="space-y-6" onSubmit={handleSaveUser}>
                    <Input name="name" label="Nombre Completo" placeholder="Ej. Juan Pérez" defaultValue={selectedUser?.name} required />
                    <Input name="email" label="Email" type="email" placeholder="juan@club.com" defaultValue={selectedUser?.email} required />
                    <Select name="role" label="Rol" defaultValue={selectedUser?.role || 'RECEPTIONIST'}>
                        <option value="OWNER">Dueño (Acceso Total)</option>
                        <option value="ADMIN">Encargado (Acceso Total)</option>
                        <option value="RECEPTIONIST">Empleado (Solo Reservas)</option>
                    </Select>
                    <div className="pt-6 flex gap-3">
                       <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                       <Button type="submit" className="flex-1">Guardar Usuario</Button>
                   </div>
                </form>
            </SideSheet>
            
            <SideSheet isOpen={activeSheet === 'CLIENT'} onClose={closeSheet} title="Nuevo Cliente">
                <form className="space-y-6" onSubmit={handleSaveClient}>
                    <Input name="name" label="Nombre Completo" placeholder="Ej. Maria Gomez" required />
                    <Input name="phone" label="Teléfono" placeholder="+54 9 11..." required />
                    <Input name="email" label="Email" type="email" placeholder="maria@email.com" />
                    <div className="pt-6 flex gap-3">
                       <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                       <Button type="submit" className="flex-1">Guardar Cliente</Button>
                   </div>
                </form>
            </SideSheet>

            <SideSheet isOpen={activeSheet === 'VIEW_CLIENT'} onClose={closeSheet} title="Detalle del Cliente">
                {selectedClient && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-[#1B3530] rounded-full flex items-center justify-center text-[#C7F269] text-2xl font-bold">
                                {selectedClient.name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#112320]">{selectedClient.name}</h3>
                                <p className="text-gray-500">{selectedClient.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-[#F8F8F8] border-none">
                                <p className="text-xs text-gray-500 font-bold uppercase">Reservas</p>
                                <p className="text-2xl font-bold text-[#112320]">{selectedClient.totalBookings}</p>
                            </Card>
                            <Card className="p-4 bg-[#F8F8F8] border-none">
                                <p className="text-xs text-gray-500 font-bold uppercase">Gastado</p>
                                <p className="text-2xl font-bold text-[#1B3530]">${selectedClient.totalSpent}</p>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Teléfono</p>
                                <p className="font-bold text-[#112320]">{selectedClient.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Última Visita</p>
                                <p className="font-bold text-[#112320]">{new Date(selectedClient.lastBooking).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button className="w-full" onClick={() => { openBookClient(selectedClient); }}>Nueva Reserva</Button>
                        </div>
                    </div>
                )}
            </SideSheet>
            
            <SideSheet isOpen={activeSheet === 'PRODUCT'} onClose={closeSheet} title={selectedProduct ? "Editar Producto" : "Nuevo Producto"}>
                 <form className="space-y-6" onSubmit={handleSaveProduct}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 w-full">
                            <Input name="code" label="Código" placeholder="ABC-001" defaultValue={selectedProduct?.code} />
                        </div>
                        <div className="space-y-1.5 w-full">
                             <Input name="name" label="Nombre del Producto" placeholder="Ej. Gatorade" defaultValue={selectedProduct?.name} required />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="purchasePrice" type="number" label="Precio Costo" icon={DollarSign} defaultValue={selectedProduct?.purchasePrice} required />
                        <Input name="salePrice" type="number" label="Precio Venta" icon={DollarSign} defaultValue={selectedProduct?.salePrice} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select name="type" label="Categoría" defaultValue={selectedProduct?.type || 'Bebidas'}>
                            <option value="Bebidas">Bebidas</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Equipamiento">Equipamiento</option>
                            <option value="Indumentaria">Indumentaria</option>
                            <option value="Venta">Venta</option>
                        </Select>
                        <Input name="stock" type="number" label="Stock Inicial" defaultValue={selectedProduct?.stock} required />
                    </div>

                    <div className="pt-6 flex gap-3">
                       <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                       <Button type="submit" className="flex-1">Guardar Producto</Button>
                   </div>
                </form>
            </SideSheet>

            <SideSheet isOpen={activeSheet === 'REPLY_REVIEW'} onClose={closeSheet} title="Responder Reseña">
                <form className="space-y-6" onSubmit={handleSaveReply}>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Comentario del Cliente:</p>
                        <p className="text-sm text-gray-700 italic">"{reviews.find(r => r.id === reviewActionId)?.comment}"</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-base font-medium text-[#112320]">Tu Respuesta</label>
                        <textarea 
                            name="replyText"
                            className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-base focus:border-[#1B3530] focus:outline-none focus:ring-1 focus:ring-[#1B3530] transition-all resize-none h-32"
                            placeholder="Escribe una respuesta amable..."
                            required
                        ></textarea>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                        <Button type="submit" className="flex-1">Enviar Respuesta</Button>
                    </div>
                </form>
            </SideSheet>

            <SideSheet isOpen={activeSheet === 'REPORT_REVIEW'} onClose={closeSheet} title="Reportar Reseña">
                <form className="space-y-6" onSubmit={handleSaveReport}>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Comentario a Reportar:</p>
                        <p className="text-sm text-gray-700 italic">"{reviews.find(r => r.id === reviewActionId)?.comment}"</p>
                    </div>
                    <div className="space-y-2">
                        <RadioGroup 
                            label="Motivo del Reporte"
                            name="reportReason"
                            options={[
                                { label: 'Contenido Ofensivo', value: 'OFFENSIVE' },
                                { label: 'Es Spam', value: 'SPAM' },
                                { label: 'Reseña Falsa', value: 'FAKE' },
                                { label: 'Otro', value: 'OTHER' }
                            ]}
                            defaultValue="OFFENSIVE"
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                        <Button type="submit" variant="destructive" className="flex-1">Reportar Comentario</Button>
                    </div>
                </form>
            </SideSheet>

            <Modal isOpen={activeSheet === 'EXPORT_OPTIONS'} onClose={closeSheet} title="Exportar Reporte">
                 <div className="space-y-4">
                     <p className="text-gray-600 mb-4">Selecciona el formato de exportación:</p>
                     <div className="grid grid-cols-1 gap-3">
                        <button 
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#1B3530] hover:bg-[#F8F8F8] transition-all group"
                            onClick={() => handleExport('EXCEL')}
                        >
                            <span className="font-bold text-[#112320]">Excel (.xlsx)</span>
                            <FileSpreadsheet className="text-green-600" />
                        </button>
                        <button 
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#1B3530] hover:bg-[#F8F8F8] transition-all group"
                            onClick={() => handleExport('CSV')}
                        >
                            <span className="font-bold text-[#112320]">CSV (.csv)</span>
                            <FileText className="text-blue-600" />
                        </button>
                        <button 
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#1B3530] hover:bg-[#F8F8F8] transition-all group"
                            onClick={() => handleExport('PDF')}
                        >
                            <span className="font-bold text-[#112320]">PDF (.pdf)</span>
                            <FileType className="text-red-600" />
                        </button>
                     </div>
                 </div>
            </Modal>
            
            <Modal isOpen={activeSheet === 'IMPORT_INVENTORY'} onClose={closeSheet} title="Importar Inventario">
                <div className="space-y-4">
                    <p className="text-gray-600">Sube un archivo CSV con la lista de productos para importar masivamente.</p>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload size={32} className="text-gray-400 mb-2"/>
                        <p className="text-sm font-medium text-gray-600">Click para seleccionar archivo</p>
                        <input type="file" accept=".csv" className="opacity-0 absolute inset-0 cursor-pointer" onChange={() => { setActiveSheet(null); showFeedback("Inventario importado"); }} />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={activeSheet === 'DELETE_USER_CONFIRMATION'} onClose={closeSheet} title="Eliminar Usuario">
                <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button variant="destructive" onClick={confirmDeleteUser}>Eliminar</Button>
                </div>
            </Modal>

            <Modal isOpen={activeSheet === 'DELETE_RESERVATION_CONFIRMATION'} onClose={closeSheet} title="Cancelar Reserva">
                <div className="space-y-4 mb-6">
                    <p className="text-gray-600">Por favor indica el motivo de la cancelación:</p>
                     <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="cancelReason" value="CLIENT_CANCEL" checked={cancellationReason === 'CLIENT_CANCEL'} onChange={() => setCancellationReason('CLIENT_CANCEL')} className="accent-[#1B3530]"/>
                             <span>Cancelado por el cliente</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="cancelReason" value="WEATHER" checked={cancellationReason === 'WEATHER'} onChange={() => setCancellationReason('WEATHER')} className="accent-[#1B3530]"/>
                             <span>Condiciones climáticas</span>
                        </label>
                         <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="cancelReason" value="MAINTENANCE" checked={cancellationReason === 'MAINTENANCE'} onChange={() => setCancellationReason('MAINTENANCE')} className="accent-[#1B3530]"/>
                             <span>Mantenimiento de cancha</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="cancelReason" value="OTHER" checked={cancellationReason === 'OTHER'} onChange={() => setCancellationReason('OTHER')} className="accent-[#1B3530]"/>
                             <span>Otro motivo</span>
                        </label>
                     </div>
                     {cancellationReason === 'OTHER' && (
                         <textarea 
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#1B3530]"
                            placeholder="Especificar motivo..."
                            value={cancellationOtherText}
                            onChange={(e) => setCancellationOtherText(e.target.value)}
                         ></textarea>
                     )}
                </div>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeSheet}>Volver</Button>
                    <Button variant="destructive" onClick={confirmDeleteReservation}>Confirmar Cancelación</Button>
                </div>
            </Modal>

            <Modal isOpen={activeSheet === 'LOGOUT_CONFIRMATION'} onClose={closeSheet} title="Cerrar Sesión">
                <p className="text-gray-600 mb-6">¿Estás seguro que deseas salir de la aplicación?</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button variant="destructive" onClick={confirmLogout}>Cerrar Sesión</Button>
                </div>
            </Modal>

          </div>
        ) : <Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;