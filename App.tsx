import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, NavLink, Link, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Button, Card, Input, Badge, SideSheet, Select, MultiSelect, RadioGroup, Checkbox, Modal } from './components/UI';
import { MOCK_COURTS, MOCK_RESERVATIONS, TIME_SLOTS, MOCK_USERS, MOCK_INVENTORY, MOCK_CLIENTS, SPORTS_LIST, SURFACE_LIST } from './constants';
import { Court, Reservation, ReservationStatus, User, Product, CourtType, SurfaceType, ForceStartOption, Client } from './types';
import { Search, Bell, Plus, Filter, MoreHorizontal, DollarSign, MapPin, Edit2, Trash2, Check, Package, Calendar, LayoutGrid, List, Lock, Ban, ChevronRight, Zap, CloudRain, Image as ImageIcon, Link2, Clock, Map, Phone, Power, RefreshCw, TrendingUp, Users as UsersIcon, Clock as ClockIcon, Activity, User as UserIcon, Mail, Shield, Key, FileText, Sheet, FileSpreadsheet, ChevronLeft, Eye, CalendarPlus, Upload, ChevronDown, Star, MessageSquare, Flag, Download, FileType, AlertTriangle, CornerDownRight, LogIn, LogOut } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';

// --- Auth Components (Mock) ---

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-none">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#1B3530] rounded-xl flex items-center justify-center text-[#C7F269] font-bold text-xl mb-4">
            G
          </div>
          <h1 className="text-2xl font-bold text-[#112320]">Iniciar Sesión</h1>
          <p className="text-gray-500">Bienvenido a GestorClub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email" 
            type="email" 
            placeholder="tu@email.com" 
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

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-[#1B3530] font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

const RegisterPage = ({ onLogin }: { onLogin: (data: {fullName: string, email: string}) => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        onLogin({ fullName: formData.fullName, email: formData.email });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-none">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-[#112320]">Crear Cuenta</h1>
          <p className="text-gray-500">Únete a GestorClub</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            name="fullName"
            label="Nombre Completo" 
            placeholder="Juan Pérez" 
            value={formData.fullName} 
            onChange={handleChange}
            required 
            icon={UserIcon}
          />
          <Input 
            name="email"
            label="Email" 
            type="email" 
            placeholder="tu@email.com" 
            value={formData.email} 
            onChange={handleChange}
            required 
            icon={Mail}
          />
          <Input 
            name="password"
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={formData.password} 
            onChange={handleChange}
            required 
            icon={Key}
          />
          <Input 
            name="confirmPassword"
            label="Confirmar Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={formData.confirmPassword} 
            onChange={handleChange}
            required 
            icon={Key}
          />
          
          <Button type="submit" className="w-full py-3.5 mt-2" isLoading={loading}>
            Registrarse
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#1B3530] font-bold hover:underline">
              Ingresa aquí
            </Link>
          </p>
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
     
     switch(type) {
         case 'Profesor': return 'bg-blue-600 text-white';
         case 'Escuela': return 'bg-blue-600 text-white';
         case 'Torneo': return 'bg-purple-600 text-white';
         case 'Cumpleaños': return 'bg-orange-500 text-white';
         case 'Abonado': return 'bg-yellow-500 text-white';
         default: return 'bg-[#1B3530] text-[#C7F269] hover:bg-[#112320]'; // Normal
     }
  };

  // List view state
  const filteredReservationsList = viewMode === 'CALENDAR' 
      ? reservations.filter(r => r.startTime.startsWith(selectedDate))
      : [...reservations].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  
  const totalPages = Math.ceil(filteredReservationsList.length / itemsPerPage);
  const paginatedReservations = filteredReservationsList.slice((listPage - 1) * itemsPerPage, listPage * itemsPerPage);

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
                            className="absolute left-0 right-0 border-t-2 border-[#1B3530] z-20 pointer-events-none flex items-center"
                            style={{ top: `${topPercentage}%` }}
                        >
                            <div className="absolute -left-1 w-2.5 h-2.5 bg-[#1B3530] rounded-full -translate-y-1/2"></div>
                            <div className="absolute left-0 right-0 h-full bg-[#1B3530]/5"></div>
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
                   <Button variant="ghost" className="text-sm h-8" onClick={() => {}}>
                       <Download size={14} className="mr-2"/> Descargar Historial
                   </Button>
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
                                            <Badge color="gray">{(res as any).type || 'Normal'}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-base font-bold text-[#1B3530]">${res.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-semibold ${res.status === ReservationStatus.CONFIRMED ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {res.status === ReservationStatus.CONFIRMED ? 'Confirmada' : res.status}
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
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                    No hay reservas registradas.
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

// ... other components ...
const CourtsPage = ({ 
  courts, 
  onAddCourt, 
  onEditCourt 
}: { 
  courts: Court[], 
  onAddCourt: () => void, 
  onEditCourt: (c: Court) => void 
}) => {
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
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Superficie</th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Características</th>
            <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider text-right">Acciones</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {courts.map(court => (
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
                    {user.role}
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

const InventoryPage = ({ inventory, onAddProduct, onEditProduct, onImport }: { inventory: Product[], onAddProduct: () => void, onEditProduct: (p: Product) => void, onImport: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Código</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Precio Compra</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Precio Venta</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-bold text-[#112320] uppercase tracking-wider">Stock</th>
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

const ReportsPage = ({ onExport }: { onExport: () => void }) => {
  const [dateRange, setDateRange] = useState('7_DAYS');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const multiplier = dateRange === 'LAST_MONTH' ? 4 : dateRange === 'CUSTOM' ? 2 : 1;

  const revenueData = [
    { name: 'Lun', value: 120000 * multiplier },
    { name: 'Mar', value: 85000 * multiplier },
    { name: 'Mie', value: 95000 * multiplier },
    { name: 'Jue', value: 110000 * multiplier },
    { name: 'Vie', value: 150000 * multiplier },
    { name: 'Sab', value: 200000 * multiplier },
    { name: 'Dom', value: 180000 * multiplier },
  ];

  const bookingsByWeekday = [
    { name: 'Lun', value: 24 * multiplier },
    { name: 'Mar', value: 18 * multiplier },
    { name: 'Mie', value: 20 * multiplier },
    { name: 'Jue', value: 22 * multiplier },
    { name: 'Vie', value: 30 * multiplier },
    { name: 'Sab', value: 45 * multiplier },
    { name: 'Dom', value: 40 * multiplier },
  ];

  const hourlyData = Array.from({ length: 14 }, (_, i) => ({
      hour: `${i + 9}:00`,
      value: Math.floor(Math.random() * 100) * multiplier
  }));

  const customerSegments = [
    { name: 'Abonados', value: 40 },
    { name: 'Ocasionales', value: 35 },
    { name: 'Escuela', value: 15 },
    { name: 'Empresas', value: 10 },
  ];

  const COLORS = ['#1B3530', '#C7F269', '#112320', '#E5E7EB'];

  const kpis = [
      { label: 'Total Revenue', value: `$ ${(940000 * multiplier).toLocaleString()}`, change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-green-100 text-green-700' },
      { label: 'Total Bookings', value: `${199 * multiplier}`, change: '+8.2%', trend: 'up', icon: Calendar, color: 'bg-blue-100 text-blue-700' },
      { label: 'Avg. Session', value: '78m', change: '-2.4%', trend: 'down', icon: ClockIcon, color: 'bg-orange-100 text-orange-700' },
      { label: 'Utilization', value: '92%', change: '+5.3%', trend: 'up', icon: Activity, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="p-8 space-y-8 pb-20 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-[#112320]">Reportes</h1>
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
                    <option value="LAST_MONTH">Mes Anterior</option>
                    <option value="CUSTOM">Rango Manual</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                </div>
            </div>
            <Button onClick={onExport} variant="secondary"><FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
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
                                <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
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
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  const [activeTab, setActiveTab] = useState('DATOS');
  
  // Initialize local state with props, but allow editing
  const [basicInfo, setBasicInfo] = useState({ name: 'Club Central', phone: '', address: '', coords: '', status: 'ACTIVE' });
  const [schedule, setSchedule] = useState<any[]>([]);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
      if (clubConfig) {
          setBasicInfo({
              name: clubConfig.name || '',
              phone: clubConfig.phone || '',
              address: clubConfig.address || '',
              coords: clubConfig.coords || '',
              status: clubConfig.status || 'ACTIVE'
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

  const copyMondayToAll = () => {
      const monday = schedule[0];
      const newSchedule = schedule.map(day => ({
          ...day,
          open: monday.open,
          start: monday.start,
          end: monday.end
      }));
      setSchedule(newSchedule);
  };

  const handleUpdateSchedule = () => {
      onUpdateClub({ schedule });
  };

  const handleUpdateBasicInfo = () => {
      onUpdateClub(basicInfo);
  };
  
  const TABS = [
    { id: 'DATOS', label: 'Datos Básicos', icon: Map },
    { id: 'HORARIOS', label: 'Horarios', icon: Clock },
    { id: 'SERVICIOS', label: 'Servicios', icon: Check },
    { id: 'INTEGRACIONES', label: 'Integraciones', icon: Link2 },
    { id: 'APARIENCIA', label: 'Apariencia', icon: ImageIcon },
    { id: 'USUARIOS', label: 'Usuarios', icon: UsersIcon },
    { id: 'RESEÑAS', label: 'Reseñas', icon: MessageSquare },
  ];

  // Calculate review stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : 0;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as any;
  reviews.forEach(r => distribution[r.rating] = (distribution[r.rating] || 0) + 1);

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
        <div className={(activeTab === 'USUARIOS' || activeTab === 'RESEÑAS') ? 'w-full' : 'max-w-4xl'}>
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
                <div className="space-y-6 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="text-gray-400" size={20} />
                            <h3 className="text-lg font-bold text-[#112320]">Opiniones de Clientes</h3>
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
                               <p className="text-sm font-medium text-gray-500">{totalReviews} reseñas totales</p>
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
                                {reviews.map((review) => (
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
                                                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                                    <AlertTriangle size={12} className="mr-1"/> Reportado
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
                                ))}
                            </tbody>
                        </table>
                     </Card>
                </div>
            )}
            
            {activeTab === 'HORARIOS' && (
               <Card className="animate-in fade-in duration-300 space-y-6">
                 <div className="flex justify-between items-center mb-4">
                     <div>
                        <h3 className="text-lg font-bold text-[#112320]">Configuración de Horarios</h3>
                        <p className="text-gray-500 text-sm">Define los horarios de apertura y cierre.</p>
                     </div>
                     <Button variant="secondary" className="h-9 text-xs rounded-full" onClick={copyMondayToAll}>Copiar Lunes a Todos</Button>
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-base font-medium text-[#112320] block">Imagen de Portada</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#F8F8F8] transition-colors cursor-pointer group h-48">
                             <div className="w-full h-20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-gray-300">
                                <ImageIcon size={48} />
                             </div>
                             <p className="text-sm font-bold text-[#1B3530]">Subir Portada</p>
                             <p className="text-xs text-gray-400">1920x1080 px recomendado</p>
                        </div>
                    </div>
                 </div>

                 <div className="pt-4">
                     <Input label="Mensaje de Bienvenida" placeholder="¡Bienvenidos a Club Central!" />
                 </div>

                 <div className="flex justify-end pt-4 border-t border-gray-100"><Button>Guardar Apariencia</Button></div>
               </Card>
            )}
        </div>
      </div>
    </div>
  );
};

const UserProfilePage = ({ user, email, onUpdateProfile }: { user: any, email?: string, onUpdateProfile: (data: any) => void }) => {
  const [activeTab, setActiveTab] = useState('PERSONAL');
  const [formData, setFormData] = useState({
      full_name: '',
      phone: ''
  });

  useEffect(() => {
      if (user) {
          setFormData({
              full_name: user.full_name || '',
              phone: '' // Ideally fetched from profile if exists
          });
      }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateProfile(formData);
  };

  const tabs = [
    { id: 'PERSONAL', label: 'Información Personal', icon: UserIcon },
    { id: 'NOTIFICATIONS', label: 'Notificaciones', icon: Mail },
    { id: 'PASSWORD', label: 'Cambiar Contraseña', icon: Key },
    { id: 'ACCESS_CODE', label: 'Código de Acceso', icon: Shield },
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
               <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                 <UserIcon className="text-gray-400" size={20} />
                 <h3 className="text-lg font-bold text-[#112320]">Información Personal</h3>
               </div>
               <form onSubmit={handleSave} className="space-y-4">
                 <Input 
                    label="Nombre Completo" 
                    value={formData.full_name} 
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                 />
                 <Input label="Email" defaultValue={email} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
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
                <div className="space-y-4">
                  <Input label="Contraseña Actual" type="password" />
                  <Input label="Nueva Contraseña" type="password" />
                  <Input label="Confirmar Nueva Contraseña" type="password" />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                   <Button>Actualizar Contraseña</Button>
               </div>
             </Card>
          )}
           {activeTab === 'ACCESS_CODE' && (
             <Card className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold mb-4 text-[#112320]">Código de Acceso Rápido</h3>
                <p className="text-gray-500 mb-4">Este código permite a los empleados fichar su ingreso.</p>
                <div className="flex justify-center py-6">
                   <span className="text-4xl font-mono font-bold tracking-[1em] text-[#1B3530]">8291</span>
                </div>
                <div className="flex justify-center">
                   <Button variant="secondary" className="rounded-full"><RefreshCw size={16} className="mr-2"/> Generar Nuevo</Button>
                </div>
             </Card>
          )}
      </div>
    </div>
  );
};

// --- Main Logic & State ---

const App: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [courts, setCourts] = useState<Court[]>(MOCK_COURTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [inventory, setInventory] = useState<Product[]>(MOCK_INVENTORY);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [clubConfig, setClubConfig] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock Reviews Data - Updated to show reply and report examples
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Carlos Pérez', date: '2023-10-25', rating: 5, comment: 'Excelente cancha y atención!', reply: '¡Gracias Carlos! Te esperamos pronto.', isReported: false },
    { id: 2, author: 'Ana López', date: '2023-10-20', rating: 4, comment: 'Muy buena iluminación, pero los vestuarios podrían mejorar.', reply: '', isReported: false },
    { id: 3, author: 'Marcos Diaz', date: '2023-10-15', rating: 1, comment: 'Pésimo servicio, nadie atendió el teléfono.', reply: '', isReported: true },
  ]);

  const [activeSheet, setActiveSheet] = useState<null | 'RESERVATION' | 'COURT' | 'USER' | 'CLIENT' | 'VIEW_CLIENT' | 'PRODUCT' | 'VIEW_RESERVATION' | 'EXPORT' | 'IMPORT_INVENTORY' | 'DELETE_USER_CONFIRMATION' | 'DELETE_RESERVATION_CONFIRMATION' | 'REPLY_REVIEW' | 'REPORT_REVIEW' | 'LOGOUT_CONFIRMATION'>(null);

  const handleLogin = (userData?: { fullName: string, email: string }) => {
    setIsAuthenticated(true);
    setCourts(MOCK_COURTS);
    setReservations(MOCK_RESERVATIONS);
    
    if (userData) {
      // Create profile from registration data
      const newProfile = {
        name: userData.fullName,
        role: 'OWNER',
        full_name: userData.fullName,
        email: userData.email
      };
      setUserProfile(newProfile);

      // Create new user in club
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.fullName,
        email: userData.email,
        role: 'OWNER',
        status: 'ACTIVE'
      };
      setUsers(prev => [...prev, newUser]);
    } else {
      // Default login mock
      setUserProfile({
        name: 'Juan Admin',
        role: 'OWNER',
        full_name: 'Juan Admin',
        email: 'admin@club.com'
      });
    }
  };

  const handleLogout = () => {
    setActiveSheet('LOGOUT_CONFIRMATION');
  };

  const confirmLogout = async () => {
    setIsAuthenticated(false);
    setActiveSheet(null);
    setUserProfile(null);
  };

  const handleUpdateProfile = async (data: any) => {
      setUserProfile((prev: any) => ({ ...prev, full_name: data.full_name, name: data.full_name }));
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
  ]);
  
  const [clubServices, setClubServices] = useState<string[]>(['Wi-Fi', 'Estacionamiento', 'Vestuario']);

  const handleUpdateClub = async (newData: any) => {
     if (newData.schedule) setSchedule(newData.schedule);
     if (newData.services) setClubServices(newData.services);
     // Update other config in real app
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
      notes: '',
      type: 'Normal',
      duration: '60',
      isRecurring: false
  });

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
        notes: '',
        type: 'Normal',
        duration: '60',
        isRecurring: false
    });
    setPrefillReservation(null);
    setSelectedReservation(null);
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const match = clients.find(c => c.name.toLowerCase() === val.toLowerCase());
    setReservationForm(prev => ({
        ...prev, 
        clientName: val,
        clientPhone: match ? match.phone : prev.clientPhone,
        clientEmail: match ? match.email : prev.clientEmail
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

      const reservationData: Reservation = {
        id: selectedReservation ? selectedReservation.id : Math.random().toString(36).substr(2, 9),
        courtId: formCourtId,
        clientName: reservationForm.clientName,
        startTime: `${formDate}T${formTime}`,
        endTime: endTime,
        price: 4500,
        status: ReservationStatus.CONFIRMED,
        isPaid: false,
        createdBy: creatorName,
        // @ts-ignore
        type: reservationForm.type,
        // @ts-ignore
        notes: reservationForm.notes
      };

      if (selectedReservation) {
          setReservations(reservations.map(r => r.id === selectedReservation.id ? reservationData : r));
      } else {
          setReservations([...reservations, reservationData]);
      }
      resetReservationForm();
      setActiveSheet(null);
  };
  
  const initiateDeleteReservation = () => {
      setActiveSheet('DELETE_RESERVATION_CONFIRMATION');
  };

  const confirmDeleteReservation = async () => { 
      if (selectedReservation) {
          setReservations(reservations.filter(r => r.id !== selectedReservation.id));
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
          isIndoor: true,
          hasLighting: true,
          forceStart: 'ON_HOUR'
      };

      if (selectedCourt) {
          setCourts(courts.map(c => c.id === selectedCourt.id ? courtData : c));
      } else {
          setCourts([...courts, courtData]);
      }
      setSelectedCourt(null);
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
          status: 'ACTIVE'
      };
      if (selectedUser) {
          setUsers(users.map(u => u.id === selectedUser.id ? newUser : u));
      } else {
          setUsers([...users, newUser]);
      }
      setSelectedUser(null);
      setActiveSheet(null); 
  };
  
  const initiateDeleteUser = (id: string) => { setDeleteUserId(id); setActiveSheet('DELETE_USER_CONFIRMATION'); };
  const confirmDeleteUser = () => { 
      if (deleteUserId) setUsers(users.filter(u => u.id !== deleteUserId)); 
      setActiveSheet(null); 
  };
  
  const handleSaveClient = async (e: React.FormEvent) => { 
      e.preventDefault(); 
      const formData = new FormData(e.target as HTMLFormElement);
      const newClient: Client = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          totalBookings: 0,
          totalSpent: 0,
          lastBooking: new Date().toISOString()
      };
      setClients([...clients, newClient]);
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
      } else {
          setInventory([...inventory, newProduct]);
      }
      setSelectedProduct(null);
      setActiveSheet(null); 
  };

  const handleExport = () => {
    setActiveSheet(null);
  }

  const handleReplyReview = (e: React.FormEvent) => {
      e.preventDefault();
      setActiveSheet(null);
  };

  const handleReportReview = (e: React.FormEvent) => {
      e.preventDefault();
      setActiveSheet(null);
  };
  
  const openEditUser = (user: User) => { setSelectedUser(user); setActiveSheet('USER'); };
  const openEditCourt = (court: Court) => { setSelectedCourt(court); setCourtFormTypes(court.types); setActiveSheet('COURT'); };
  const openEditProduct = (product: Product) => { setSelectedProduct(product); setActiveSheet('PRODUCT'); };
  const openViewReservation = (res: Reservation) => { setSelectedReservation(res); setActiveSheet('VIEW_RESERVATION'); };
  const openViewClient = (client: Client) => { setSelectedClient(client); setActiveSheet('VIEW_CLIENT'); };
  
  const openNewReservation = (date?: string, time?: string, courtId?: string, clientName?: string) => {
      // Default values if parameters are missing
      const d = date || selectedDate;
      const t = time || '10:00';
      const cId = courtId || courts[0]?.id;

      setPrefillReservation({ date: d, time: t, courtId: cId, clientName });
      
      setReservationForm(prev => ({
          ...prev, 
          clientName: clientName || '',
          clientPhone: '',
          clientEmail: '',
          type: 'Normal',
          notes: ''
      }));
      setSelectedReservation(null); // Ensure we are in create mode
      setActiveSheet('RESERVATION');
  };

  const openEditReservation = () => {
      if (!selectedReservation) return;
      
      const [date, timePart] = selectedReservation.startTime.split('T');
      const time = timePart.substring(0, 5);
      
      setPrefillReservation({
          date,
          time,
          courtId: selectedReservation.courtId,
          clientName: selectedReservation.clientName
      });

      setReservationForm({
          clientName: selectedReservation.clientName,
          clientPhone: '', // In a real app, fetch from client relation
          clientEmail: '',
          depositAmount: '',
          depositMethod: 'Efectivo',
          notes: (selectedReservation as any).notes || '',
          type: (selectedReservation as any).type || 'Normal',
          duration: '60', // Simplified logic for duration
          isRecurring: false
      });
      
      setActiveSheet('RESERVATION');
  };

  if (!isAuthenticated) {
    return (
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={() => handleLogin()} />} />
          <Route path="/register" element={<RegisterPage onLogin={(data) => handleLogin(data)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-white text-[#112320] font-sans font-normal text-base overflow-hidden">
        <Sidebar onLogout={handleLogout} user={userProfile} />
        <main className="flex-1 h-full overflow-hidden relative flex flex-col">
          <Routes>
            <Route path="/" element={<ReservasPage courts={courts} reservations={reservations} onAddReservation={openNewReservation} onSelectReservation={openViewReservation} selectedDate={selectedDate} onDateChange={setSelectedDate} schedule={schedule} />} />
            <Route path="/courts" element={<CourtsPage courts={courts} onAddCourt={() => { setCourtFormTypes([]); setSelectedCourt(null); setActiveSheet('COURT'); }} onEditCourt={openEditCourt} />} />
            <Route path="/clients" element={<ClientsPage clients={clients} onAddClient={() => setActiveSheet('CLIENT')} onViewClient={openViewClient} onBookClient={openBookClient} />} />
            <Route path="/my-club" element={<MyClubPage users={users} onAddUser={() => { setSelectedUser(null); setActiveSheet('USER'); }} onEditUser={openEditUser} onDeleteUser={initiateDeleteUser} reviews={reviews} clubConfig={{ name: 'Club Central', status: 'ACTIVE', ...(clubConfig || {}), schedule, services: clubServices }} onUpdateClub={handleUpdateClub} onReplyReview={(id) => { setReviewActionId(id); setActiveSheet('REPLY_REVIEW'); }} onReportReview={(id) => { setReviewActionId(id); setActiveSheet('REPORT_REVIEW'); }} />} />
            <Route path="/inventory" element={<InventoryPage inventory={inventory} onAddProduct={() => { setSelectedProduct(null); setActiveSheet('PRODUCT'); }} onEditProduct={openEditProduct} onImport={() => setActiveSheet('IMPORT_INVENTORY')} />} />
            <Route path="/reports" element={<ReportsPage onExport={() => setActiveSheet('EXPORT')} />} />
            <Route path="/profile" element={<UserProfilePage user={userProfile} email={userProfile?.email} onUpdateProfile={handleUpdateProfile} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      
      {/* SideSheets and Modals */}
      <SideSheet isOpen={activeSheet === 'RESERVATION'} onClose={closeSheet} title={selectedReservation ? "Editar Reserva" : "Nueva Reserva"}>
         <form onSubmit={handleSaveReservation} className="space-y-6 flex flex-col h-full">
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                    <Input type="date" label="Fecha" value={prefillReservation?.date || selectedDate} onChange={(e) => setPrefillReservation(prev => ({ ...prev!, date: e.target.value }))} required />
                     <Select label="Horario Inicio" value={prefillReservation?.time || '10:00'} onChange={(e) => setPrefillReservation(prev => ({ ...prev!, time: e.target.value }))}>
                        {Array.from({ length: 15 }, (_, i) => i + 9).map(h => { const t = `${h.toString().padStart(2, '0')}:00`; return <option key={t} value={t}>{t} hs</option>; })}
                     </Select>
                </div>
                <div>
                    <Select label="Cancha" value={prefillReservation?.courtId || courts[0]?.id} onChange={(e) => setPrefillReservation(prev => ({ ...prev!, courtId: e.target.value }))}>
                        {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                </div>
                <div className="space-y-4">
                    <div>
                        <Input name="clientName" label="Nombre del Cliente" placeholder="Buscar cliente..." value={reservationForm.clientName} onChange={handleClientNameChange} required list="clients-list" autoComplete="off" />
                        <datalist id="clients-list">{clients.map(c => <option key={c.id} value={c.name} />)}</datalist>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="phone" label="Teléfono" placeholder="+54..." value={reservationForm.clientPhone} onChange={(e) => setReservationForm({...reservationForm, clientPhone: e.target.value})} />
                        <Input name="email" label="Email (Opcional)" placeholder="cliente@email.com" value={reservationForm.clientEmail} onChange={(e) => setReservationForm({...reservationForm, clientEmail: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="text-base font-medium text-[#112320] block mb-1.5">Deporte</label>
                    <div className="w-full rounded-2xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-base text-gray-500 font-medium">{courts.find(c => c.id === prefillReservation?.courtId)?.types[0] || 'General'}</div>
                </div>
                <Card className="p-4 bg-[#C7F269]/20 border-[#C7F269]/50"><Checkbox label="Turno Fijo (Repetir todas las semanas)" name="isRecurring" checked={reservationForm.isRecurring} onChange={(e) => setReservationForm({...reservationForm, isRecurring: e.target.checked})} /></Card>
                <div className="grid grid-cols-2 gap-4">
                     <Select label="Tipo de Turno" name="type" value={reservationForm.type} onChange={(e) => setReservationForm({...reservationForm, type: e.target.value})}><option>Normal</option><option>Profesor</option><option>Torneo</option><option>Escuela</option><option>Cumpleaños</option><option>Abonado</option></Select>
                     <Select label="Duración" name="duration" value={reservationForm.duration} onChange={(e) => setReservationForm({...reservationForm, duration: e.target.value})}><option value="60">60 min</option><option value="90">90 min</option><option value="120">120 min</option></Select>
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                    <div><label className="text-base font-medium text-[#112320] block mb-1.5">Precio Total</label><div className="w-full rounded-2xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-base font-bold text-[#1B3530]">$4500</div></div>
                    <Input label="Seña / Adelanto" name="depositAmount" placeholder="$0.00" value={reservationForm.depositAmount} onChange={(e) => setReservationForm({...reservationForm, depositAmount: e.target.value})} />
                </div>
                {reservationForm.depositAmount && (<Select label="Medio de Pago Seña" name="depositMethod" value={reservationForm.depositMethod} onChange={(e) => setReservationForm({...reservationForm, depositMethod: e.target.value})}><option>Efectivo</option><option>Débito</option><option>Crédito</option><option>MercadoPago</option><option>Transferencia</option></Select>)}
                <div className="space-y-1.5"><label className="text-base font-medium text-[#112320]">Notas Adicionales</label><textarea className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#1B3530] focus:outline-none focus:ring-1 focus:ring-[#1B3530] transition-all resize-none h-24" placeholder="Comentarios sobre la reserva..." value={reservationForm.notes} onChange={(e) => setReservationForm({...reservationForm, notes: e.target.value})} /></div>
            </div>
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-auto bg-white"><Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button><Button type="submit">{selectedReservation ? "Guardar Cambios" : "Confirmar Reserva"}</Button></div>
         </form>
      </SideSheet>

      <SideSheet isOpen={activeSheet === 'VIEW_RESERVATION'} onClose={closeSheet} title="Detalle de Reserva">
        {selectedReservation && (
          <div className="space-y-6 flex flex-col h-full">
            <div className="bg-[#1B3530] rounded-2xl p-6 border border-[#112320] flex justify-between items-center text-white shadow-lg">
              <div>
                <p className="text-xs font-bold text-[#C7F269] uppercase tracking-wide opacity-80 mb-1">Cancha</p>
                <p className="text-xl font-bold">{courts.find(c => c.id === selectedReservation.courtId)?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#C7F269] uppercase tracking-wide opacity-80 mb-1">{new Date(selectedReservation.startTime).toLocaleDateString()}</p>
                <p className="text-xl font-bold">{selectedReservation.startTime.split('T')[1].substring(0,5)} hs</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-[#F8F8F8]"><span className="text-xs font-bold text-gray-500 uppercase">Cliente</span><p className="text-lg font-bold text-[#112320]">{selectedReservation.clientName}</p></Card>
              <Card className="p-4 bg-[#F8F8F8]"><span className="text-xs font-bold text-gray-500 uppercase">Estado</span><p className="text-lg font-bold text-[#112320]">{selectedReservation.status}</p></Card>
            </div>
            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600">Creado Por</span>
                <span className="font-bold text-[#1B3530]">{selectedReservation.createdBy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Precio</span>
                <span className="font-bold text-[#1B3530]">${selectedReservation.price}</span>
              </div>
            </Card>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-auto bg-white">
                <Button variant="secondary" onClick={openEditReservation}>Editar</Button>
                <Button variant="destructive" onClick={initiateDeleteReservation}>Eliminar</Button>
            </div>
          </div>
        )}
      </SideSheet>

      <SideSheet isOpen={activeSheet === 'COURT'} onClose={closeSheet} title={selectedCourt ? "Editar Cancha" : "Nueva Cancha"}>
           <form onSubmit={handleSaveCourt} className="space-y-6">
                <Input name="name" label="Nombre" defaultValue={selectedCourt?.name} required />
                <Select name="surface" label="Superficie" defaultValue={selectedCourt?.surface}>
                    {SURFACE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <div className="space-y-2">
                    <label className="text-base font-medium text-[#112320]">Deportes</label>
                    <div className="flex flex-wrap gap-2">
                        {SPORTS_LIST.map(sport => (
                            <div key={sport} onClick={() => {
                                if (courtFormTypes.includes(sport)) setCourtFormTypes(courtFormTypes.filter(t => t !== sport));
                                else setCourtFormTypes([...courtFormTypes, sport]);
                            }} className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium border ${courtFormTypes.includes(sport) ? 'bg-[#1B3530] text-[#C7F269] border-[#1B3530]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                {sport}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </div>
           </form>
      </SideSheet>

       <SideSheet isOpen={activeSheet === 'USER'} onClose={closeSheet} title={selectedUser ? "Editar Usuario" : "Nuevo Usuario"}>
           <form onSubmit={handleSaveUser} className="space-y-6">
                <Input name="name" label="Nombre Completo" defaultValue={selectedUser?.name} required />
                <Input name="email" label="Email" type="email" defaultValue={selectedUser?.email} required />
                <Select name="role" label="Rol" defaultValue={selectedUser?.role || 'RECEPTIONIST'}>
                    <option value="OWNER">Propietario</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="RECEPTIONIST">Recepcionista</option>
                </Select>
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </div>
           </form>
      </SideSheet>

      <SideSheet isOpen={activeSheet === 'CLIENT'} onClose={closeSheet} title="Nuevo Cliente">
           <form onSubmit={handleSaveClient} className="space-y-6">
                <Input name="name" label="Nombre Completo" required />
                <Input name="email" label="Email" type="email" required />
                <Input name="phone" label="Teléfono" required />
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </div>
           </form>
      </SideSheet>

      <SideSheet isOpen={activeSheet === 'PRODUCT'} onClose={closeSheet} title={selectedProduct ? "Editar Producto" : "Nuevo Producto"}>
           <form onSubmit={handleSaveProduct} className="space-y-6">
                <Input name="code" label="Código" defaultValue={selectedProduct?.code} />
                <Input name="name" label="Nombre" defaultValue={selectedProduct?.name} required />
                <div className="grid grid-cols-2 gap-4">
                    <Input name="purchasePrice" label="Precio Compra" type="number" defaultValue={selectedProduct?.purchasePrice} required />
                    <Input name="salePrice" label="Precio Venta" type="number" defaultValue={selectedProduct?.salePrice} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input name="stock" label="Stock Actual" type="number" defaultValue={selectedProduct?.stock} required />
                    <Select name="type" label="Categoría" defaultValue={selectedProduct?.type || 'Venta'}>
                        <option value="Venta">Venta</option>
                        <option value="Alquiler">Alquiler</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Equipamiento">Equipamiento</option>
                    </Select>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </div>
           </form>
      </SideSheet>

      <Modal isOpen={activeSheet === 'DELETE_RESERVATION_CONFIRMATION'} onClose={closeSheet} title="¿Cancelar Reserva?">
          <p className="text-gray-600 mb-6">Esta acción no se puede deshacer. ¿Estás seguro?</p>
          <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={closeSheet}>No, volver</Button>
              <Button variant="destructive" onClick={confirmDeleteReservation}>Sí, cancelar</Button>
          </div>
      </Modal>

      <Modal isOpen={activeSheet === 'DELETE_USER_CONFIRMATION'} onClose={closeSheet} title="¿Eliminar Usuario?">
          <p className="text-gray-600 mb-6">Esta acción no se puede deshacer. ¿Estás seguro?</p>
          <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={closeSheet}>No, volver</Button>
              <Button variant="destructive" onClick={confirmDeleteUser}>Sí, eliminar</Button>
          </div>
      </Modal>

      <Modal isOpen={activeSheet === 'LOGOUT_CONFIRMATION'} onClose={closeSheet} title="Cerrar Sesión">
          <p className="text-gray-600 mb-6">¿Estás seguro que deseas salir?</p>
          <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={closeSheet}>Cancelar</Button>
              <Button variant="destructive" onClick={confirmLogout}>Cerrar Sesión</Button>
          </div>
      </Modal>

    </HashRouter>
  );
};

export default App;