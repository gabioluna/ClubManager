
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, NavLink, Link, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Button, Card, Input, Badge, SideSheet, Select, MultiSelect, RadioGroup, Checkbox, Modal, AutocompleteInput, Textarea, Snackbar, Switch } from './components/UI';
import { TIME_SLOTS, SPORTS_LIST, SURFACE_LIST, RESERVATION_META } from './constants';
import { Court, Reservation, ReservationStatus, User, Product, CourtType, SurfaceType, ForceStartOption, Client } from './types';
import { Search, Bell, Plus, Filter, MoreHorizontal, DollarSign, MapPin, Edit2, Trash2, Check, Package, Calendar, LayoutGrid, List, Lock, Ban, ChevronRight, Zap, CloudRain, Image as ImageIcon, Link2, Clock, Map as MapIcon, Phone, Power, RefreshCw, TrendingUp, Users as UsersIcon, Clock as ClockIcon, Activity, User as UserIcon, Mail, Shield, Key, FileText, Sheet, FileSpreadsheet, ChevronLeft, Eye, CalendarPlus, Upload, ChevronDown, Star, MessageSquare, Flag, Download, FileType, AlertTriangle, CornerDownRight, LogIn, LogOut, CreditCard, ArrowUpDown, ArrowUp, ArrowDown, FolderOpen, Trophy, HelpCircle, Building2, Repeat } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { supabase } from './lib/supabase';

// --- Skeleton Components ---

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`}></div>
);

const TableSkeleton = () => (
  <div className="w-full space-y-4">
    <div className="bg-[#F8F8F8] h-12 w-full rounded-t-2xl animate-pulse" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-1/4 rounded-full" />
      </div>
    ))}
  </div>
);

const FormSkeleton = () => (
  <div className="space-y-6 w-full max-w-4xl animate-in fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-12 w-full" /></div>
      <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-12 w-full" /></div>
      <div className="space-y-2 col-span-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-12 w-full" /></div>
    </div>
    <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-32 w-full" /></div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-in fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  </div>
);

const CalendarSkeleton = () => (
    <div className="w-full h-full flex flex-col gap-4 animate-in fade-in">
        <div className="flex gap-2 mb-4">
             <Skeleton className="h-10 w-32 rounded-full" />
             <Skeleton className="h-10 w-64 rounded-full" />
        </div>
        <div className="flex-1 border border-gray-200 rounded-3xl overflow-hidden bg-white">
            <div className="h-12 bg-[#F8F8F8] border-b border-gray-200 w-full" />
            <div className="flex flex-col">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-20 border-b border-gray-100 flex">
                        <div className="w-24 border-r border-gray-100 bg-white" />
                        <div className="flex-1 bg-gray-50/30" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

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

// --- Auth & Selection Components ---

const ClubSelectionPage = ({ clubs, onSelectClub, onLogout, userName }: { clubs: any[], onSelectClub: (club: any) => void, onLogout: () => void, userName: string }) => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=2000&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <Card className="w-full max-w-lg p-8 shadow-2xl border-none relative z-10 bg-white/95 backdrop-blur-sm">
                <div className="flex flex-col items-center mb-8 text-center">
                    <h1 className="text-2xl font-bold text-[#112320] mb-2">Hola {userName}, selecciona tu Club</h1>
                    <p className="text-gray-500">Elige el club que deseas gestionar hoy</p>
                </div>

                {clubs.length > 0 ? (
                    <div className="flex flex-col gap-4 mb-8">
                        {clubs.map((item) => (
                            <button
                                key={item.club_id}
                                onClick={() => onSelectClub(item.club)}
                                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#1B3530] hover:shadow-md transition-all group text-left w-full"
                            >
                                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                    {item.club.logo ? (
                                        <img src={item.club.logo} alt={item.club.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={24} className="text-gray-400 group-hover:text-[#1B3530] transition-colors" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-[#112320] truncate">{item.club.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{item.club.address || 'Sin dirección'}</p>
                                </div>
                                <div className="flex-shrink-0">
                                     <Badge color={item.role === 'OWNER' ? 'blue' : 'gray'}>
                                        {item.role === 'OWNER' ? 'Dueño' : item.role === 'ADMIN' ? 'Admin' : 'Empleado'}
                                    </Badge>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl mb-8 border border-dashed border-gray-200">
                        <AlertTriangle className="mx-auto text-yellow-500 mb-2" size={32}/>
                        <h3 className="text-lg font-bold text-[#112320]">No tienes clubes asociados</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">No tienes membresías activas en ningún club. Contacta al administrador.</p>
                    </div>
                )}
                
                <div className="flex justify-center border-t border-gray-100 pt-6">
                    <Button variant="ghost" onClick={() => setShowLogoutConfirm(true)} className="text-red-600 hover:bg-red-50">
                        <LogOut size={16} className="mr-2"/> Cerrar Sesión
                    </Button>
                </div>
            </Card>

            <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} title="Cerrar Sesión">
                <p className="text-gray-600 mb-6">¿Estás seguro que deseas salir de la aplicación?</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => setShowLogoutConfirm(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={onLogout}>Cerrar Sesión</Button>
                </div>
            </Modal>
        </div>
    );
};

const LoginPage = ({ onLogin, loading, error }: { onLogin: (e: string, p: string) => void, loading: boolean, error: string | null }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div 
        className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=2000&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <Card className="w-full max-w-md p-8 shadow-2xl border-none relative z-10 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#1B3530] rounded-xl flex items-center justify-center text-[#C7F269] font-bold text-xl mb-4">
            G
          </div>
          <h1 className="text-2xl font-bold text-[#112320]">Iniciar Sesión</h1>
          <p className="text-gray-500">Gestor de Clubes Deportivos</p>
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

const UsersPage = ({ 
  users, 
  onAddUser, 
  onEditUser, 
  onToggleStatus,
  loading 
}: { 
  users: User[], 
  onAddUser: () => void, 
  onEditUser: (u: User) => void, 
  onToggleStatus: (u: User) => void,
  loading?: boolean
}) => {
  if (loading) {
      return (
          <div className="p-8 space-y-6 h-full">
               <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                 <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-48" />
                 </div>
                 <Skeleton className="h-9 w-32 rounded-full" />
              </div>
              <Card className="p-0 overflow-hidden w-full">
                  <TableSkeleton />
              </Card>
          </div>
      )
  }

  if (users.length === 0) {
     return (
        <div className="p-8 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#112320]">Gestión de Usuarios</h3>
                <Button onClick={onAddUser} className="h-9 text-sm px-4"><Plus className="w-4 h-4 mr-2"/>Agregar Usuario</Button>
            </div>
            <EmptyState 
                title="No hay usuarios registrados" 
                description="Agrega usuarios (empleados, encargados) para que puedan acceder al sistema de este club." 
                actionLabel="Agregar Usuario"
                onAction={onAddUser}
                icon={UsersIcon}
            />
        </div>
     )
  }

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
                   <div className="flex items-center gap-3">
                     <Switch 
                       checked={user.status === 'ACTIVE'} 
                       onChange={() => onToggleStatus(user)} 
                       disabled={user.role === 'OWNER'}
                     />
                     <span className="text-sm font-medium text-gray-500 min-w-[60px]">
                        {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                     </span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <button className="p-2 flex items-center justify-center border border-gray-200 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100" onClick={() => onEditUser(user)}>
                        <Edit2 size={16}/>
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

const ReservasPage = ({ 
  courts, 
  reservations, 
  onAddReservation,
  onSelectReservation,
  selectedDate,
  onDateChange,
  schedule,
  userRole,
  loading
}: { 
  courts: Court[], 
  reservations: Reservation[], 
  onAddReservation: (date?: string, time?: string, courtId?: string, clientName?: string) => void,
  onSelectReservation: (res: Reservation) => void,
  selectedDate: string,
  onDateChange: (date: string) => void,
  schedule: any[],
  userRole: string,
  loading?: boolean
}) => {
  const navigate = useNavigate();
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
     
     if (type && RESERVATION_META[type]) {
         return RESERVATION_META[type].twColor;
     }
     return 'bg-[#1B3530] text-[#C7F269] hover:bg-[#112320]';
  };

  const filteredReservationsList = viewMode === 'CALENDAR' 
      ? reservations.filter(r => r.startTime.startsWith(selectedDate) && r.status !== ReservationStatus.CANCELLED)
      : [...reservations].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  
  const totalPages = Math.ceil(filteredReservationsList.length / itemsPerPage);
  const paginatedReservations = filteredReservationsList.slice((listPage - 1) * itemsPerPage, listPage * itemsPerPage);

  if (loading) {
      return (
          <div className="p-8 space-y-6 flex flex-col h-full">
               <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-64 rounded-full" />
               </div>
               {viewMode === 'CALENDAR' ? <CalendarSkeleton /> : <Card className="p-0"><TableSkeleton /></Card>}
          </div>
      )
  }

  if (courts.length === 0 && viewMode === 'CALENDAR') {
      return (
        <div className="p-8 h-full">
            <EmptyState 
                title="No hay canchas configuradas" 
                description="Para comenzar a gestionar reservas, primero debes agregar canchas en la sección 'Canchas'." 
                actionLabel={userRole !== 'RECEPTIONIST' ? "Ir a Canchas" : undefined}
                onAction={userRole !== 'RECEPTIONIST' ? () => navigate('/courts') : undefined}
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

const CourtsPage = ({ 
  courts, 
  onAddCourt, 
  onEditCourt, 
  onDeleteCourt,
  loading
}: { 
  courts: Court[], 
  onAddCourt: () => void, 
  onEditCourt: (c: Court) => void,
  onDeleteCourt: (id: string) => void,
  loading?: boolean
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

  if (loading) {
     return (
        <div className="p-8 space-y-6 h-full">
            <div className="flex justify-between items-end">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-9 w-32 rounded-full" />
            </div>
            <Card className="p-0 overflow-hidden">
                <TableSkeleton />
            </Card>
        </div>
     );
  }

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

const ClientsPage = ({ 
  clients, 
  onAddClient, 
  onEditClient,
  loading
}: { 
  clients: Client[], 
  onAddClient: () => void, 
  onEditClient: (client: Client) => void,
  loading?: boolean
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
       return (
          <div className="p-8 space-y-6 h-full">
            <div className="flex justify-between items-center">
               <Skeleton className="h-10 w-48" />
               <Skeleton className="h-9 w-32 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-full" />
            <Card className="p-0 overflow-hidden">
               <TableSkeleton />
            </Card>
          </div>
       )
    }

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
                         <button className="p-2 flex items-center justify-center border border-gray-200 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100" onClick={() => onEditClient(client)}><Edit2 size={16}/></button>
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

const InventoryPage = ({ inventory, onAddProduct, onEditProduct, onDeleteProduct, onImport, loading }: { inventory: Product[], onAddProduct: () => void, onEditProduct: (p: Product) => void, onDeleteProduct: (id: string) => void, onImport: () => void, loading?: boolean }) => {
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

  if (loading) {
      return (
         <div className="p-8 space-y-6 h-full">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-full" />
                    <Skeleton className="h-9 w-32 rounded-full" />
                </div>
            </div>
            <Skeleton className="h-12 w-full rounded-full" />
            <Card className="p-0 overflow-hidden">
                <TableSkeleton />
            </Card>
         </div>
      );
  }

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

const ReportsPage = ({ onExport, reservations, loading }: { onExport: () => void, reservations: Reservation[], loading?: boolean }) => {
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
  
  const sortedReservations = [...filteredReservations].sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  sortedReservations.forEach(r => {
      const dateObj = new Date(r.startTime);
      const day = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
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

  if (loading) {
      return (
          <div className="p-8 space-y-8 pb-20 h-full">
               <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-10 w-48 rounded-full" />
               </div>
               <DashboardSkeleton />
          </div>
      )
  }

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

const DEFAULT_SCHEDULE = [
    { day: 'Domingo', open: true, start: '09:00', end: '22:00' },
    { day: 'Lunes', open: true, start: '09:00', end: '22:00' },
    { day: 'Martes', open: true, start: '09:00', end: '22:00' },
    { day: 'Miércoles', open: true, start: '09:00', end: '22:00' },
    { day: 'Jueves', open: true, start: '09:00', end: '22:00' },
    { day: 'Viernes', open: true, start: '09:00', end: '22:00' },
    { day: 'Sábado', open: true, start: '09:00', end: '22:00' },
    { day: 'Feriado', open: true, start: '09:00', end: '22:00' },
];

interface MyClubProps {
    users: User[];
    onAddUser: () => void;
    onEditUser: (u: User) => void;
    onToggleStatus: (u: User) => void;
    onDeleteUser: (id: string) => void;
    reviews: any[];
    clubConfig: any;
    onUpdateClub: (data: any) => void;
    onReplyReview: (id: number) => void;
    onReportReview: (id: number) => void;
    selectedClub: any;
    onChangeClub: () => void;
    loading?: boolean;
    courts: Court[];
}

const MyClubPage = ({ users, onAddUser, onEditUser, onToggleStatus, onDeleteUser, reviews, clubConfig, onUpdateClub, onReplyReview, onReportReview, selectedClub, onChangeClub, loading, courts }: MyClubProps) => {
    const [activeTab, setActiveTab] = useState('DATOS');
    const [basicInfo, setBasicInfo] = useState({ 
        name: 'Club Central', 
        phone: '', 
        address: '', 
        coords: '', 
        status: 'ACTIVE', 
        description: '',
        logo: '',
        cover: ''
    });
    const [schedule, setSchedule] = useState<any[]>([]);
    const [services, setServices] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState('ALL');
    const [starFilter, setStarFilter] = useState<number | 'ALL'>('ALL');
    const [customDateStart, setCustomDateStart] = useState('');
    const [customDateEnd, setCustomDateEnd] = useState('');
    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Special Events State
    const [specialEvents, setSpecialEvents] = useState<{id: string, date: string, name: string, type: string, scope: string, courtIds: string[]}[]>([]);
    const [newEvent, setNewEvent] = useState({ date: '', name: '', type: 'Feriado', scope: 'ALL', courtIds: [] as string[] });

    const handleAddEvent = () => {
        if (!newEvent.date || !newEvent.name) return;
        setSpecialEvents([...specialEvents, { ...newEvent, id: Date.now().toString() }]);
        setNewEvent({ date: '', name: '', type: 'Feriado', scope: 'ALL', courtIds: [] });
    };

    const handleDeleteEvent = (id: string) => {
        setSpecialEvents(specialEvents.filter(e => e.id !== id));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'LOGO' | 'COVER') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (type === 'LOGO') {
                    setBasicInfo(prev => ({ ...prev, logo: result }));
                } else {
                    setBasicInfo(prev => ({ ...prev, cover: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Review Filters
    const [reviewSort, setReviewSort] = useState('RECENT');
    const [reviewFilter, setReviewFilter] = useState<number | 'ALL'>('ALL');

    // Lógica de filtrado y ordenamiento
    const filteredReviews = React.useMemo(() => {
        let res = [...reviews];
        
        // Filtrar por estrellas
        if (reviewFilter !== 'ALL') {
            res = res.filter(r => Math.round(r.rating) === reviewFilter);
        }
        
        // Ordenar
        if (reviewSort === 'RECENT') {
                res.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (reviewSort === 'ASC') {
            res.sort((a, b) => a.rating - b.rating);
        } else if (reviewSort === 'DESC') {
            res.sort((a, b) => b.rating - a.rating);
        }
        return res;
    }, [reviews, reviewFilter, reviewSort]);

    // Helper para renderizar estrellas
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={`${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                ))}
            </div>
        );
    };
  
    useEffect(() => {
        if (clubConfig) {
            setBasicInfo({
                name: clubConfig.name || '',
                phone: clubConfig.phone || '',
                address: clubConfig.address || '',
                coords: clubConfig.lat && clubConfig.lng ? `${clubConfig.lat}, ${clubConfig.lng}` : '',
                status: clubConfig.isActive ? 'ACTIVE' : 'INACTIVE',
                description: clubConfig.description || '',
                logo: clubConfig.logo || '',
                cover: clubConfig.cover || ''
            });
            setSchedule(clubConfig.schedule || DEFAULT_SCHEDULE);
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
        const [lat, lng] = basicInfo.coords.split(',').map(s => s.trim());
        
        onUpdateClub({
          name: basicInfo.name,
          phone: basicInfo.phone,
          address: basicInfo.address,
          lat: lat || '',
          lng: lng || '',
          isActive: basicInfo.status === 'ACTIVE'
        });
    };
    
    const handleUpdateAppearance = () => {
      onUpdateClub({ 
          description: basicInfo.description,
          logo: basicInfo.logo,
          cover: basicInfo.cover
      });
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
    
    if (loading) {
       return (
          <div className="p-8 space-y-4 w-full h-full">
               <Skeleton className="h-10 w-48 mb-6" />
               <div className="flex gap-2 mb-6">
                   {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-9 w-32 rounded-full" />)}
               </div>
               <FormSkeleton />
          </div>
       )
    }

    return (
      <div className="p-8 space-y-4 w-full pb-20 h-full overflow-y-auto">
        <div className="pb-2">
          <h1 className="text-3xl font-bold text-[#112320]">Mi Club</h1>
        </div>

        {/* Change Club Header */}
        <div className="w-full mx-auto md:mx-0 mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F8F8F8] rounded-xl text-[#1B3530] flex items-center justify-center overflow-hidden border border-gray-100">
                  {selectedClub?.logo ? (
                      <img src={selectedClub.logo} alt="Club Logo" className="w-full h-full object-cover" />
                  ) : (
                      <Building2 size={24} />
                  )}
              </div>
              <div>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Gestionando</p>
                 <h2 className="text-lg font-bold text-[#112320]">{selectedClub?.name || 'Cargando...'}</h2>
              </div>
           </div>
           <Button variant="secondary" onClick={onChangeClub}>
              <Repeat size={16} className="mr-2" />
              Cambiar Club
           </Button>
        </div>
        
        <div className="flex gap-2 p-1 bg-gray-100 rounded-full max-w-full overflow-x-auto no-scrollbar border border-gray-200">
          {TABS.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium ${isActive ? 'bg-white text-[#1B3530] font-bold shadow-sm' : 'text-gray-500 hover:text-[#112320]'}`}>
                      <TabIcon size={16} />{tab.label}
                  </button>
              )
          })}
        </div>

        <div className="py-4 w-full">
          <div className="w-full max-w-5xl mx-auto md:mx-0">
              {activeTab === 'DATOS' && (
                <Card className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input name="name" label="Nombre del Complejo" placeholder="Ej. Club Central" value={basicInfo.name} onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})} />
                    <Input name="phone" label="Teléfono" placeholder="+54 9 11..." icon={Phone} value={basicInfo.phone} onChange={(e) => setBasicInfo({...basicInfo, phone: e.target.value})} />
                    <Input name="address" label="Dirección" placeholder="Calle, Número, Ciudad" className="md:col-span-2" value={basicInfo.address} onChange={(e) => setBasicInfo({...basicInfo, address: e.target.value})} />
                    <Input name="coords" label="Coordenadas" placeholder="Lat, Long (Ej: -34.6037, -58.3816)" icon={MapPin} value={basicInfo.coords} onChange={(e) => setBasicInfo({...basicInfo, coords: e.target.value})} />
                    <Select name="status" label="Estado del Complejo" value={basicInfo.status} onChange={(e) => setBasicInfo({...basicInfo, status: e.target.value})}>
                      <option value="ACTIVE">Activo</option>
                      <option value="INACTIVE">Inactivo</option>
                    </Select>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-100"><Button onClick={handleUpdateBasicInfo}>Guardar Cambios</Button></div>
                </Card>
              )}
  
              {activeTab === 'USUARIOS' && (
                  <UsersPage users={users} onAddUser={onAddUser} onEditUser={onEditUser} onToggleStatus={onToggleStatus} />
              )}
            {activeTab === 'RESEÑAS' && (
                <div className="space-y-6 animate-in fade-in duration-300 w-full">
                    {/* Header Summary con Promedio */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center justify-center w-24 h-24 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                                <span className="text-3xl font-bold text-[#1B3530]">{clubConfig?.avgRating || 0}</span>
                                <div className="flex gap-0.5 mt-1">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#112320]">Calificación Promedio</h3>
                                <p className="text-gray-500">Basado en {reviews.length} reseñas</p>
                            </div>
                        </div>
                        {/* Barras de distribución simples */}
                        <div className="flex flex-col gap-2 w-full md:w-auto min-w-[200px]">
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-xs font-bold w-4">5</span> <Star size={10} className="text-yellow-400 fill-yellow-400"/>
                                <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(reviews.filter(r => Math.round(r.rating) === 5).length / Math.max(reviews.length, 1)) * 100}%` }}></div></div>
                            </div>
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-xs font-bold w-4">4</span> <Star size={10} className="text-yellow-400 fill-yellow-400"/>
                                <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(reviews.filter(r => Math.round(r.rating) === 4).length / Math.max(reviews.length, 1)) * 100}%` }}></div></div>
                            </div>
                            {/* Puedes agregar 3, 2, 1 aquí si deseas */}
                        </div>
                    </div>

                    {/* Filtros y Ordenamiento */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl border border-gray-200">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto p-1">
                            <button onClick={() => setReviewFilter('ALL')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${reviewFilter === 'ALL' ? 'bg-[#1B3530] text-[#C7F269]' : 'text-gray-600 hover:bg-gray-50'}`}>Todos</button>
                            <button onClick={() => setReviewFilter(5)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${reviewFilter === 5 ? 'bg-[#1B3530] text-[#C7F269]' : 'text-gray-600 hover:bg-gray-50'}`}>5 <Star size={12} className="fill-current"/></button>
                            {/* Repetir para 4, 3, 2, 1 */}
                        </div>
                        <div className="w-full sm:w-auto px-2">
                            <select 
                                value={reviewSort} 
                                onChange={(e) => setReviewSort(e.target.value)}
                                className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#1B3530] focus:border-[#1B3530] block p-2.5 outline-none"
                            >
                                <option value="RECENT">Más Recientes</option>
                                <option value="DESC">Mayor Calificación</option>
                                <option value="ASC">Menor Calificación</option>
                            </select>
                        </div>
                    </div>

                    {/* Lista de Reseñas */}
                    <div className="space-y-4">
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium">No hay reseñas con este filtro.</p>
                            </div>
                        ) : (
                            filteredReviews.map(review => (
                                <Card key={review.id} className="p-6 transition-all hover:shadow-md">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#1B3530]">
                                                {review.clientName ? review.clientName.substring(0,2).toUpperCase() : 'AN'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#112320] text-sm">{review.clientName}</h4>
                                                <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-[52px]">
                                        "{review.comment}"
                                    </p>
                                    
                                    {/* Bloque de Respuesta del Club */}
                                    {review.reply_comment && (
                                        <div className="mt-4 ml-[52px] bg-gray-50 p-4 rounded-xl border-l-4 border-[#1B3530]">
                                            <p className="text-xs font-bold text-[#1B3530] mb-1">Respuesta del Club</p>
                                            <p className="text-sm text-gray-600 italic">"{review.reply_comment}"</p>
                                            {review.reply_at && (
                                                <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(review.reply_at).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 pl-[52px]">
                                        <button 
                                            onClick={() => onReplyReview(review.id)}
                                            className="text-xs font-semibold text-[#1B3530] hover:underline flex items-center gap-1"
                                        >
                                            <MessageSquare size={14} /> Responder
                                        </button>
                                        <button 
                                            onClick={() => onReportReview(review.id)}
                                            className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 ml-4"
                                        >
                                            <Flag size={14} /> Reportar
                                        </button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            )}
              {activeTab === 'HORARIOS' && (
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    <Card className="space-y-6 h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#112320]">Configuración de Horarios</h3>
                                <p className="text-gray-500 text-sm">Define los horarios de apertura y cierre.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {schedule.map((day, idx) => (
                                <div key={day.day || idx} className="flex items-center gap-4 p-3 bg-[#F8F8F8] rounded-2xl">
                                    <div className="w-24 font-bold text-[#112320]">{day.day}</div>
                                    <div className="flex-1 flex items-center gap-4">
                                        <Checkbox label="Abierto" checked={day.open} onChange={(e) => handleScheduleChange(idx, 'open', e.target.checked)} />
                                        {day.open && (
                                            <div className="flex items-center gap-2">
                                                <input type="time" className="rounded-xl border-gray-200 p-2 text-sm bg-white" value={day.start} onChange={(e) => handleScheduleChange(idx, 'start', e.target.value)} />
                                                <span className="text-gray-400">-</span>
                                                <input type="time" className="rounded-xl border-gray-200 p-2 text-sm bg-white" value={day.end} onChange={(e) => handleScheduleChange(idx, 'end', e.target.value)} />
                                            </div>
                                        )}
                                        {!day.open && <span className="text-sm text-gray-400 italic">Cerrado</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4 border-t border-gray-100"><Button onClick={handleUpdateSchedule}>Guardar Horarios</Button></div>
                    </Card>

                    <Card className="space-y-6 h-fit">
                        <div>
                             <h3 className="text-lg font-bold text-[#112320]">Eventos Especiales</h3>
                             <p className="text-gray-500 text-sm">Configura días feriados o cierres por mantenimiento.</p>
                        </div>
                        
                        <div className="space-y-4 p-4 bg-[#F8F8F8] rounded-2xl">
                             <h4 className="font-bold text-sm text-[#112320]">Nuevo Evento</h4>
                             <div className="grid grid-cols-2 gap-4">
                                 <Input type="date" label="Fecha" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                                 <Select label="Tipo" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                                     <option value="Feriado">Feriado</option>
                                     <option value="Cerrado">Cerrado</option>
                                 </Select>
                             </div>
                             <Input label="Motivo / Nombre" placeholder="Ej. Día del Club" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
                             
                             <div className="space-y-2">
                                 <label className="text-base font-medium text-[#112320]">Aplica a</label>
                                 <div className="flex gap-4">
                                     <label className="flex items-center gap-2 cursor-pointer">
                                         <input type="radio" name="scope" checked={newEvent.scope === 'ALL'} onChange={() => setNewEvent({...newEvent, scope: 'ALL', courtIds: []})} className="accent-[#1B3530]" />
                                         <span className="text-sm font-medium">Todo el Club</span>
                                     </label>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                         <input type="radio" name="scope" checked={newEvent.scope === 'SPECIFIC'} onChange={() => setNewEvent({...newEvent, scope: 'SPECIFIC'})} className="accent-[#1B3530]" />
                                         <span className="text-sm font-medium">Canchas Específicas</span>
                                     </label>
                                 </div>
                             </div>

                             {newEvent.scope === 'SPECIFIC' && (
                                 <MultiSelect 
                                    label="Seleccionar Canchas" 
                                    options={courts.map(c => c.name)} 
                                    selected={courts.filter(c => newEvent.courtIds.includes(c.id)).map(c => c.name)}
                                    onChange={(selectedNames) => {
                                         const ids = courts.filter(c => selectedNames.includes(c.name)).map(c => c.id);
                                         setNewEvent({...newEvent, courtIds: ids});
                                    }}
                                 />
                             )}
                             
                             <Button className="w-full" onClick={handleAddEvent} disabled={!newEvent.date || !newEvent.name}>
                                 <Plus className="w-4 h-4 mr-2" /> Agregar Evento
                             </Button>
                        </div>

                        <div className="space-y-3">
                             <h4 className="font-bold text-sm text-[#112320]">Próximos Eventos</h4>
                             {specialEvents.length === 0 ? (
                                 <p className="text-sm text-gray-400 italic text-center py-4">No hay eventos configurados.</p>
                             ) : (
                                 specialEvents.map(event => (
                                     <div key={event.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-[#F8F8F8] transition-colors group">
                                         <div>
                                             <div className="flex items-center gap-2">
                                                 <span className="font-bold text-[#112320] text-sm">{new Date(event.date + 'T00:00:00').toLocaleDateString()}</span>
                                                 <Badge color={event.type === 'Feriado' ? 'blue' : 'red'}>{event.type}</Badge>
                                             </div>
                                             <p className="text-sm text-gray-600">{event.name}</p>
                                             <p className="text-xs text-gray-400">
                                                 {event.scope === 'ALL' ? 'Todo el Club' : `${event.courtIds.length} canchas`}
                                             </p>
                                         </div>
                                         <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                             <Trash2 size={16} />
                                         </button>
                                     </div>
                                 ))
                             )}
                        </div>
                    </Card>
                 </div>
              )}
              {activeTab === 'SERVICIOS' && (
                 <Card className="animate-in fade-in duration-300">
                   <h3 className="text-lg font-bold mb-6 text-[#112320]">Servicios del Club</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {['Wi-Fi', 'Vestuario', 'Gimnasio', 'Estacionamiento', 'Ayuda Médica', 'Torneos', 'Cumpleaños', 'Parrilla', 'Escuelita deportiva', 'Colegios', 'Bar / Restaurante', 'Quincho'].map(s => {
                          const isChecked = services.includes(s);
                          return (
                              <div key={s} className={`flex items-center justify-between p-4 border rounded-2xl transition-all cursor-pointer ${isChecked ? 'border-[#1B3530] bg-[#C7F269]/10' : 'border-gray-100 bg-[#F8F8F8]/50 hover:border-gray-300'}`} onClick={() => toggleService(s)}>
                                  <span className="font-medium text-[#112320]">{s}</span>
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isChecked ? 'bg-[#1B3530] border-[#1B3530]' : 'border-gray-300 bg-white'}`}>{isChecked && <Check size={14} className="text-[#C7F269]" />}</div>
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
                              <div><h4 className="font-bold text-[#112320] text-lg">Mercado Pago</h4><p className="text-sm text-gray-500">Procesa pagos online para señas y reservas.</p></div>
                          </div>
                          <Button variant="secondary" className="rounded-full">Conectar</Button>
                       </div>
                       <div className="p-6 border border-gray-200 rounded-3xl flex items-center justify-between hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-8 h-8" alt="Google Calendar" /></div>
                              <div><h4 className="font-bold text-[#112320] text-lg">Google Calendar</h4><p className="text-sm text-gray-500">Sincroniza tus reservas con tu calendario personal.</p></div>
                          </div>
                          <div className="flex items-center gap-2"><Button variant="ghost" className="text-gray-400">Conectar</Button></div>
                       </div>
                   </div>
                 </Card>
              )}
              {activeTab === 'APARIENCIA' && (
                 <Card className="animate-in fade-in duration-300 space-y-8">
                   <h3 className="text-lg font-bold mb-4 text-[#112320]">Personalización Visual</h3>
                   <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'LOGO')} />
                   <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'COVER')} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                          <label className="text-base font-medium text-[#112320] block">Logo del Club</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#F8F8F8] transition-colors cursor-pointer group h-48 relative overflow-hidden" onClick={() => logoInputRef.current?.click()}>
                               {basicInfo.logo ? <img src={basicInfo.logo} alt="Logo Preview" className="absolute inset-0 w-full h-full object-contain p-4" /> : <><div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><ImageIcon className="text-gray-400" size={32} /></div><p className="text-sm font-bold text-[#1B3530]">Subir Logo</p><p className="text-xs text-gray-400">PNG, JPG (Max 2MB)</p><p className="text-[10px] text-gray-400">Recomendado: 500x500px</p></>}
                          </div>
                      </div>
                      <div className="space-y-4">
                          <label className="text-base font-medium text-[#112320] block">Imagen de Portada</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#F8F8F8] transition-colors cursor-pointer group h-48 relative overflow-hidden" onClick={() => coverInputRef.current?.click()}>
                               {basicInfo.cover ? <img src={basicInfo.cover} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" /> : <><div className="w-full h-20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-gray-300"><ImageIcon size={48} /></div><p className="text-sm font-bold text-[#1B3530]">Subir Portada</p><p className="text-xs text-gray-400">Max 5MB</p><p className="text-xs text-gray-400">Max 5MB</p><p className="text-xs text-gray-400">Recomendado: 1920x1080px</p></>}
                          </div>
                      </div>
                   </div>
                   <div className="pt-4 relative">
                       <Input label="Mensaje de Bienvenida" placeholder="¡Bienvenidos a Club Central!" value={basicInfo.description} onChange={(e) => { if (e.target.value.length <= 140) { setBasicInfo({...basicInfo, description: e.target.value}); } }} />
                       <div className="absolute right-0 top-0 text-xs text-gray-400 mt-2">{basicInfo.description.length}/140</div>
                   </div>
                   <div className="flex justify-end pt-4 border-t border-gray-100"><Button onClick={handleUpdateAppearance}>Guardar Apariencia</Button></div>
                 </Card>
              )}
          </div>
        </div>
      </div>
    );
};

const UserProfilePage = ({ 
  user, 
  email, 
  onUpdateProfile, 
  onUpdatePassword,
  onUpdateNotifications,
  loading
}: { 
  user: any, 
  email: string, 
  onUpdateProfile: (data: any) => void, 
  onUpdatePassword: (pass: string) => void,
  onUpdateNotifications: (settings: any) => void,
  loading?: boolean
}) => {
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [formData, setFormData] = useState({ full_name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  
  // Initialize from user settings if available, else defaults
  const [notificationSettings, setNotificationSettings] = useState({
      newReservation: true,
      cancelledReservation: true,
      modifiedReservation: false,
      ...(user?.notification_settings || {})
  });

  useEffect(() => {
    if(user) {
        setFormData({ full_name: user.name || '', phone: user.phone || '' });
        if (user.notification_settings) {
            setNotificationSettings(prev => ({...prev, ...user.notification_settings}));
        }
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return;
    }
    onUpdatePassword(passwords.new);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
      const newSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
      setNotificationSettings(newSettings);
      onUpdateNotifications(newSettings);
  };

  const TABS = [
      { id: 'PROFILE', label: 'Información Personal', icon: UserIcon },
      { id: 'SECURITY', label: 'Seguridad', icon: Shield },
      { id: 'NOTIFICATIONS', label: 'Notificaciones', icon: Bell }
  ];

  if (loading) {
      return (
         <div className="p-8 space-y-4 w-full h-full">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="flex gap-2 mb-6">
                 {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-9 w-32 rounded-full" />)}
            </div>
            <FormSkeleton />
         </div>
      );
  }

  return (
    <div className="p-8 space-y-4 w-full pb-20 h-full overflow-y-auto">
      <div className="pb-2">
        <h1 className="text-3xl font-bold text-[#112320]">Mi Perfil</h1>
      </div>
      
      <div className="flex gap-2 p-1 bg-gray-100 rounded-full w-fit max-w-full overflow-x-auto no-scrollbar border border-gray-200">
        {TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium ${isActive ? 'bg-white text-[#1B3530] font-bold shadow-sm' : 'text-gray-500 hover:text-[#112320]'}`}>
                    <TabIcon size={16} />{tab.label}
                </button>
            )
        })}
      </div>

      <div className="py-4 w-full">
          <div className="w-full max-w-2xl mx-auto md:mx-0">
            {activeTab === 'PROFILE' && (
                <Card className="p-6 space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-[#112320]">Información Personal</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <Input label="Nombre Completo" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                    <Input label="Email" value={email || ''} disabled className="bg-gray-50 text-gray-500" />
                    <Input label="Teléfono" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    
                    <div className="pt-4 flex justify-end">
                        <Button type="submit">Guardar Cambios</Button>
                    </div>
                </form>
                </Card>
            )}

            {activeTab === 'SECURITY' && (
                <Card className="p-6 space-y-6 h-fit animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-[#112320]">Seguridad</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <Input type="password" label="Contraseña Actual" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
                    <Input type="password" label="Nueva Contraseña" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
                    <Input type="password" label="Confirmar Nueva Contraseña" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
                    
                    <div className="pt-4 flex justify-end">
                        <Button type="submit" variant="secondary">Actualizar Contraseña</Button>
                    </div>
                </form>
                </Card>
            )}

            {activeTab === 'NOTIFICATIONS' && (
                 <Card className="p-6 space-y-6 animate-in fade-in duration-300">
                    <h2 className="text-xl font-bold text-[#112320]">Configuración de Notificaciones</h2>
                    <p className="text-gray-500 text-sm">Elige qué alertas deseas recibir en tu correo electrónico.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-2xl">
                             <div>
                                 <h4 className="font-bold text-[#112320]">Nueva Reserva</h4>
                                 <p className="text-sm text-gray-500">Recibir un mail cuando se cree una reserva.</p>
                             </div>
                             <Switch checked={notificationSettings.newReservation} onChange={() => handleNotificationChange('newReservation')} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-2xl">
                             <div>
                                 <h4 className="font-bold text-[#112320]">Reserva Cancelada</h4>
                                 <p className="text-sm text-gray-500">Recibir un mail cuando se cancele una reserva.</p>
                             </div>
                             <Switch checked={notificationSettings.cancelledReservation} onChange={() => handleNotificationChange('cancelledReservation')} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-2xl">
                             <div>
                                 <h4 className="font-bold text-[#112320]">Reserva Modificada</h4>
                                 <p className="text-sm text-gray-500">Recibir un mail cuando se edite una reserva.</p>
                             </div>
                             <Switch checked={notificationSettings.modifiedReservation} onChange={() => handleNotificationChange('modifiedReservation')} />
                        </div>
                    </div>
                 </Card>
            )}
          </div>
      </div>
    </div>
  );
};

const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const faqs = [
        { id: '1', category: 'Reservas', question: '¿Cómo creo una nueva reserva?', answer: 'Ve a la sección "Reservas", selecciona el horario disponible en el calendario o haz clic en "Nueva Reserva" en la parte superior derecha. Completa los datos del cliente y la cancha.' },
        { id: '2', category: 'Reservas', question: '¿Cómo cancelo una reserva?', answer: 'Haz clic sobre la reserva en el calendario o en la lista de historial, selecciona "Ver Detalles" y luego "Cancelar Reserva". Deberás indicar el motivo.' },
        { id: '3', category: 'Reservas', question: '¿Qué significan los colores de las reservas?', answer: 'Verde Oscuro: Normal, Azul: Fijo/Abonado, Violeta: Clase/Escuela, Naranja: Torneo, Rosa: Cumpleaños. El borde amarillo indica Pendiente y el borde rojo Cancelada.' },
        { id: '4', category: 'Canchas', question: '¿Cómo agrego una nueva cancha?', answer: 'Ve a "Canchas", haz clic en "Agregar Cancha" y completa el formulario con el nombre, deporte, superficie y atributos como iluminación o techo.' },
        { id: '5', category: 'Canchas', question: '¿Puedo eliminar una cancha?', answer: 'Sí, desde la tabla de canchas puedes hacer clic en el botón de eliminar (ícono de basura). Ten en cuenta que esto podría afectar el historial de reportes.' },
        { id: '6', category: 'Clientes', question: '¿Se crean clientes automáticamente?', answer: 'Sí, al crear una reserva, si ingresas un nombre de cliente que no existe en la base de datos, el sistema te ofrecerá crearlo automáticamente.' },
        { id: '7', category: 'Mi Club', question: '¿Cómo cambio el logo de mi club?', answer: 'Ve a "Mi Club", selecciona la pestaña "Apariencia" y haz clic en el área de "Subir Logo". Selecciona una imagen de tu dispositivo.' },
        { id: '8', category: 'Usuarios', question: '¿Cómo restablezco la contraseña de un usuario?', answer: 'Como administrador, puedes editar al usuario y asignarle una nueva contraseña temporal, o el usuario puede cambiarla desde su perfil en "Seguridad".' },
    ];

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
        if (!acc[faq.category]) acc[faq.category] = [];
        acc[faq.category].push(faq);
        return acc;
    }, {} as Record<string, typeof faqs>);

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto w-full pb-20">
             <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-[#112320]">Centro de Ayuda</h1>
                <p className="text-gray-500">Encuentra respuestas a las preguntas más frecuentes.</p>
            </div>

            <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por palabra clave..." 
                    className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-full focus:outline-none focus:border-[#1B3530] focus:ring-1 focus:ring-[#1B3530] text-base bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="max-w-3xl space-y-8">
                {Object.keys(groupedFaqs).length > 0 ? (
                    Object.keys(groupedFaqs).map(category => (
                        <div key={category} className="space-y-3">
                            <h3 className="text-lg font-bold text-[#1B3530] border-b border-gray-100 pb-2 mb-4">{category}</h3>
                            <div className="grid gap-3">
                                {groupedFaqs[category].map(faq => {
                                    const isExpanded = expandedIds.includes(faq.id);
                                    return (
                                        <div key={faq.id} className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 hover:border-gray-300">
                                            <button 
                                                onClick={() => toggleExpand(faq.id)}
                                                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                                            >
                                                <span className="font-semibold text-[#112320]">{faq.question}</span>
                                                {isExpanded ? <ChevronDown className="text-gray-400 rotate-180 transition-transform" /> : <ChevronDown className="text-gray-400 transition-transform" />}
                                            </button>
                                            <div className={`px-6 text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <p className="leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No se encontraron resultados para "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  // App State
  const [session, setSession] = useState<any>(null);
  const [availableClubs, setAvailableClubs] = useState<any[]>([]);
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Data State
  const [usersDb, setUsersDb] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [clubConfig, setClubConfig] = useState<any>(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{message: string, type: 'success' | 'error' | 'info', isOpen: boolean}>({
      message: '', type: 'success', isOpen: false
  });

  const showFeedback = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setSnackbar({ message, type, isOpen: true });
  };
  const closeSnackbar = () => { setSnackbar(prev => ({ ...prev, isOpen: false })); };

  // --- Auth & Initial Load Logic ---

  useEffect(() => {
      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          if (session) {
              fetchClubs(session.user.id);
              fetchUserProfile(session.user.id);
          }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (session) {
              fetchClubs(session.user.id);
              fetchUserProfile(session.user.id);
          } else {
              // Reset state on logout
              setAvailableClubs([]);
              setSelectedClub(null);
              setUserProfile(null);
              setReservations([]);
              setCourts([]);
          }
      });

      return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
          setUserProfile(data);
      }
  };

  const fetchClubs = async (userId: string) => {
      try {
          const { data, error } = await supabase
              .from('club_members')
              .select(`
                  role,
                  status,
                  club_id,
                  club:club_settings (*)
              `)
              .eq('user_id', userId);

          if (error) throw error;
          
          if (data && data.length > 0) {
              // Filter out clubs where the user status is not ACTIVE
              const activeClubs = data.filter((member: any) => member.status === 'ACTIVE');
              setAvailableClubs(activeClubs);
          } else {
              setAvailableClubs([]);
          }
      } catch (error) {
          console.error('Error fetching clubs:', error);
      }
  };

  const handleLogin = async (email: string, pass: string) => {
      setLoading(true);
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: pass,
      });

      if (error) {
          setAuthError(error.message);
          setLoading(false);
      } else {
          setLoading(false);
      }
  };

  const handleSelectClub = (clubData: any) => {
      setSelectedClub(clubData);
      // Fetch all data for this club
      fetchData(clubData.id);
  };

  const fetchData = async (clubId: string) => {
      setLoading(true);
      try {
          // 1. Fetch Club Settings
          const { data: clubData } = await supabase.from('club_settings').select('*').eq('id', clubId).single();
          if (clubData) setClubConfig(clubData);

          // 2. Fetch Courts
          const { data: courtsData } = await supabase.from('courts').select('*').eq('club_id', clubId);
          if (courtsData) setCourts(courtsData);

          // 3. Fetch Reservations
          const { data: resData } = await supabase.from('reservations').select('*').eq('club_id', clubId);
          if (resData) setReservations(resData as unknown as Reservation[]);

          // 4. Fetch Clients
          const { data: clientData } = await supabase.from('clients').select('*').eq('club_id', clubId);
          if (clientData) setClients(clientData);

          // 5. Fetch Inventory
          const { data: invData } = await supabase.from('products').select('*').eq('club_id', clubId);
          if (invData) setInventory(invData);

          // 6. Fetch Users (Members of this club)
          const { data: membersData } = await supabase
              .from('club_members')
              .select('user_id, role, status')
              .eq('club_id', clubId);
          
          if (membersData && membersData.length > 0) {
              const userIds = membersData.map(m => m.user_id);
              
              const { data: profilesData } = await supabase
                  .from('profiles')
                  .select('*')
                  .in('id', userIds);
                  
              if (profilesData) {
                  const mappedUsers = profilesData.map(profile => {
                      const memberInfo = membersData.find(m => m.user_id === profile.id);
                      return {
                          id: profile.id,
                          name: profile.name || profile.email,
                          email: profile.email,
                          role: memberInfo?.role || 'RECEPTIONIST',
                          status: memberInfo?.status || 'ACTIVE'
                      }
                  });
                  setUsersDb(mappedUsers as User[]);
              }
          } else {
              setUsersDb([]);
          }

          // 7. Fetch Reviews
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('*, client:clients(name)') // Hacemos el join con la tabla clients
                .eq('club_id', clubId);

            if (reviewsData) {
                // Mapeamos para "aplanar" el nombre del cliente y facilitar su uso
                setReviews(reviewsData.map((r: any) => ({
                    ...r,
                    clientName: r.client?.name || 'Cliente Anónimo' 
                })));
            } else {
                setReviews([]);
            }

      } catch (error) {
          console.error("Error loading club data", error);
          showFeedback("Error cargando datos del club", 'error');
      } finally {
          setLoading(false);
      }
  };

  const handleLogout = async () => { 
      setActiveSheet('LOGOUT_CONFIRMATION'); 
  };
  
  const confirmLogout = async () => { 
      await supabase.auth.signOut();
      setActiveSheet(null); 
  };

  // --- Data Mutation Handlers ---
  
  const handleUpdateProfile = async (data: any) => { 
      if (!session) return;
      const { error } = await supabase
        .from('profiles')
        .update({ name: data.full_name, phone: data.phone })
        .eq('id', session.user.id);
        
      if (!error) {
          setUserProfile((prev: any) => ({ ...prev, name: data.full_name, phone: data.phone }));
          showFeedback('Perfil actualizado');
      } else {
          showFeedback('Error al actualizar perfil', 'error');
      }
  };
  
  const handleUpdatePassword = async (pass: string) => { 
      const { error } = await supabase.auth.updateUser({ password: pass });
      if (error) showFeedback('Error al actualizar', 'error');
      else showFeedback('Contraseña actualizada correctamente'); 
  };

  const handleUpdateNotifications = async (settings: any) => {
      if (!session) return;
      const { error } = await supabase
        .from('profiles')
        .update({ notification_settings: settings })
        .eq('id', session.user.id);
      
      if (!error) {
          setUserProfile((prev: any) => ({ ...prev, notification_settings: settings }));
          // Optional: showFeedback('Notificaciones actualizadas');
      } else {
          showFeedback('Error al guardar notificaciones', 'error');
      }
  };

  const handleUpdateClub = async (newData: any) => { 
      if (!selectedClub) return;
      const { error } = await supabase.from('club_settings').update(newData).eq('id', selectedClub.id);
      if (error) {
          console.error(error);
          showFeedback('Error al actualizar club', 'error');
      } else {
          setClubConfig((prev: any) => ({ ...prev, ...newData })); 
          // Sync Selected Club Header
          setSelectedClub((prev: any) => ({ ...prev, ...newData }));
          // Sync Selection List
          setAvailableClubs((prev) => prev.map(c => 
            c.club_id === selectedClub.id ? { ...c, club: { ...c.club, ...newData } } : c
          ));
          showFeedback('Información del club actualizada'); 
      }
  };

  // Reviews Mock (Not connected to DB yet as per SQL)
  const [reviews, setReviews] = useState([]);

  // Sheets State
  const [activeSheet, setActiveSheet] = useState<null | 'RESERVATION' | 'COURT' | 'USER' | 'CLIENT' | 'VIEW_CLIENT' | 'PRODUCT' | 'VIEW_RESERVATION' | 'EXPORT_OPTIONS' | 'IMPORT_INVENTORY' | 'DELETE_USER_CONFIRMATION' | 'DELETE_RESERVATION_CONFIRMATION' | 'REPLY_REVIEW' | 'REPORT_REVIEW' | 'LOGOUT_CONFIRMATION' | 'DELETE_COURT_CONFIRMATION' | 'DELETE_CLIENT_CONFIRMATION' | 'DELETE_PRODUCT_CONFIRMATION'>(null);
  
  // Selection State
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [courtFormTypes, setCourtFormTypes] = useState<string[]>([]);
  const [prefillReservation, setPrefillReservation] = useState<{date: string, time: string, courtId: string, clientName?: string} | null>(null);
  const [reservationForm, setReservationForm] = useState({ clientName: '', clientPhone: '', clientEmail: '', depositAmount: '', depositMethod: 'Efectivo', paymentMethod: 'Efectivo', notes: '', type: 'Normal', duration: '60', isRecurring: false, price: '4500' });
  const [cancellationReason, setCancellationReason] = useState('OTHER');
  const [cancellationOtherText, setCancellationOtherText] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [reviewActionId, setReviewActionId] = useState<string | number | null>(null);
  const [deleteCourtId, setDeleteCourtId] = useState<string | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const closeSheet = () => { setActiveSheet(null); };
  const resetReservationForm = () => { setReservationForm({ clientName: '', clientPhone: '', clientEmail: '', depositAmount: '', depositMethod: 'Efectivo', paymentMethod: 'Efectivo', notes: '', type: 'Normal', duration: '60', isRecurring: false, price: '4500' }); setPrefillReservation(null); setSelectedReservation(null); };

  // --- Specific Handlers with Supabase ---

  const handleClientNameChange = (val: string) => { setReservationForm(prev => ({ ...prev, clientName: val })); };
  const handleClientSelect = (client: any) => { setReservationForm(prev => ({ ...prev, clientName: client.name, clientPhone: client.phone, clientEmail: client.email })); };
  
  const handleSaveReservation = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      if (!selectedClub) return;

      const formCourtId = prefillReservation?.courtId || courts[0].id; 
      const formDate = prefillReservation?.date || selectedDate; 
      const formTime = prefillReservation?.time || '10:00'; 
      const endTime = `${formDate}T${(parseInt(formTime.split(':')[0]) + (parseInt(reservationForm.duration) / 60)).toString().padStart(2, '0')}:${formTime.split(':')[1]}`; 
      const creatorName = session.user.email; 
      const clientNameInput = reservationForm.clientName; 
      
      const existingClient = clients.find(c => c.name.toLowerCase() === clientNameInput.toLowerCase()); 
      
      if (!existingClient && clientNameInput.trim() !== '') { 
          const { data: newClient, error } = await supabase.from('clients').insert({
              club_id: selectedClub.id,
              name: clientNameInput,
              email: reservationForm.clientEmail,
              phone: reservationForm.clientPhone,
              "totalBookings": 1
          }).select().single();

          if (!error && newClient) {
              setClients(prev => [...prev, newClient]);
              showFeedback(`Nuevo cliente registrado`, 'info'); 
          }
      } 
      
      const reservationPayload = {
          club_id: selectedClub.id,
          "courtId": formCourtId,
          "clientName": clientNameInput,
          "startTime": `${formDate}T${formTime}`,
          "endTime": endTime,
          price: Number(reservationForm.price) || 4500,
          status: ReservationStatus.CONFIRMED,
          "createdBy": creatorName,
          "paymentMethod": reservationForm.paymentMethod,
          type: reservationForm.type,
          notes: reservationForm.notes
      };

      let error;
      if (selectedReservation) {
          const { error: err } = await supabase.from('reservations').update(reservationPayload).eq('id', selectedReservation.id);
          error = err;
          if (!err) {
              setReservations(reservations.map(r => r.id === selectedReservation.id ? { ...r, ...reservationPayload } : r));
              showFeedback('Reserva actualizada');
          }
      } else {
          const { data, error: err } = await supabase.from('reservations').insert(reservationPayload).select().single();
          error = err;
          if (!err && data) {
              setReservations([...reservations, data as unknown as Reservation]);
              showFeedback('Reserva creada exitosamente');
          }
      }
      
      if (error) showFeedback('Error al guardar reserva', 'error');
      resetReservationForm(); 
      setActiveSheet(null); 
  };

  const confirmDeleteReservation = async () => { 
      if (selectedReservation) { 
          const reason = cancellationReason === 'OTHER' ? cancellationOtherText : cancellationReason; 
          const { error } = await supabase.from('reservations').update({ 
              status: ReservationStatus.CANCELLED, 
              "cancellationReason": reason 
          }).eq('id', selectedReservation.id);

          if (!error) {
               setReservations(reservations.map(r => r.id === selectedReservation.id ? { ...r, status: ReservationStatus.CANCELLED, cancellationReason: reason } : r)); 
               showFeedback('Reserva cancelada', 'error'); 
          } else {
              showFeedback('Error al cancelar', 'error');
          }
      } 
      resetReservationForm(); 
      setActiveSheet(null); 
  };

  const handleSaveCourt = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      if (!selectedClub) return;

      const formData = new FormData(e.target as HTMLFormElement); 
      const courtPayload = {
          club_id: selectedClub.id,
          name: formData.get('name') as string,
          types: courtFormTypes,
          surface: formData.get('surface') as string,
          "isIndoor": formData.get('isIndoor') === 'on',
          "hasLighting": formData.get('hasLighting') === 'on',
          "forceStart": (formData.get('forceStart') as ForceStartOption) || 'NO_ROUNDING'
      };

      if (selectedCourt) { 
          const { error } = await supabase.from('courts').update(courtPayload).eq('id', selectedCourt.id);
          if (!error) {
               setCourts(courts.map(c => c.id === selectedCourt.id ? { ...c, ...courtPayload } : c)); 
               showFeedback('Cancha actualizada'); 
          }
      } else { 
          const { data, error } = await supabase.from('courts').insert(courtPayload).select().single();
          if (!error && data) {
              setCourts([...courts, data]); 
              showFeedback('Cancha creada'); 
          }
      } 
      setSelectedCourt(null); 
      setActiveSheet(null); 
  };

  const confirmDeleteCourt = async () => { 
      if (deleteCourtId) { 
          const { error } = await supabase.from('courts').delete().eq('id', deleteCourtId);
          if (!error) {
              setCourts(courts.filter(c => c.id !== deleteCourtId)); 
              showFeedback('Cancha eliminada', 'error'); 
          }
      } 
      setDeleteCourtId(null); 
      setActiveSheet(null); 
  };

  const handleSaveClient = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      if (!selectedClub) return;

      const formData = new FormData(e.target as HTMLFormElement); 
      const clientPayload = {
          club_id: selectedClub.id,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
      };

      if (selectedClient) { 
           const { error } = await supabase.from('clients').update(clientPayload).eq('id', selectedClient.id);
           if (!error) {
                setClients(clients.map(c => c.id === selectedClient.id ? { ...c, ...clientPayload } : c)); 
                showFeedback('Cliente actualizado'); 
           }
      } else { 
           const { data, error } = await supabase.from('clients').insert(clientPayload).select().single();
           if (!error && data) {
               setClients([...clients, data]); 
               showFeedback('Cliente registrado'); 
           }
      } 
      setSelectedClient(null); 
      setActiveSheet(null); 
  };

  const confirmDeleteClient = async () => { 
      if (deleteClientId) { 
          const { error } = await supabase.from('clients').delete().eq('id', deleteClientId);
          if (!error) {
              setClients(clients.filter(c => c.id !== deleteClientId)); 
              showFeedback('Cliente eliminado', 'error'); 
          }
      } 
      setDeleteClientId(null); 
      setActiveSheet(null); 
  };

  const handleSaveProduct = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      if (!selectedClub) return;

      const formData = new FormData(e.target as HTMLFormElement); 
      const prodPayload = {
          club_id: selectedClub.id,
          code: formData.get('code') as string,
          name: formData.get('name') as string,
          "purchasePrice": Number(formData.get('purchasePrice')),
          "salePrice": Number(formData.get('salePrice')),
          type: formData.get('type') as string,
          stock: Number(formData.get('stock')),
          "showInStock": true,
          active: true,
          "lastModified": new Date().toISOString()
      };

      if(selectedProduct) { 
          const { error } = await supabase.from('products').update(prodPayload).eq('id', selectedProduct.id);
          if(!error) {
             setInventory(inventory.map(p => p.id === selectedProduct.id ? { ...p, ...prodPayload } : p)); 
             showFeedback('Producto actualizado'); 
          }
      } else { 
          const { data, error } = await supabase.from('products').insert(prodPayload).select().single();
          if (!error && data) {
             setInventory([...inventory, data]); 
             showFeedback('Producto creado'); 
          }
      } 
      setSelectedProduct(null); 
      setActiveSheet(null); 
  };

  const confirmDeleteProduct = async () => { 
      if (deleteProductId) { 
          const { error } = await supabase.from('products').delete().eq('id', deleteProductId);
          if (!error) {
              setInventory(inventory.filter(p => p.id !== deleteProductId)); 
              showFeedback('Producto eliminado', 'error'); 
          }
      } 
      setDeleteProductId(null); 
      setActiveSheet(null); 
  };

const handleSaveReply = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!reviewActionId) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const replyText = formData.get('replyText') as string;
    const replyDate = new Date().toISOString();

    const { error } = await supabase
        .from('reviews')
        .update({ 
            reply_comment: replyText,
            reply_at: replyDate
        })
        .eq('id', reviewActionId);

    if (!error) {
        setReviews(reviews.map(r => r.id === reviewActionId ? { ...r, reply_comment: replyText, reply_at: replyDate } : r));
        showFeedback('Respuesta enviada correctamente'); 
    } else {
        console.error(error); // Agrega esto para ver el error real en la consola del navegador
        showFeedback('Error al enviar respuesta', 'error');
    }
    setActiveSheet(null); 
};

const handleSaveReport = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!reviewActionId) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const reportReason = formData.get('reportReason') as string;

    const { error } = await supabase
        .from('reviews')
        .update({ 
            report_reason: reportReason 
        })
        .eq('id', reviewActionId);

    if (!error) {
        // Actualizar estado local
        setReviews(reviews.map(r => r.id === reviewActionId ? { ...r, report_reason: reportReason } : r));
        showFeedback('Reseña reportada correctamente'); 
    } else {
        showFeedback('Error al reportar reseña', 'error');
    }
    setActiveSheet(null); 
}; 

  // Other utility functions
  const openBookClient = (client: Client) => { setPrefillReservation({ date: selectedDate, time: '10:00', courtId: courts[0].id, clientName: client.name }); setReservationForm(prev => ({...prev, clientName: client.name, clientPhone: client.phone, clientEmail: client.email})); setActiveSheet('RESERVATION'); };
  const handleExport = (format: string) => { showFeedback(`Exportando reporte en formato ${format}...`, 'info'); setActiveSheet(null); };
  
  const handleEditReservation = () => { 
      if (!selectedReservation) return; 
      const startDate = new Date(selectedReservation.startTime); 
      const endDate = new Date(selectedReservation.endTime); 
      const duration = (endDate.getTime() - startDate.getTime()) / 60000; 
      setPrefillReservation({ date: selectedReservation.startTime.split('T')[0], time: selectedReservation.startTime.split('T')[1].substring(0, 5), courtId: selectedReservation.courtId, clientName: selectedReservation.clientName }); 
      setReservationForm({ clientName: selectedReservation.clientName, clientPhone: '', clientEmail: '', depositAmount: '', depositMethod: 'Efectivo', paymentMethod: selectedReservation.paymentMethod || 'Efectivo', notes: (selectedReservation as any).notes || '', type: (selectedReservation as any).type || 'Normal', duration: duration.toString(), isRecurring: false, price: selectedReservation.price.toString() }); 
      setActiveSheet('RESERVATION'); 
  };

  const handleToggleUserStatus = async (user: User) => {
    if (user.role === 'OWNER') {
        showFeedback('No se puede desactivar al dueño', 'error');
        return;
    }
    
    if (!selectedClub) return;

    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const { error } = await supabase
        .from('club_members')
        .update({ status: newStatus })
        .eq('user_id', user.id)
        .eq('club_id', selectedClub.id);

    if (error) {
        console.error('Error updating status:', error);
        showFeedback('Error al actualizar estado', 'error');
    } else {
        setUsersDb(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        showFeedback(`Usuario ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} correcamente`);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      // User creation involves Auth API + Club Members table, complex flow for simple example
      showFeedback('Para agregar usuarios, invítalos desde el panel de Supabase Auth (simulado)', 'info');
      setActiveSheet(null); 
  };
  
  const initiateDeleteReservation = () => { setCancellationReason('OTHER'); setCancellationOtherText(''); setActiveSheet('DELETE_RESERVATION_CONFIRMATION'); };
  const initiateDeleteUser = (id: string) => { setDeleteUserId(id); setActiveSheet('DELETE_USER_CONFIRMATION'); };
  const confirmDeleteUser = () => { showFeedback('Usuario eliminado (Simulado)', 'error'); setActiveSheet(null); };

  // Role Logic
  const role = availableClubs.find(c => c.club_id === selectedClub?.id)?.role;
  const userDisplay = { 
      name: userProfile?.name || session?.user?.email?.split('@')[0] || 'Usuario', 
      role: role || 'RECEPTIONIST',
      email: session?.user?.email,
      phone: userProfile?.phone
  };
  const canAccessFullApp = role === 'OWNER' || role === 'ADMIN';

  // --- Main Render Flow ---

  if (!session) {
      return (
          <HashRouter>
            <Routes>
               <Route path="*" element={<LoginPage onLogin={handleLogin} loading={loading} error={authError} />} />
            </Routes>
          </HashRouter>
      );
  }

  if (!selectedClub) {
      return (
          <ClubSelectionPage 
             clubs={availableClubs} 
             onSelectClub={handleSelectClub} 
             onLogout={confirmLogout}
             userName={userProfile?.name || session.user.email?.split('@')[0]}
          />
      );
  }

  return (
    <HashRouter>
      <Snackbar message={snackbar.message} type={snackbar.type} isOpen={snackbar.isOpen} onClose={closeSnackbar} />
      <div className="flex bg-[#FFFFFF] min-h-screen">
        <Sidebar onLogout={handleLogout} onChangeClub={() => setSelectedClub(null)} user={userDisplay} />
        <main className="flex-1 h-screen overflow-hidden">
            <Routes>
              <Route path="/" element={<ReservasPage courts={courts} reservations={reservations} selectedDate={selectedDate} onDateChange={setSelectedDate} schedule={clubConfig?.schedule || []} onAddReservation={(date, time, courtId) => { resetReservationForm(); setPrefillReservation({ date: date || selectedDate, time: time || '09:00', courtId: courtId || courts[0].id }); setActiveSheet('RESERVATION'); }} onSelectReservation={(res) => { setSelectedReservation(res); setActiveSheet('VIEW_RESERVATION'); }} userRole={userDisplay.role} loading={loading} />} />
              <Route path="/profile" element={
                <UserProfilePage 
                  user={{...userDisplay, notification_settings: userProfile?.notification_settings}} 
                  email={session?.user?.email} 
                  onUpdateProfile={handleUpdateProfile} 
                  onUpdatePassword={handleUpdatePassword} 
                  onUpdateNotifications={handleUpdateNotifications}
                  loading={loading}
                />
              } />
              <Route path="/help" element={<HelpPage />} />
              {canAccessFullApp ? (
                <>
                    <Route path="/courts" element={<CourtsPage courts={courts} onAddCourt={() => { setSelectedCourt(null); setCourtFormTypes([]); setActiveSheet('COURT'); }} onEditCourt={(c) => { setSelectedCourt(c); setCourtFormTypes(c.types); setActiveSheet('COURT'); }} onDeleteCourt={(id) => { setDeleteCourtId(id); setActiveSheet('DELETE_COURT_CONFIRMATION'); }} loading={loading} />} />
                    <Route path="/clients" element={<ClientsPage clients={clients} onAddClient={() => { setSelectedClient(null); setActiveSheet('CLIENT'); }} onEditClient={(c) => { setSelectedClient(c); setActiveSheet('CLIENT'); }} loading={loading} />} />
                    <Route path="/inventory" element={<InventoryPage inventory={inventory} onAddProduct={() => { setSelectedProduct(null); setActiveSheet('PRODUCT'); }} onEditProduct={(p) => { setSelectedProduct(p); setActiveSheet('PRODUCT'); }} onDeleteProduct={(id) => { setDeleteProductId(id); setActiveSheet('DELETE_PRODUCT_CONFIRMATION'); }} onImport={() => setActiveSheet('IMPORT_INVENTORY')} loading={loading} />} />
                    <Route path="/reports" element={<ReportsPage onExport={() => setActiveSheet('EXPORT_OPTIONS')} reservations={reservations} loading={loading} />} />
                    <Route path="/my-club" element={<MyClubPage users={usersDb} onAddUser={() => { setSelectedUser(null); setActiveSheet('USER'); }} onEditUser={(u) => { setSelectedUser(u); setActiveSheet('USER'); }} onToggleStatus={handleToggleUserStatus} onDeleteUser={(id) => initiateDeleteUser(id)} reviews={reviews} clubConfig={clubConfig} onUpdateClub={handleUpdateClub} onReplyReview={(id) => { setReviewActionId(id); setActiveSheet('REPLY_REVIEW'); }} onReportReview={(id) => { setReviewActionId(id); setActiveSheet('REPORT_REVIEW'); }} selectedClub={selectedClub} onChangeClub={() => setSelectedClub(null)} loading={loading} courts={courts} />} />
                </>
              ) : ( <Route path="*" element={<Navigate to="/" />} /> )}
            </Routes>
        </main>

        {/* --- All SideSheets and Modals --- */}
        {/* Same SideSheets as before */}
        
        <SideSheet isOpen={activeSheet === 'RESERVATION'} onClose={closeSheet} title={selectedReservation ? "Editar Reserva" : "Nueva Reserva"}>
            <form className="space-y-6" onSubmit={handleSaveReservation}>
               <div className="space-y-4">
                   <AutocompleteInput label="Nombre del Cliente" placeholder="Buscar o escribir nombre..." value={reservationForm.clientName} onChange={handleClientNameChange} suggestions={clients} onSelect={handleClientSelect} required />
                   <div className="grid grid-cols-2 gap-4"><Input label="Teléfono" placeholder="+54..." value={reservationForm.clientPhone} onChange={e => setReservationForm({...reservationForm, clientPhone: e.target.value})} /><Input label="Email" placeholder="cliente@email.com" value={reservationForm.clientEmail} onChange={e => setReservationForm({...reservationForm, clientEmail: e.target.value})} /></div>
               </div>
               <div className="space-y-4 pt-4 border-t border-gray-100">
                   <Select label="Cancha" defaultValue={prefillReservation?.courtId} onChange={(e) => setPrefillReservation(prev => prev ? {...prev, courtId: e.target.value} : null)}>{courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
                   <div className="grid grid-cols-2 gap-4"><Input type="date" label="Fecha" value={prefillReservation?.date} onChange={(e) => setPrefillReservation(prev => prev ? {...prev, date: e.target.value} : null)} /><Input type="time" label="Hora" value={prefillReservation?.time} onChange={(e) => setPrefillReservation(prev => prev ? {...prev, time: e.target.value} : null)} /></div>
                   <Select label="Duración" value={reservationForm.duration} onChange={(e) => setReservationForm({...reservationForm, duration: e.target.value})}><option value="60">1 Hora</option><option value="90">1 Hora 30 min</option><option value="120">2 Horas</option></Select>
                   <Select label="Tipo de Reserva" value={reservationForm.type} onChange={(e) => setReservationForm({...reservationForm, type: e.target.value})}>{Object.keys(RESERVATION_META).map(key => (<option key={key} value={key}>{RESERVATION_META[key].label}</option>))}</Select>
               </div>
               <div className="space-y-4 pt-4 border-t border-gray-100"><Input label="Precio" type="number" icon={DollarSign} value={reservationForm.price} onChange={e => setReservationForm({...reservationForm, price: e.target.value})} required disabled /><Select label="Método de Pago" value={reservationForm.paymentMethod} onChange={(e) => setReservationForm({...reservationForm, paymentMethod: e.target.value})}><option value="Efectivo">Efectivo</option><option value="Mercado Pago">Mercado Pago</option><option value="Tarjeta Débito">Tarjeta Débito</option><option value="Tarjeta Crédito">Tarjeta Crédito</option></Select><Input label="Seña (Opcional)" placeholder="$ 0.00" icon={DollarSign} value={reservationForm.depositAmount} onChange={e => setReservationForm({...reservationForm, depositAmount: e.target.value})} /><Textarea label="Notas" placeholder="Comentarios adicionales..." value={reservationForm.notes} onChange={e => setReservationForm({...reservationForm, notes: e.target.value})} /></div>
               <div className="pt-6 flex gap-3"><Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button><Button type="submit" className="flex-1">Confirmar Reserva</Button></div>
            </form>
        </SideSheet>
         <SideSheet isOpen={activeSheet === 'VIEW_RESERVATION'} onClose={closeSheet} title="Detalle de Reserva">
            {selectedReservation && (
                <div className="space-y-6">
                     <div className="bg-[#F8F8F8] p-4 rounded-2xl flex items-center justify-between"><div><p className="text-xs text-gray-500 font-bold uppercase">Estado</p><Badge color={selectedReservation.status === 'Confirmed' ? 'green' : selectedReservation.status === 'Cancelled' ? 'red' : 'yellow'}>{selectedReservation.status === 'Cancelled' ? 'Cancelada' : selectedReservation.status}</Badge></div><div className="text-right"><p className="text-xs text-gray-500 font-bold uppercase">Precio Total</p><p className="text-2xl font-bold text-[#1B3530]">${selectedReservation.price}</p></div></div>
                     <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-gray-500">Fecha</p><p className="font-bold text-[#112320]">{new Date(selectedReservation.startTime).toLocaleDateString()}</p></div><div><p className="text-sm text-gray-500">Horario</p><p className="font-bold text-[#112320]">{selectedReservation.startTime.split('T')[1].substring(0, 5)} - {selectedReservation.endTime.split('T')[1].substring(0, 5)}</p></div></div><div><p className="text-sm text-gray-500">Cancha</p><p className="font-bold text-[#112320]">{courts.find(c => c.id === selectedReservation.courtId)?.name}</p></div><div><p className="text-sm text-gray-500">Cliente</p><p className="font-bold text-[#112320]">{selectedReservation.clientName}</p></div><div><p className="text-sm text-gray-500">Tipo</p><Badge color="gray">{RESERVATION_META[(selectedReservation as any).type || 'Normal']?.label || (selectedReservation as any).type || 'Normal'}</Badge></div><div><p className="text-sm text-gray-500">Creado Por</p><p className="font-bold text-[#112320]">{selectedReservation.createdBy || 'Sistema'}</p></div><div><p className="text-sm text-gray-500">Método de Pago</p><p className="font-bold text-[#112320]">{selectedReservation.paymentMethod || 'No especificado'}</p></div>{(selectedReservation as any).notes && (<div><p className="text-sm text-gray-500">Notas</p><p className="text-[#112320] italic">{(selectedReservation as any).notes}</p></div>)}{selectedReservation.status === ReservationStatus.CANCELLED && selectedReservation.cancellationReason && (<div className="bg-red-50 p-4 rounded-xl border border-red-100"><p className="text-xs font-bold text-red-600 uppercase mb-1">Motivo Cancelación</p><p className="text-sm text-gray-700">{selectedReservation.cancellationReason}</p></div>)}</div>
                     {selectedReservation.status !== ReservationStatus.CANCELLED && (<div className="pt-6 flex flex-col gap-3"><Button onClick={handleEditReservation}>Editar Reserva</Button><Button variant="destructive" onClick={initiateDeleteReservation}>Cancelar Reserva</Button></div>)}
                </div>
            )}
        </SideSheet>
         <SideSheet isOpen={activeSheet === 'COURT'} onClose={closeSheet} title={selectedCourt ? "Editar Cancha" : "Nueva Cancha"}>
            <form className="space-y-6" onSubmit={handleSaveCourt}>
                <Input name="name" label="Nombre de la Cancha" placeholder="Ej. Cancha 1" defaultValue={selectedCourt?.name} required />
                <div className="space-y-2"><MultiSelect label="Deportes" options={SPORTS_LIST} selected={courtFormTypes} onChange={setCourtFormTypes} /></div>
                <Select name="surface" label="Superficie" defaultValue={selectedCourt?.surface}>{SURFACE_LIST.map(s => <option key={s} value={s}>{s}</option>)}</Select>
                <RadioGroup label="Forzar Inicio de Turnos" name="forceStart" defaultValue={selectedCourt?.forceStart || 'NO_ROUNDING'} options={[{ label: 'No redondear (Cualquier horario)', value: 'NO_ROUNDING' }, { label: 'En punto (XX:00)', value: 'ON_HOUR' }, { label: 'Y media (XX:30)', value: 'HALF_HOUR' }]} />
                <div className="space-y-3"><label className="text-base font-medium text-[#112320]">Atributos</label><div className="flex flex-col gap-3"><Checkbox name="isIndoor" label="Techada" defaultChecked={selectedCourt?.isIndoor} /><Checkbox name="hasLighting" label="Iluminación" defaultChecked={selectedCourt?.hasLighting} /></div></div>
                <div className="pt-6 flex gap-3"><Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button><Button type="submit" className="flex-1">Guardar</Button></div>
            </form>
        </SideSheet>
         <SideSheet isOpen={activeSheet === 'CLIENT'} onClose={closeSheet} title={selectedClient ? "Editar Cliente" : "Nuevo Cliente"}>
            <form className="space-y-6" onSubmit={handleSaveClient}>
                <Input name="name" label="Nombre Completo" placeholder="Ej. Maria Gomez" defaultValue={selectedClient?.name} required />
                <Input name="phone" label="Teléfono" placeholder="+54 9 11..." defaultValue={selectedClient?.phone} required />
                <Input name="email" label="Email" type="email" placeholder="maria@email.com" defaultValue={selectedClient?.email} />
                <div className="pt-6 flex gap-3"><Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button><Button type="submit" className="flex-1">{selectedClient ? 'Actualizar Cliente' : 'Guardar Cliente'}</Button></div>
            </form>
        </SideSheet>
         <SideSheet isOpen={activeSheet === 'VIEW_CLIENT'} onClose={closeSheet} title="Detalle del Cliente">
            {selectedClient && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 bg-[#1B3530] rounded-full flex items-center justify-center text-[#C7F269] text-2xl font-bold">{selectedClient.name.substring(0,2).toUpperCase()}</div><div><h3 className="text-xl font-bold text-[#112320]">{selectedClient.name}</h3><p className="text-gray-500">{selectedClient.email}</p></div></div>
                    <div className="grid grid-cols-2 gap-4"><Card className="p-4 bg-[#F8F8F8] border-none"><p className="text-xs text-gray-500 font-bold uppercase">Reservas</p><p className="text-2xl font-bold text-[#112320]">{selectedClient.totalBookings}</p></Card><Card className="p-4 bg-[#F8F8F8] border-none"><p className="text-xs text-gray-500 font-bold uppercase">Gastado</p><p className="text-2xl font-bold text-[#1B3530]">${selectedClient.totalSpent}</p></Card></div>
                    <div className="space-y-4"><div><p className="text-sm text-gray-500">Teléfono</p><p className="font-bold text-[#112320]">{selectedClient.phone}</p></div><div><p className="text-sm text-gray-500">Última Visita</p><p className="font-bold text-[#112320]">{new Date(selectedClient.lastBooking).toLocaleDateString()}</p></div></div>
                    <div className="pt-6"><Button className="w-full" onClick={() => { openBookClient(selectedClient); }}>Nueva Reserva</Button></div>
                </div>
            )}
        </SideSheet>
        <SideSheet isOpen={activeSheet === 'PRODUCT'} onClose={closeSheet} title={selectedProduct ? "Editar Producto" : "Nuevo Producto"}>
             <form className="space-y-6" onSubmit={handleSaveProduct}>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5 w-full"><Input name="code" label="Código" placeholder="ABC-001" defaultValue={selectedProduct?.code} /></div><div className="space-y-1.5 w-full"><Input name="name" label="Nombre del Producto" placeholder="Ej. Gatorade" defaultValue={selectedProduct?.name} required /></div></div>
                <div className="grid grid-cols-2 gap-4"><Input name="purchasePrice" type="number" label="Precio Costo" icon={DollarSign} defaultValue={selectedProduct?.purchasePrice} required /><Input name="salePrice" type="number" label="Precio Venta" icon={DollarSign} defaultValue={selectedProduct?.salePrice} required /></div>
                <div className="grid grid-cols-2 gap-4"><Select name="type" label="Categoría" defaultValue={selectedProduct?.type || 'Bebidas'}><option value="Bebidas">Bebidas</option><option value="Snacks">Snacks</option><option value="Equipamiento">Equipamiento</option><option value="Indumentaria">Indumentaria</option><option value="Venta">Venta</option></Select><Input name="stock" type="number" label="Stock Inicial" defaultValue={selectedProduct?.stock} required /></div>
                <div className="pt-6 flex gap-3"><Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button><Button type="submit" className="flex-1">Guardar Producto</Button></div>
            </form>
        </SideSheet>

        <SideSheet isOpen={activeSheet === 'USER'} onClose={closeSheet} title={selectedUser ? "Editar Usuario" : "Agregar Usuario"}>
            <form className="space-y-6" onSubmit={handleSaveUser}>
                <Input label="Email" placeholder="usuario@email.com" defaultValue={selectedUser?.email} required disabled={!!selectedUser} />
                {!selectedUser && <p className="text-xs text-gray-500">Se enviará una invitación a este correo.</p>}
                <Select label="Rol" defaultValue={selectedUser?.role || 'RECEPTIONIST'}>
                    <option value="ADMIN">Encargado (Admin)</option>
                    <option value="RECEPTIONIST">Empleado (Recepción)</option>
                </Select>
                {selectedUser && (
                   <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <p className="text-sm text-yellow-800">Para cambiar la contraseña, el usuario debe hacerlo desde su perfil.</p>
                   </div>
                )}
                
                <div className="pt-6 flex flex-col gap-3">
                    <div className="flex gap-3">
                       <Button type="button" variant="ghost" onClick={closeSheet} className="flex-1">Cancelar</Button>
                       <Button type="submit" className="flex-1">{selectedUser ? 'Guardar Cambios' : 'Enviar Invitación'}</Button>
                    </div>
                    {selectedUser && selectedUser.role !== 'OWNER' && (
                        <Button type="button" variant="destructive" className="w-full mt-2" onClick={() => { closeSheet(); initiateDeleteUser(selectedUser.id); }}>
                            Eliminar Usuario
                        </Button>
                    )}
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
                    <button className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#1B3530] hover:bg-[#F8F8F8] transition-all group" onClick={() => handleExport('EXCEL')}><span className="font-bold text-[#112320]">Excel (.xlsx)</span><FileSpreadsheet className="text-green-600" /></button>
                    <button className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#1B3530] hover:bg-[#F8F8F8] transition-all group" onClick={() => handleExport('CSV')}><span className="font-bold text-[#112320]">CSV (.csv)</span><FileText className="text-blue-600" /></button>
                    <button className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#1B3530] hover:bg-[#F8F8F8] transition-all group" onClick={() => handleExport('PDF')}><span className="font-bold text-[#112320]">PDF (.pdf)</span><FileType className="text-red-600" /></button>
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
                    <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="cancelReason" value="CLIENT_CANCEL" checked={cancellationReason === 'CLIENT_CANCEL'} onChange={() => setCancellationReason('CLIENT_CANCEL')} className="accent-[#1B3530]"/><span>Cancelado por el cliente</span></label>
                    <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="cancelReason" value="WEATHER" checked={cancellationReason === 'WEATHER'} onChange={() => setCancellationReason('WEATHER')} className="accent-[#1B3530]"/><span>Condiciones climáticas</span></label>
                     <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="cancelReason" value="MAINTENANCE" checked={cancellationReason === 'MAINTENANCE'} onChange={() => setCancellationReason('MAINTENANCE')} className="accent-[#1B3530]"/><span>Mantenimiento de cancha</span></label>
                    <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="cancelReason" value="OTHER" checked={cancellationReason === 'OTHER'} onChange={() => setCancellationReason('OTHER')} className="accent-[#1B3530]"/><span>Otro motivo</span></label>
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
    </HashRouter>
  );
};

export default App;
