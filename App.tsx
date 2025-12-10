
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, NavLink, Link, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Button, Card, Input, Badge, SideSheet, Select, MultiSelect, RadioGroup, Checkbox, Modal, AutocompleteInput, Textarea, Snackbar } from './components/UI';
import { MOCK_COURTS, MOCK_RESERVATIONS, TIME_SLOTS, MOCK_USERS, MOCK_INVENTORY, MOCK_CLIENTS, SPORTS_LIST, SURFACE_LIST, RESERVATION_META } from './constants';
import { Court, Reservation, ReservationStatus, User, Product, CourtType, SurfaceType, ForceStartOption, Client } from './types';
import { Search, Bell, Plus, Filter, MoreHorizontal, DollarSign, MapPin, Edit2, Trash2, Check, Package, Calendar, LayoutGrid, List, Lock, Ban, ChevronRight, Zap, CloudRain, Image as ImageIcon, Link2, Clock, Map as MapIcon, Phone, Power, RefreshCw, TrendingUp, Users as UsersIcon, Clock as ClockIcon, Activity, User as UserIcon, Mail, Shield, Key, FileText, Sheet, FileSpreadsheet, ChevronLeft, Eye, CalendarPlus, Upload, ChevronDown, Star, MessageSquare, Flag, Download, FileType, AlertTriangle, CornerDownRight, LogIn, LogOut, CreditCard, ArrowUpDown, ArrowUp, ArrowDown, FolderOpen, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';

// --- Shared Components ---

const EmptyState = ({ title, description, actionLabel, onAction, icon: Icon }: { title: string, description: string, actionLabel?: string, onAction?: () => void, icon?: any }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 animate-in fade-in zoom-in-95 duration-300">
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
       {Icon ? <Icon size={40} className="text-gray-300" /> : <FolderOpen size={40} className="text-gray-300" />}
    </div>
    <h3 className="text-xl font-bold text-[#112320] mb-2">{title}</h3>
    <p className="text-gray-500 max-w-sm mb-8">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction}>
        <Plus className="w-4 h-4 mr-2" />
        {actionLabel}
      </Button>
    )}
  </div>
);

// --- Auth Components ---

const LoginPage = ({ onLogin, usersDb }: { onLogin: (user: any) => void, usersDb: User[] }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API network delay
    setTimeout(() => {
        const foundUser = usersDb.find(u => u.email === email && u.password === password && u.status === 'ACTIVE');
        
        if (foundUser) {
            onLogin({
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                full_name: foundUser.name
            });
        } else {
            setError('Credenciales incorrectas. Verifique email y contraseña.');
            setLoading(false);
        }
    }, 800);
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

        <div className="mt-8 text-center bg-blue-50 p-4 rounded-xl">
           <p className="text-xs text-gray-500 mb-1">Cuentas de prueba:</p>
           <p className="text-xs text-[#1B3530] font-mono">dueno@club.com / 123</p>
           <p className="text-xs text-[#1B3530] font-mono">encargado@club.com / 123</p>
           <p className="text-xs text-[#1B3530] font-mono">empleado@club.com / 123</p>
        </div>
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

  const isClosed = (timeString: string) => {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      
      const daySchedule = schedule.find(s => s.day === dayNameCapitalized);
      
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
     
     // Use defined constants or default
     if (type && RESERVATION_META[type]) {
         return RESERVATION_META[type].twColor;
     }
     return 'bg-[#1B3530] text-[#C7F269] hover:bg-[#112320]'; // Default fallback
  };

  // List view state
  const filteredReservationsList = viewMode === 'CALENDAR' 
      ? reservations.filter(r => r.startTime.startsWith(selectedDate) && r.status !== ReservationStatus.CANCELLED)
      : [...reservations].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  
  const totalPages = Math.ceil(filteredReservationsList.length / itemsPerPage);
  const paginatedReservations = filteredReservationsList.slice((listPage - 1) * itemsPerPage, listPage * itemsPerPage);

  // If we have no courts, we likely have no reservations setup, show empty state for calendar too but primarily list
  if (courts.length === 0 && viewMode === 'CALENDAR') {
      return (
        <div className="p-8 h-full">
            <EmptyState 
                title="No hay canchas configuradas" 
                description="Para comenzar a gestionar reservas, primero debes agregar canchas en la sección 'Canchas'." 
                icon={Calendar}
            />
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
                <Button onClick={() => onAddReservation(selectedDate)}>
                    <Plus className="w-4 h-4 mr-2" /> Nueva Reserva
                </Button>
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
                            <div className="absolute left-1 bg-red-500 text-white text-[10px] px-1 rounded font-bold -translate-y-1/2">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
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
                                    className={`w-full h-full rounded-xl p-3 text-xs flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ${getReservationColor((res as any).type, res.status)}`}
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
              {filteredReservationsList.length > 0 ? (
                  <>
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
                                {paginatedReservations.map(res => {
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
                                                    <Badge color="gray">{(res as any).type || 'Normal'}</Badge>
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
                                    })}
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
                  </>
              ) : (
                  <EmptyState 
                    title="No hay reservas aún" 
                    description="El historial de reservas está vacío. Crea tu primera reserva desde el calendario."
                    onAction={() => { setViewMode('CALENDAR'); onAddReservation(selectedDate); }}
                    actionLabel="Crear Reserva"
                    icon={Calendar}
                  />
              )}
          </Card>
      )}
    </div>
  );
};

// ... other components ...
const CourtsPage = ({ 
  courts, 
  onAddCourt, 
  onEditCourt,
  onDeleteCourt
}: { 
  courts: Court[], 
  onAddCourt: () => void, 
  onEditCourt: (c: Court) => void,
  onDeleteCourt: (id: string) => void
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

  if (courts.length === 0) {
      return (
        <div className="p-8 h-full">
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-3xl font-bold text-[#112320]">Canchas</h1>
            </div>
            <EmptyState 
                title="Aún no tienes canchas" 
                description="Agrega tus canchas (fútbol, tenis, pádel, etc.) para comenzar a recibir reservas." 
                actionLabel="Agregar Primera Cancha" 
                onAction={onAddCourt}
                icon={Trophy}
            />
        </div>
      );
  }

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
            {sortedCourts.map(court => (
            <tr key={court.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-[#112320]">{court.name}</td>
                <td className="px-6 py-4 text-base text-gray-500 font-medium">{court.types.join(', ')}</td>
                <td className="px-6 py-4 text-base text-gray-500 font-medium">{court.surface}</td>
                <td className="px-6 py-4 text-base text-gray-500 font-medium">
                    {court.isIndoor && <span className="mr-2">Techada</span>}
                    {court.hasLighting && <span>Iluminación</span>}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" className="px-0 w-9 h-9 rounded-full flex items-center justify-center" onClick={() => onEditCourt(court)}><Edit2 size={16}/></Button>
                        <Button variant="destructive" className="px-0 w-9 h-9 rounded-full flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-100" onClick={() => onDeleteCourt(court.id)}><Trash2 size={16}/></Button>
                    </div>
                </td>
            </tr>
            ))}
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
            {users.map(user => (
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
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const ClientsPage = ({ 
  clients, 
  onAddClient, 
  onEditClient,
  onViewClient,
  onBookClient,
  onDeleteClient
}: { 
  clients: Client[], 
  onAddClient: () => void, 
  onEditClient: (client: Client) => void,
  onViewClient: (client: Client) => void,
  onBookClient: (client: Client) => void,
  onDeleteClient: (id: string) => void
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (clients.length === 0) {
        return (
          <div className="p-8 h-full">
               <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-[#112320]">Clientes</h1>
               </div>
              <EmptyState 
                  title="No hay clientes registrados" 
                  description="Comienza a registrar a tus clientes para llevar un seguimiento de sus reservas y pagos." 
                  actionLabel="Agregar Primer Cliente" 
                  onAction={onAddClient}
                  icon={UsersIcon}
              />
          </div>
        );
    }

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
                {filteredClients.map(client => (
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
                         <button className="p-2 flex items-center justify-center border border-gray-200 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100" onClick={() => onEditClient(client)}><Edit2 size={16}/></button>
                         <button className="p-2 flex items-center justify-center border border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full" onClick={() => onDeleteClient(client.id)}><Trash2 size={16}/></button>
                         <Button className="px-4 h-9 text-xs rounded-full" onClick={() => onBookClient(client)}>Reservar</Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      );
};

const InventoryPage = ({ inventory, onAddProduct, onEditProduct, onDeleteProduct, onImport }: { inventory: Product[], onAddProduct: () => void, onEditProduct: (p: Product) => void, onDeleteProduct: (id: string) => void, onImport: () => void }) => {
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

  if (inventory.length === 0) {
      return (
        <div className="p-8 h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#112320]">Inventario</h1>
            </div>
            <EmptyState 
                title="Inventario vacío" 
                description="Agrega productos para vender o alquilar (bebidas, snacks, equipamiento) y controla tu stock." 
                actionLabel="Agregar Primer Producto" 
                onAction={onAddProduct}
                icon={Package}
            />
        </div>
      );
  }

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
            {filteredInventory.map(item => (
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
                     <button 
                       className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                       onClick={() => onDeleteProduct(item.id)}
                     >
                        <Trash2 size={18}/>
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ... ReportsPage, MyClub, UserProfile ... 

const ReportsPage = ({ onExport, reservations }: { onExport: () => void, reservations: Reservation[] }) => {
  const [dateRange, setDateRange] = useState('7_DAYS');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Determine filter date
  const getStartDate = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (dateRange === '7_DAYS') {
        const d = new Date(today);
        d.setDate(d.getDate() - 7);
        return d;
    }
    if (dateRange === '30_DAYS') {
        const d = new Date(today);
        d.setDate(d.getDate() - 30);
        return d;
    }
    if (dateRange === '60_DAYS') {
        const d = new Date(today);
        d.setDate(d.getDate() - 60);
        return d;
    }
    if (dateRange === 'CUSTOM' && customStart) {
        return new Date(customStart);
    }
    return new Date(0); // All time if fallback
  };

  const startDate = getStartDate();
  const endDate = dateRange === 'CUSTOM' && customEnd ? new Date(customEnd) : new Date();
  if (dateRange === 'CUSTOM' && customEnd) endDate.setHours(23,59,59,999);

  // Filter reservations
  const filteredReservations = reservations.filter(r => {
      if (r.status === ReservationStatus.CANCELLED) return false;
      const rDate = new Date(r.startTime);
      return rDate >= startDate && rDate <= endDate;
  });

  // Calculate Metrics
  const totalRevenue = filteredReservations.reduce((sum, r) => sum + r.price, 0);
  const totalBookings = filteredReservations.length;
  const avgSession = 60; // Mocked for now, or calculate from duration
  const utilization = 0; // Requires court hours capacity logic

  // Revenue Over Time Data
  const revenueByDayMap = new Map<string, number>();
  filteredReservations.forEach(r => {
      const day = new Date(r.startTime).toLocaleDateString('es-ES', { weekday: 'short' });
      const current = revenueByDayMap.get(day) || 0;
      revenueByDayMap.set(day, current + r.price);
  });
  
  const revenueData = Array.from(revenueByDayMap.entries()).map(([name, value]) => ({ name, value }));

  // Customer Segments Data (by Type)
  const segmentsMap = new Map<string, number>();
  filteredReservations.forEach(r => {
      const type = r.type || 'Normal';
      segmentsMap.set(type, (segmentsMap.get(type) || 0) + 1);
  });
  const customerSegments = Array.from(segmentsMap.entries()).map(([name, value]) => ({ name, value }));

  // Colors for Segments
  const getSegmentColor = (type: string) => {
      if (RESERVATION_META[type]) return RESERVATION_META[type].color;
      return '#E5E7EB';
  };

  // Hourly Distribution
  const hourlyMap = new Array(24).fill(0);
  filteredReservations.forEach(r => {
      const hour = new Date(r.startTime).getHours();
      hourlyMap[hour]++;
  });
  const hourlyData = hourlyMap.map((val, h) => ({ hour: `${h}:00`, value: val })).filter(d => d.value > 0);

  // Weekday Distribution
  const weekdayMap = new Map<string, number>();
  filteredReservations.forEach(r => {
       const day = new Date(r.startTime).toLocaleDateString('es-ES', { weekday: 'short' });
       weekdayMap.set(day, (weekdayMap.get(day) || 0) + 1);
  });
  const bookingsByWeekday = Array.from(weekdayMap.entries()).map(([name, value]) => ({ name, value }));

  const dateLabel = dateRange === 'CUSTOM' 
    ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    : startDate.toLocaleDateString() + ' - Hoy';

  return (
    <div className="p-8 space-y-8 pb-20 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-[#112320]">Reportes</h1>
           <p className="text-sm text-gray-500 mt-1">Viendo datos del periodo: <span className="font-semibold text-[#1B3530]">{dateLabel}</span></p>
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
          <Card className="p-6 relative overflow-hidden group bg-white border border-gray-100 shadow-sm">
             <div className="flex items-start justify-between">
                <div>
                     <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Total Revenue</p>
                     <h3 className="text-3xl font-bold text-[#112320] tracking-tight">${totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-3 rounded-2xl bg-green-100 text-green-700"><DollarSign size={24}/></div>
             </div>
          </Card>
          <Card className="p-6 relative overflow-hidden group bg-white border border-gray-100 shadow-sm">
             <div className="flex items-start justify-between">
                <div>
                     <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Total Bookings</p>
                     <h3 className="text-3xl font-bold text-[#112320] tracking-tight">{totalBookings}</h3>
                </div>
                <div className="p-3 rounded-2xl bg-blue-100 text-blue-700"><Calendar size={24}/></div>
             </div>
          </Card>
          <Card className="p-6 relative overflow-hidden group bg-white border border-gray-100 shadow-sm">
             <div className="flex items-start justify-between">
                <div>
                     <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Avg. Session</p>
                     <h3 className="text-3xl font-bold text-[#112320] tracking-tight">{avgSession}m</h3>
                </div>
                <div className="p-3 rounded-2xl bg-orange-100 text-orange-700"><ClockIcon size={24}/></div>
             </div>
          </Card>
          <Card className="p-6 relative overflow-hidden group bg-white border border-gray-100 shadow-sm">
             <div className="flex items-start justify-between">
                <div>
                     <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Utilization</p>
                     <h3 className="text-3xl font-bold text-[#112320] tracking-tight">--</h3>
                </div>
                <div className="p-3 rounded-2xl bg-purple-100 text-purple-700"><Activity size={24}/></div>
             </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 flex flex-col">
              <h3 className="text-lg font-bold text-[#112320] mb-6">Revenue Overview</h3>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="value" stroke="#1B3530" strokeWidth={3} dot={{r: 4, fill: "#1B3530"}} activeDot={{ r: 8 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
          </Card>

          <Card className="p-6 flex flex-col">
              <h3 className="text-lg font-bold text-[#112320] mb-6">Customer Segments</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSegmentColor(entry.name)} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
              </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 flex flex-col">
              <h3 className="text-lg font-bold text-[#112320] mb-6">Hourly Distribution</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#C7F269" radius={[4, 4, 4, 4]} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </Card>
           <Card className="p-6 flex flex-col">
              <h3 className="text-lg font-bold text-[#112320] mb-6">Bookings by Weekday</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingsByWeekday}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#1B3530" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </Card>
      </div>
      
    </div>
  );
}

interface MyClubProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
  reviews: any[];
  clubConfig: any;
  onUpdateClub: (data: any) => void;
  onReplyReview: (id: number) => void;
  onReportReview: (id: number) => void;
}

const MyClubPage = ({ users, onAddUser, onEditUser, onDeleteUser, reviews, clubConfig, onUpdateClub, onReplyReview, onReportReview }: MyClubProps) => {
    // ... MyClub Logic (Hidden for brevity, assumes unchanged) ...
    // NOTE: This part is kept as is in the actual file, just abbreviated here for context
    const [activeTab, setActiveTab] = useState('DATOS');
  
    // Initialize local state with props, but allow editing
    const [basicInfo, setBasicInfo] = useState({ name: 'Club Central', phone: '', address: '', coords: '', status: 'ACTIVE', welcomeMessage: '' });
    const [schedule, setSchedule] = useState<any[]>([]);
    const [services, setServices] = useState<string[]>([]);
    
    // Review Filters
    const [dateFilter, setDateFilter] = useState('ALL');
    const [starFilter, setStarFilter] = useState<number | 'ALL'>('ALL');
    const [customDateStart, setCustomDateStart] = useState('');
    const [customDateEnd, setCustomDateEnd] = useState('');
  
    useEffect(() => {
        if (clubConfig) {
            setBasicInfo({
                name: clubConfig.name || '',
                phone: clubConfig.phone || '',
                address: clubConfig.address || '',
                coords: clubConfig.coords || '',
                status: clubConfig.status || 'ACTIVE',
                welcomeMessage: clubConfig.welcomeMessage || ''
            });
            setSchedule(clubConfig.schedule || []);
            setServices(clubConfig.services || []);
        }
    }, [clubConfig]);
  
    const toggleService = (service: string) => {
      let newServices;
      if (services.includes(service)) {
          newServices = services.filter(s => s !== service);
      } else {
          newServices = [...services, service];
      }
      setServices(newServices);
    };
  
    const handleUpdateServices = () => {
        onUpdateClub({ services });
    };
  
    const handleScheduleChange = (dayIndex: number, field: string, value: any) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex] = { ...newSchedule[dayIndex], [field]: value };
        setSchedule(newSchedule);
    };
  
    const handleUpdateSchedule = () => {
        onUpdateClub({ schedule });
    };
  
    const handleUpdateBasicInfo = () => {
        onUpdateClub(basicInfo);
    };
    
    const handleUpdateAppearance = () => {
      onUpdateClub({ welcomeMessage: basicInfo.welcomeMessage });
    }
    
    const TABS = [
      { id: 'DATOS', label: 'Datos Básicos', icon: MapIcon },
      { id: 'HORARIOS', label: 'Horarios', icon: Clock },
      { id: 'SERVICIOS', label: 'Servicios', icon: Check },
      { id: 'INTEGRACIONES', label: 'Integraciones', icon: Link2 },
      { id: 'APARIENCIA', label: 'Apariencia', icon: ImageIcon },
      { id: 'USUARIOS', label: 'Usuarios', icon: UsersIcon },
      { id: 'RESEÑAS', label: 'Reseñas', icon: MessageSquare },
    ];
  
    // Filter Reviews Logic
    const filteredReviews = reviews.filter(review => {
      const reviewDate = new Date(review.date);
      const today = new Date();
      
      // Date Filtering
      if (dateFilter === '7_DAYS') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          if (reviewDate < sevenDaysAgo) return false;
      } else if (dateFilter === '30_DAYS') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          if (reviewDate < thirtyDaysAgo) return false;
      } else if (dateFilter === 'CUSTOM' && customDateStart && customDateEnd) {
          const start = new Date(customDateStart);
          const end = new Date(customDateEnd);
          end.setHours(23, 59, 59, 999);
          if (reviewDate < start || reviewDate > end) return false;
      }
  
      // Star Filtering
      if (starFilter !== 'ALL' && review.rating !== Number(starFilter)) return false;
  
      return true;
    });
  
    // Calculate review stats based on filtered reviews
    const totalReviews = filteredReviews.length;
    const averageRating = totalReviews > 0 ? (filteredReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as any;
    filteredReviews.forEach(r => distribution[r.rating] = (distribution[r.rating] || 0) + 1);
  
    return (
      <div className="p-8 space-y-4 w-full pb-20 h-full overflow-y-auto">
        <div className="pb-2">
          <h1 className="text-3xl font-bold text-[#112320]">Mi Club</h1>
        </div>
  
        <div className="flex gap-2 p-1 bg-gray-100 rounded-full w-fit max-w-full overflow-x-auto no-scrollbar border border-gray-200">
          {TABS.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium ${
                          isActive 
                          ? 'bg-white text-[#1B3530] font-bold shadow-sm' 
                          : 'text-gray-500 hover:text-[#112320]'
                      }`}
                  >
                      <TabIcon size={16} />
                      {tab.label}
                  </button>
              )
          })}
        </div>
  
        <div className="py-4 w-full">
          <div className="w-full max-w-4xl mx-auto md:mx-0">
              {activeTab === 'DATOS' && (
                <Card className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input name="name" label="Nombre del Complejo" placeholder="Ej. Club Central" value={basicInfo.name} onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})} />
                    <Input name="phone" label="Teléfono" placeholder="+54 9 11..." icon={Phone} value={basicInfo.phone} onChange={(e) => setBasicInfo({...basicInfo, phone: e.target.value})} />
                    <Input name="address" label="Dirección" placeholder="Calle, Número, Ciudad" className="md:col-span-2" value={basicInfo.address} onChange={(e) => setBasicInfo({...basicInfo, address: e.target.value})} />
                    <Input name="coords" label="Coordenadas" placeholder="Lat, Long" icon={MapPin} value={basicInfo.coords} onChange={(e) => setBasicInfo({...basicInfo, coords: e.target.value})} />
                    <Select name="status" label="Estado del Complejo" value={basicInfo.status} onChange={(e) => setBasicInfo({...basicInfo, status: e.target.value})}>
                      <option value="ACTIVE">Activo</option>
                      <option value="INACTIVE">Inactivo</option>
                    </Select>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-100"><Button onClick={handleUpdateBasicInfo}>Guardar Cambios</Button></div>
                </Card>
              )}
  
              {activeTab === 'USUARIOS' && (
                  <UsersPage users={users} onAddUser={onAddUser} onEditUser={onEditUser} onDeleteUser={onDeleteUser} />
              )}
  
              {activeTab === 'RESEÑAS' && (
                  <div className="space-y-6 animate-in fade-in duration-300 w-full">
                       {/* Review content stays same */}
                       <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="text-gray-400" size={20} />
                            <h3 className="text-lg font-bold text-[#112320]">Opiniones de Clientes</h3>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-2">
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Filter size={18} />
                            <span>Filtrar por:</span>
                        </div>
                        
                        <div className="w-56">
                          <div className="space-y-1.5 w-full">
                            <div className="relative">
                                <select 
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-[#1B3530] focus:outline-none focus:ring-1 focus:ring-[#1B3530] transition-all appearance-none"
                                value={dateFilter} 
                                onChange={(e) => setDateFilter(e.target.value)}
                                >
                                  <option value="ALL">Todo el historial</option>
                                  <option value="7_DAYS">Últimos 7 días</option>
                                  <option value="30_DAYS">Últimos 30 días</option>
                                  <option value="CUSTOM">Seleccionar fecha</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                          </div>
                        </div>

                        {dateFilter === 'CUSTOM' && (
                            <div className="flex items-center gap-2 animate-in fade-in">
                                <input type="date" className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1B3530] bg-white" value={customDateStart} onChange={(e) => setCustomDateStart(e.target.value)} />
                                <span className="text-gray-400">-</span>
                                <input type="date" className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1B3530] bg-white" value={customDateEnd} onChange={(e) => setCustomDateEnd(e.target.value)} />
                            </div>
                        )}

                        <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block"></div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500 hidden sm:block">Calificación:</span>
                            <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                                {[5, 4, 3, 2, 1].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setStarFilter(starFilter === star ? 'ALL' : star)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all flex items-center gap-1 whitespace-nowrap ${starFilter === star ? 'bg-[#1B3530] text-[#C7F269] border-[#1B3530]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {star} <Star size={12} fill="currentColor" strokeWidth={0} />
                                    </button>
                                ))}
                            </div>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="flex items-center justify-between p-6 col-span-1 bg-[#F8F8F8] border-none">
                            <div>
                               <p className="text-5xl font-bold text-[#1B3530] mb-2">{averageRating}</p>
                               <div className="flex text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} strokeWidth={i < Math.round(Number(averageRating)) ? 0 : 2} className={i >= Math.round(Number(averageRating)) ? "text-gray-300" : ""} />
                                    ))}
                               </div>
                               <p className="text-sm font-medium text-gray-500">{totalReviews} reseñas filtradas</p>
                            </div>
                        </Card>
                        <Card className="col-span-2 p-6 bg-white border-gray-100">
                            <div className="flex flex-col justify-center h-full gap-2">
                                {[5, 4, 3, 2, 1].map(star => (
                                    <div key={star} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 w-12 text-sm font-medium text-gray-500">
                                            <span>{star}</span> <Star size={12} className="text-gray-400" fill="currentColor" strokeWidth={0}/>
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#C7F269] rounded-full" 
                                                style={{ width: `${totalReviews > 0 ? (distribution[star] / totalReviews) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-8 text-right text-xs text-gray-400">{distribution[star]}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                     </div>

                     <Card className="p-0 overflow-hidden w-full">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8F8F8] border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Calificación</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider w-1/3">Comentario</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-base text-gray-500 font-medium whitespace-nowrap align-top">{new Date(review.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-base font-bold text-[#112320] whitespace-nowrap align-top">{review.author}</td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} className={i >= review.rating ? "text-gray-300" : ""} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <p className="text-base text-gray-600 mb-2">{review.comment}</p>
                                                
                                                {review.isReported && (
                                                    <div className="mt-2 flex flex-col items-start gap-1">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                                            <AlertTriangle size={12} className="mr-1"/> Reportado
                                                        </span>
                                                        {review.reportReason && (
                                                            <span className="text-xs text-gray-500">
                                                                Motivo: {
                                                                    review.reportReason === 'OFFENSIVE' ? 'Ofensivo' :
                                                                    review.reportReason === 'SPAM' ? 'Spam' :
                                                                    review.reportReason === 'FAKE' ? 'Falso' : 'Otro'
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {review.reply && !review.isReported && (
                                                    <div className="mt-3 pl-3 border-l-2 border-gray-200">
                                                        <p className="text-xs font-bold text-[#112320] mb-1">Tu respuesta:</p>
                                                        <p className="text-sm text-gray-500 italic">"{review.reply}"</p>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap align-top">
                                                <div className="flex justify-end gap-2">
                                                    {!review.reply && !review.isReported && (
                                                        <Button variant="secondary" className="px-3 h-8 text-xs rounded-full" onClick={() => onReplyReview(review.id)}>Responder</Button>
                                                    )}
                                                    {!review.isReported && (
                                                        <Button variant="destructive" className="px-3 h-8 text-xs rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" onClick={() => onReportReview(review.id)}>
                                                            <Flag size={14} className="mr-1"/> Reportar
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No se encontraron reseñas con los filtros seleccionados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </Card>
                  </div>
              )}
              
              {/* ... other tabs ... */}
               {activeTab === 'HORARIOS' && (
                 <Card className="animate-in fade-in duration-300 space-y-6">
                   <div className="flex justify-between items-center mb-4">
                       <div>
                          <h3 className="text-lg font-bold text-[#112320]">Configuración de Horarios</h3>
                          <p className="text-gray-500 text-sm">Define los horarios de apertura y cierre.</p>
                       </div>
                   </div>
                   <div className="space-y-4">
                      {schedule.map((day, idx) => (
                          <div key={day.day} className="flex items-center gap-4 p-3 bg-[#F8F8F8] rounded-2xl">
                              <div className="w-24 font-bold text-[#112320]">{day.day}</div>
                              <div className="flex-1 flex items-center gap-4">
                                  <Checkbox 
                                      label="Abierto" 
                                      checked={day.open} 
                                      onChange={(e) => handleScheduleChange(idx, 'open', e.target.checked)} 
                                  />
                                  {day.open && (
                                      <div className="flex items-center gap-2">
                                          <input 
                                              type="time" 
                                              className="rounded-xl border-gray-200 p-2 text-sm bg-white" 
                                              value={day.start} 
                                              onChange={(e) => handleScheduleChange(idx, 'start', e.target.value)}
                                          />
                                          <span className="text-gray-400">-</span>
                                          <input 
                                              type="time" 
                                              className="rounded-xl border-gray-200 p-2 text-sm bg-white" 
                                              value={day.end}
                                              onChange={(e) => handleScheduleChange(idx, 'end', e.target.value)}
                                          />
                                      </div>
                                  )}
                                  {!day.open && <span className="text-sm text-gray-400 italic">Cerrado</span>}
                              </div>
                          </div>
                      ))}
                   </div>
                   <div className="flex justify-end pt-4 border-t border-gray-100"><Button onClick={handleUpdateSchedule}>Guardar Horarios</Button></div>
                 </Card>
              )}
  
              {activeTab === 'SERVICIOS' && (
                 <Card className="animate-in fade-in duration-300">
                   <h3 className="text-lg font-bold mb-6 text-[#112320]">Servicios del Club</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                          'Wi-Fi', 'Vestuario', 'Gimnasio', 'Estacionamiento', 'Ayuda Médica', 
                          'Torneos', 'Cumpleaños', 'Parrilla', 'Escuelita deportiva', 'Colegios', 
                          'Bar / Restaurante', 'Quincho'
                      ].map(s => {
                          const isChecked = services.includes(s);
                          return (
                              <div 
                                  key={s} 
                                  className={`flex items-center justify-between p-4 border rounded-2xl transition-all cursor-pointer ${isChecked ? 'border-[#1B3530] bg-[#C7F269]/10' : 'border-gray-100 bg-[#F8F8F8]/50 hover:border-gray-300'}`}
                                  onClick={() => toggleService(s)}
                              >
                                  <span className="font-medium text-[#112320]">{s}</span>
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isChecked ? 'bg-[#1B3530] border-[#1B3530]' : 'border-gray-300 bg-white'}`}>
                                      {isChecked && <Check size={14} className="text-[#C7F269]" />}
                                  </div>
                              </div>
                          )
                      })}
                   </div>
                   <div className="flex justify-end pt-6 border-t border-gray-100 mt-6"><Button onClick={handleUpdateServices}>Actualizar Servicios</Button></div>
                 </Card>
              )}
  
              {activeTab === 'INTEGRACIONES' && (
                 <Card className="animate-in fade-in duration-300 space-y-6">
                   <h3 className="text-lg font-bold mb-4 text-[#112320]">Integraciones</h3>
                   
                   <div className="space-y-4">
                       <div className="p-6 border border-gray-200 rounded-3xl flex items-center justify-between hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">MP</div>
                              <div>
                                  <h4 className="font-bold text-[#112320] text-lg">Mercado Pago</h4>
                                  <p className="text-sm text-gray-500">Procesa pagos online para señas y reservas.</p>
                              </div>
                          </div>
                          <Button variant="secondary" className="rounded-full">Conectar</Button>
                       </div>
  
                       <div className="p-6 border border-gray-200 rounded-3xl flex items-center justify-between hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-8 h-8" alt="Google Calendar" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-[#112320] text-lg">Google Calendar</h4>
                                  <p className="text-sm text-gray-500">Sincroniza tus reservas con tu calendario personal.</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><Check size={10}/> Conectado</span>
                               <Button variant="ghost" className="text-gray-400">Desconectar</Button>
                          </div>
                       </div>
                   </div>
                 </Card>
              )}
  
              {activeTab === 'APARIENCIA' && (
                 <Card className="animate-in fade-in duration-300 space-y-8">
                   <h3 className="text-lg font-bold mb-4 text-[#112320]">Personalización Visual</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                          <label className="text-base font-medium text-[#112320] block">Logo del Club</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#F8F8F8] transition-colors cursor-pointer group h-48">
                               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <ImageIcon className="text-gray-400" size={32} />
                               </div>
                               <p className="text-sm font-bold text-[#1B3530]">Subir Logo</p>
                               <p className="text-xs text-gray-400">PNG, JPG (Max 2MB)</p>
                               <p className="text-[10px] text-gray-400">Recomendado: 500x500px</p>
                          </div>
                      </div>
  
                      <div className="space-y-4">
                          <label className="text-base font-medium text-[#112320] block">Imagen de Portada</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#F8F8F8] transition-colors cursor-pointer group h-48">
                               <div className="w-full h-20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-gray-300">
                                  <ImageIcon size={48} />
                               </div>
                               <p className="text-sm font-bold text-[#1B3530]">Subir Portada</p>
                               <p className="text-xs text-gray-400">Max 5MB</p>
                               <p className="text-[10px] text-gray-400">Recomendado: 1920x1080px</p>
                          </div>
                      </div>
                   </div>
  
                   <div className="pt-4">
                       <Input 
                          label="Mensaje de Bienvenida" 
                          placeholder="¡Bienvenidos a Club Central!" 
                          value={basicInfo.welcomeMessage}
                          onChange={(e) => setBasicInfo({...basicInfo, welcomeMessage: e.target.value})}
                       />
                   </div>
  
                   <div className="flex justify-end pt-4 border-t border-gray-100"><Button onClick={handleUpdateAppearance}>Guardar Apariencia</Button></div>
                 </Card>
              )}
          </div>
        </div>
      </div>
    );
};

const UserProfilePage = ({ user, email, onUpdateProfile, onUpdatePassword }: { user: any, email?: string, onUpdateProfile: (data: any) => void, onUpdatePassword: (password: string) => void }) => {
    // ... UserProfilePage Logic (Unchanged) ...
    // NOTE: Keeping this as is to reduce noise, assuming no changes needed here.
    const [activeTab, setActiveTab] = useState('PERSONAL');
    const [formData, setFormData] = useState({
        full_name: '',
        phone: ''
    });
    
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
  
    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || user.name || '',
                phone: user.phone || '' 
            });
        }
    }, [user]);
  
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(formData);
    };
    
    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("Las contraseñas no coinciden");
            return;
        }
        onUpdatePassword(passwordData.new);
        setPasswordData({ current: '', new: '', confirm: '' });
    };
  
    const tabs = [
      { id: 'PERSONAL', label: 'Información Personal', icon: UserIcon },
      { id: 'NOTIFICATIONS', label: 'Notificaciones', icon: Mail },
      { id: 'PASSWORD', label: 'Cambiar Contraseña', icon: Key }
    ];
  
    return (
      <div className="p-8 space-y-4 w-full pb-20 h-full overflow-y-auto">
        <div className="pb-2">
             <h1 className="text-3xl font-bold text-[#112320]">Mi Perfil</h1>
        </div>
  
         <div className="flex gap-2 p-1 bg-gray-100 rounded-full w-fit max-w-full overflow-x-auto no-scrollbar border border-gray-200">
          {tabs.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium ${
                          isActive 
                          ? 'bg-white text-[#1B3530] font-bold shadow-sm' 
                          : 'text-gray-500 hover:text-[#112320]'
                      }`}
                  >
                      <TabIcon size={16} />
                      {tab.label}
                  </button>
              )
          })}
        </div>
  
        <div className="max-w-4xl py-4">
            {activeTab === 'PERSONAL' && (
              <Card className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-[#112320]">Información Personal</h3>
                 <form onSubmit={handleSave} className="space-y-4">
                   <Input 
                      label="Nombre Completo" 
                      value={formData.full_name} 
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                   />
                   <Input label="Email" defaultValue={email} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                   <Input 
                      label="Teléfono" 
                      placeholder="+54..."
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                   <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                     <Button type="submit">Guardar Cambios</Button>
                 </div>
                 </form>
              </Card>
            )}
            {activeTab === 'NOTIFICATIONS' && (
              <Card className="space-y-6 animate-in fade-in duration-300">
                 <h3 className="text-lg font-bold mb-4 text-[#112320]">Preferencias de Notificación</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-base text-gray-700">Recibir resumen diario por email</span>
                       <Checkbox label="" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-base text-gray-700">Notificar nuevas reservas</span>
                       <Checkbox label="" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-base text-gray-700">Notificar cancelaciones</span>
                       <Checkbox label="" defaultChecked />
                    </div>
                 </div>
              </Card>
            )}
            {activeTab === 'PASSWORD' && (
               <Card className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold mb-4 text-[#112320]">Seguridad</h3>
                  <form onSubmit={handlePasswordSave} className="space-y-4">
                    <Input 
                      label="Contraseña Actual" 
                      type="password" 
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    />
                    <Input 
                      label="Nueva Contraseña" 
                      type="password" 
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    />
                    <Input 
                      label="Confirmar Nueva Contraseña" 
                      type="password" 
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    />
                    <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                      <Button type="submit">Actualizar Contraseña</Button>
                    </div>
                  </form>
               </Card>
            )}
        </div>
      </div>
    );
};

// --- Main Logic & State ---

const App: React.FC = () => {
  // --- STATE ---
  const [usersDb, setUsersDb] = useState<User[]>(MOCK_USERS);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [courts, setCourts] = useState<Court[]>(MOCK_COURTS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [inventory, setInventory] = useState<Product[]>(MOCK_INVENTORY);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [clubConfig, setClubConfig] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Feedback System
  const [snackbar, setSnackbar] = useState<{message: string, type: 'success' | 'error' | 'info', isOpen: boolean}>({
      message: '', type: 'success', isOpen: false
  });

  const showFeedback = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setSnackbar({ message, type, isOpen: true });
  };

  const closeSnackbar = () => {
      setSnackbar(prev => ({ ...prev, isOpen: false }));
  };

  // Mock Reviews Data
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Carlos Pérez', date: '2023-10-25', rating: 5, comment: 'Excelente cancha y atención!', reply: '¡Gracias Carlos! Te esperamos pronto.', isReported: false },
    { id: 2, author: 'Ana López', date: '2023-10-20', rating: 4, comment: 'Muy buena iluminación, pero los vestuarios podrían mejorar.', reply: '', isReported: false },
    { id: 3, author: 'Marcos Diaz', date: '2023-10-15', rating: 1, comment: 'Pésimo servicio, nadie atendió el teléfono.', reply: '', isReported: true, reportReason: 'FAKE' },
  ]);

  const [activeSheet, setActiveSheet] = useState<null | 'RESERVATION' | 'COURT' | 'USER' | 'CLIENT' | 'VIEW_CLIENT' | 'PRODUCT' | 'VIEW_RESERVATION' | 'EXPORT_OPTIONS' | 'IMPORT_INVENTORY' | 'DELETE_USER_CONFIRMATION' | 'DELETE_RESERVATION_CONFIRMATION' | 'REPLY_REVIEW' | 'REPORT_REVIEW' | 'LOGOUT_CONFIRMATION' | 'DELETE_COURT_CONFIRMATION' | 'DELETE_CLIENT_CONFIRMATION' | 'DELETE_PRODUCT_CONFIRMATION'>(null);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUserProfile(userData);
    showFeedback(`Bienvenido, ${userData.name}`);
  };

  const handleLogout = () => {
    setActiveSheet('LOGOUT_CONFIRMATION');
  };

  const confirmLogout = async () => {
    setIsAuthenticated(false);
    setActiveSheet(null);
    setUserProfile(null);
    showFeedback('Sesión cerrada correctamente', 'info');
  };

  const handleUpdateProfile = async (data: any) => {
      setUserProfile((prev: any) => ({ ...prev, ...data }));
      
      // Update in "database" as well
      setUsersDb(prev => prev.map(u => u.email === userProfile.email ? { ...u, name: data.full_name, phone: data.phone } : u));
      
      showFeedback('Perfil actualizado');
  };

  const handleUpdatePassword = (newPassword: string) => {
      // Update in "database"
      setUsersDb(prev => prev.map(u => u.email === userProfile.email ? { ...u, password: newPassword } : u));
      showFeedback('Contraseña actualizada correctamente');
  };

  // App Level State for Schedule and Services
  const [schedule, setSchedule] = useState([
    { day: 'Lunes', open: true, start: '09:00', end: '23:00' },
    { day: 'Martes', open: true, start: '09:00', end: '23:00' },
    { day: 'Miércoles', open: true, start: '09:00', end: '23:00' },
    { day: 'Jueves', open: true, start: '09:00', end: '23:00' },
    { day: 'Viernes', open: true, start: '09:00', end: '23:00' },
    { day: 'Sábado', open: true, start: '09:00', end: '23:00' },
    { day: 'Domingo', open: true, start: '10:00', end: '22:00' },
    { day: 'Feriado', open: true, start: '10:00', end: '22:00' }
  ]);
  
  const [clubServices, setClubServices] = useState<string[]>(['Wi-Fi', 'Estacionamiento', 'Vestuario']);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');

  const handleUpdateClub = async (newData: any) => {
     if (newData.schedule) setSchedule(newData.schedule);
     if (newData.services) setClubServices(newData.services);
     if (newData.welcomeMessage !== undefined) setWelcomeMessage(newData.welcomeMessage);
     setClubConfig(prev => ({ ...prev, ...newData }));
     showFeedback('Información del club actualizada');
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
  const [deleteCourtId, setDeleteCourtId] = useState<string | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

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

      // Use the robustly fetched user profile name
      const creatorName = userProfile?.name || "Admin";
      const clientNameInput = reservationForm.clientName;

      // Auto-create client if not exists
      const existingClient = clients.find(c => c.name.toLowerCase() === clientNameInput.toLowerCase());
      if (!existingClient && clientNameInput.trim() !== '') {
          const newClient: Client = {
              id: Math.random().toString(36).substr(2, 9),
              name: clientNameInput,
              email: reservationForm.clientEmail || '',
              phone: reservationForm.clientPhone || '',
              totalBookings: 1,
              totalSpent: Number(reservationForm.price) || 0,
              lastBooking: `${formDate}T${formTime}`
          };
          setClients(prev => [...prev, newClient]);
          showFeedback(`Nuevo cliente "${clientNameInput}" registrado automáticamente`, 'info');
      }

      const reservationData: Reservation = {
        id: selectedReservation ? selectedReservation.id : Math.random().toString(36).substr(2, 9),
        courtId: formCourtId,
        clientName: clientNameInput,
        startTime: `${formDate}T${formTime}`,
        endTime: endTime,
        price: Number(reservationForm.price) || 4500,
        status: ReservationStatus.CONFIRMED,
        isPaid: false,
        createdBy: creatorName,
        paymentMethod: reservationForm.paymentMethod,
        // @ts-ignore
        type: reservationForm.type,
        // @ts-ignore
        notes: reservationForm.notes
      };

      if (selectedReservation) {
          setReservations(reservations.map(r => r.id === selectedReservation.id ? reservationData : r));
          showFeedback('Reserva actualizada');
      } else {
          setReservations([...reservations, reservationData]);
          showFeedback('Reserva creada exitosamente');
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

          setReservations(reservations.map(r => r.id === selectedReservation.id ? { ...r, status: ReservationStatus.CANCELLED, cancellationReason: reason } : r));
          showFeedback('Reserva cancelada', 'error');
      }
      resetReservationForm();
      setActiveSheet(null); 
  };
  
  const handleSaveCourt = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      
      const courtData: Court = {
          id: selectedCourt ? selectedCourt.id : Math.random().toString(36).substr(2, 9),
          name: formData.get('name') as string,
          types: courtFormTypes,
          surface: formData.get('surface') as string,
          isIndoor: formData.get('isIndoor') === 'on',
          hasLighting: formData.get('hasLighting') === 'on',
          forceStart: (formData.get('forceStart') as ForceStartOption) || 'NO_ROUNDING'
      };

      if (selectedCourt) {
          setCourts(courts.map(c => c.id === selectedCourt.id ? courtData : c));
          showFeedback('Cancha actualizada');
      } else {
          setCourts([...courts, courtData]);
          showFeedback('Cancha creada');
      }
      setSelectedCourt(null);
      setActiveSheet(null); 
  };
  
  const confirmDeleteCourt = () => {
      if (deleteCourtId) {
          setCourts(courts.filter(c => c.id !== deleteCourtId));
          showFeedback('Cancha eliminada', 'error');
      }
      setDeleteCourtId(null);
      setActiveSheet(null);
  };

  const handleSaveUser = (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      const newUser: User = {
          id: selectedUser ? selectedUser.id : Math.random().toString(36).substr(2, 9),
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as any,
          status: 'ACTIVE',
          password: '123' // Default for new users
      };
      if (selectedUser) {
          setUsersDb(usersDb.map(u => u.id === selectedUser.id ? newUser : u));
          showFeedback('Usuario actualizado');
      } else {
          setUsersDb([...usersDb, newUser]);
          showFeedback('Usuario creado');
      }
      setSelectedUser(null);
      setActiveSheet(null); 
  };
  
  const initiateDeleteUser = (id: string) => { setDeleteUserId(id); setActiveSheet('DELETE_USER_CONFIRMATION'); };
  const confirmDeleteUser = () => { 
      if (deleteUserId) setUsersDb(usersDb.filter(u => u.id !== deleteUserId)); 
      showFeedback('Usuario eliminado', 'error');
      setActiveSheet(null); 
  };
  
  const handleSaveClient = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      const newClientData: Client = {
          id: selectedClient ? selectedClient.id : Math.random().toString(36).substr(2, 9),
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          totalBookings: selectedClient ? selectedClient.totalBookings : 0,
          totalSpent: selectedClient ? selectedClient.totalSpent : 0,
          lastBooking: selectedClient ? selectedClient.lastBooking : new Date().toISOString()
      };

      if (selectedClient) {
          setClients(clients.map(c => c.id === selectedClient.id ? newClientData : c));
          showFeedback('Cliente actualizado');
      } else {
          setClients([...clients, newClientData]);
          showFeedback('Cliente registrado');
      }
      setSelectedClient(null);
      setActiveSheet(null); 
  };

  const confirmDeleteClient = () => {
      if (deleteClientId) {
          setClients(clients.filter(c => c.id !== deleteClientId));
          showFeedback('Cliente eliminado', 'error');
      }
      setDeleteClientId(null);
      setActiveSheet(null);
  };
  
  const openBookClient = (client: Client) => { 
      setPrefillReservation({ date: selectedDate, time: '10:00', courtId: courts[0].id, clientName: client.name });
      setReservationForm(prev => ({...prev, clientName: client.name, clientPhone: client.phone, clientEmail: client.email}));
      setActiveSheet('RESERVATION');
  };
  
  const handleSaveProduct = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      const newProduct: Product = {
          id: selectedProduct ? selectedProduct.id : Math.random().toString(36).substr(2, 9),
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
          setInventory(inventory.map(p => p.id === selectedProduct.id ? newProduct : p));
          showFeedback('Producto actualizado');
      } else {
          setInventory([...inventory, newProduct]);
          showFeedback('Producto creado');
      }
      setSelectedProduct(null);
      setActiveSheet(null); 
  };

  const confirmDeleteProduct = () => {
      if (deleteProductId) {
          setInventory(inventory.filter(p => p.id !== deleteProductId));
          showFeedback('Producto eliminado', 'error');
      }
      setDeleteProductId(null);
      setActiveSheet(null);
  };

  const handleExport = (format: string) => {
    // Simulate export
    showFeedback(`Exportando reporte en formato ${format}...`, 'info');
    setActiveSheet(null);
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const replyText = formData.get('replyText') as string;

    setReviews(prev => prev.map(r => r.id === reviewActionId ? { ...r, reply: replyText } : r));
    showFeedback('Respuesta enviada');
    setActiveSheet(null);
    setReviewActionId(null);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const reason = formData.get('reportReason') as string;

    setReviews(prev => prev.map(r => r.id === reviewActionId ? { ...r, isReported: true, reportReason: reason } : r));
    showFeedback('Comentario reportado', 'error');
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
          clientPhone: '', // Would need to fetch if storing it on reservation
          clientEmail: '', // Would need to fetch if storing it on reservation
          depositAmount: '',
          depositMethod: 'Efectivo',
          paymentMethod: selectedReservation.paymentMethod || 'Efectivo',
          // @ts-ignore
          notes: selectedReservation.notes || '',
          // @ts-ignore
          type: selectedReservation.type || 'Normal',
          duration: duration.toString(),
          isRecurring: false,
          price: selectedReservation.price.toString()
      });
      setActiveSheet('RESERVATION');
  };

  // Helper to check access permissions
  const canAccessFullApp = userProfile?.role === 'OWNER' || userProfile?.role === 'ADMIN';

  return (
    <HashRouter>
      <Snackbar message={snackbar.message} type={snackbar.type} isOpen={snackbar.isOpen} onClose={closeSnackbar} />
      
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} usersDb={usersDb} /> : <Navigate to="/" />} />
        {/* Registration route removed as requested */}
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
                        <Route path="/courts" element={<CourtsPage courts={courts} onAddCourt={() => { setSelectedCourt(null); setCourtFormTypes([]); setActiveSheet('COURT'); }} onEditCourt={(c) => { setSelectedCourt(c); setCourtFormTypes(c.types); setActiveSheet('COURT'); }} onDeleteCourt={(id) => { setDeleteCourtId(id); setActiveSheet('DELETE_COURT_CONFIRMATION'); }} />} />
                        <Route path="/clients" element={<ClientsPage clients={clients} onAddClient={() => { setSelectedClient(null); setActiveSheet('CLIENT'); }} onEditClient={(c) => { setSelectedClient(c); setActiveSheet('CLIENT'); }} onViewClient={(c) => { setSelectedClient(c); setActiveSheet('VIEW_CLIENT'); }} onBookClient={openBookClient} onDeleteClient={(id) => { setDeleteClientId(id); setActiveSheet('DELETE_CLIENT_CONFIRMATION'); }} />} />
                        <Route path="/inventory" element={<InventoryPage inventory={inventory} onAddProduct={() => { setSelectedProduct(null); setActiveSheet('PRODUCT'); }} onEditProduct={(p) => { setSelectedProduct(p); setActiveSheet('PRODUCT'); }} onDeleteProduct={(id) => { setDeleteProductId(id); setActiveSheet('DELETE_PRODUCT_CONFIRMATION'); }} onImport={() => setActiveSheet('IMPORT_INVENTORY')} />} />
                        <Route path="/reports" element={<ReportsPage onExport={() => setActiveSheet('EXPORT_OPTIONS')} reservations={reservations} />} />
                        <Route path="/my-club" element={<MyClubPage users={usersDb} onAddUser={() => { setSelectedUser(null); setActiveSheet('USER'); }} onEditUser={(u) => { setSelectedUser(u); setActiveSheet('USER'); }} onDeleteUser={(id) => initiateDeleteUser(id)} reviews={reviews} clubConfig={{...clubConfig, schedule, services: clubServices, welcomeMessage }} onUpdateClub={handleUpdateClub} onReplyReview={(id) => { setReviewActionId(id); setActiveSheet('REPLY_REVIEW'); }} onReportReview={(id) => { setReviewActionId(id); setActiveSheet('REPORT_REVIEW'); }} />} />
                    </>
                  ) : (
                    // Redirect employees to home if they try to access restricted pages
                    <Route path="*" element={<Navigate to="/" />} />
                  )}

                </Routes>
            </main>

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
                           {Object.keys(RESERVATION_META).map(key => (
                               <option key={key} value={key}>{RESERVATION_META[key].label}</option>
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
                                 <p className="text-sm text-gray-500">Tipo</p>
                                 <Badge color="gray">
                                     {/* @ts-ignore */}
                                     {RESERVATION_META[selectedReservation.type || 'Normal']?.label || selectedReservation.type || 'Normal'}
                                 </Badge>
                             </div>
                             <div>
                                <p className="text-sm text-gray-500">Creado Por</p>
                                <p className="font-bold text-[#112320]">{selectedReservation.createdBy || 'Sistema'}</p>
                             </div>
                             <div>
                                <p className="text-sm text-gray-500">Método de Pago</p>
                                <p className="font-bold text-[#112320]">{selectedReservation.paymentMethod || 'No especificado'}</p>
                             </div>
                             {(selectedReservation as any).notes && (
                                <div>
                                    <p className="text-sm text-gray-500">Notas</p>
                                    <p className="text-[#112320] italic">{(selectedReservation as any).notes}</p>
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
            
            <SideSheet isOpen={activeSheet === 'CLIENT'} onClose={closeSheet} title={selectedClient ? "Editar Cliente" : "Nuevo Cliente"}>
                <form className="space-y-6" onSubmit={handleSaveClient}>
                    <Input name="name" label="Nombre Completo" placeholder="Ej. Maria Gomez" defaultValue={selectedClient?.name} required />
                    <Input name="phone" label="Teléfono" placeholder="+54 9 11..." defaultValue={selectedClient?.phone} required />
                    <Input name="email" label="Email" type="email" placeholder="maria@email.com" defaultValue={selectedClient?.email} />
                    <div className="pt-6 flex gap-3">
                       <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                       <Button type="submit" className="flex-1">{selectedClient ? 'Actualizar Cliente' : 'Guardar Cliente'}</Button>
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
                        <input type="file" accept=".csv" className="opacity-0 absolute inset-0 cursor-pointer" />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
                        <Button onClick={() => { setActiveSheet(null); showFeedback('Inventario importado'); }}>Importar</Button>
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
            
            <Modal isOpen={activeSheet === 'DELETE_COURT_CONFIRMATION'} onClose={closeSheet} title="Eliminar Cancha">
                <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminar esta cancha? Se perderán las reservas asociadas.</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button variant="destructive" onClick={confirmDeleteCourt}>Eliminar</Button>
                </div>
            </Modal>

            <Modal isOpen={activeSheet === 'DELETE_CLIENT_CONFIRMATION'} onClose={closeSheet} title="Eliminar Cliente">
                <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminar este cliente? Se perderá su historial.</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button variant="destructive" onClick={confirmDeleteClient}>Eliminar</Button>
                </div>
            </Modal>

            <Modal isOpen={activeSheet === 'DELETE_PRODUCT_CONFIRMATION'} onClose={closeSheet} title="Eliminar Producto">
                <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminar este producto del inventario?</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button variant="destructive" onClick={confirmDeleteProduct}>Eliminar</Button>
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
