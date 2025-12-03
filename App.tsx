import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Button, Card, Input, Badge, SideSheet, Select } from './components/UI';
import { MOCK_COURTS, MOCK_RESERVATIONS, TIME_SLOTS, MOCK_USERS, MOCK_INVENTORY } from './constants';
import { Court, Reservation, ReservationStatus, User, Product, CourtType, SurfaceType } from './types';
import { analyzeFinancials } from './services/geminiService';
import { Search, Bell, Plus, Filter, MoreHorizontal, DollarSign, MapPin, Edit2, Trash2, Check, Package, Calendar, LayoutGrid, List } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Lottie from "lottie-react";

// --- Components ---

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  
  // Placeholder animation data structure since we cannot fetch external JSONs reliably in this env without a proxy or correct CORS. 
  // In a real app, these would be imported JSON files.
  // We use a simple visual block for the "Lottie" if data isn't provided, but here we just show the structure.
  const defaultOptions = {
    loop: true,
    autoplay: true, 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-6 py-8">
           {step === 1 && (
             <>
               <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {/* Lottie Animation Placeholder */}
                  <div className="text-center text-xs text-gray-400">Lottie Animation<br/>(Welcome)</div>
               </div>
               <h2 className="text-2xl font-medium text-gray-900">Bienvenido a GestorClub</h2>
               <p className="text-gray-500">La plataforma definitiva para administrar tu complejo deportivo de manera simple y eficiente.</p>
               <Button onClick={() => setStep(2)} className="w-full">Comenzar Configuración</Button>
             </>
           )}
           {step === 2 && (
             <>
               <div className="w-32 h-32 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                   {/* Lottie Animation Placeholder */}
                   <div className="text-center text-xs text-blue-300">Lottie Animation<br/>(Setup)</div>
               </div>
               <h2 className="text-xl font-medium text-gray-900">Personaliza tu Espacio</h2>
               <p className="text-gray-500">Configura tus horarios, carga tus canchas y define los roles de tu equipo.</p>
               <Button onClick={() => setStep(3)} className="w-full">Siguiente</Button>
             </>
           )}
           {step === 3 && (
             <>
               <div className="w-32 h-32 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                   {/* Lottie Animation Placeholder */}
                   <div className="text-center text-xs text-green-300">Lottie Animation<br/>(Success)</div>
               </div>
               <h2 className="text-xl font-medium text-gray-900">¡Todo Listo!</h2>
               <p className="text-gray-500">Ya puedes empezar a gestionar reservas y potenciar tus ingresos.</p>
               <Button onClick={onComplete} className="w-full">Ir al Dashboard</Button>
             </>
           )}
           <div className="flex justify-center gap-2 mt-4">
             <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-gray-900' : 'bg-gray-200'}`} />
             <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-gray-900' : 'bg-gray-200'}`} />
             <div className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-gray-900' : 'bg-gray-200'}`} />
           </div>
        </div>
      </Card>
    </div>
  );
};

const ReservasPage = ({ 
  courts, 
  reservations, 
  onAddReservation,
  onSelectReservation 
}: { 
  courts: Court[], 
  reservations: Reservation[], 
  onAddReservation: (date?: string, time?: string, courtId?: string) => void,
  onSelectReservation: (res: Reservation) => void
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const getReservation = (courtId: string, hour: number) => {
    return reservations.find(r => {
      const start = new Date(r.startTime).getHours();
      return r.courtId === courtId && start === hour;
    });
  };

  const handleSlotClick = (courtId: string, hour: number) => {
    const today = new Date().toISOString().split('T')[0];
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    onAddReservation(today, timeStr, courtId);
  };

  return (
    <div className="p-8 space-y-6 flex flex-col h-full overflow-hidden">
      <header className="flex justify-between items-center mb-2 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-light text-gray-900">Reservas</h1>
          <p className="text-base text-gray-500 font-light mt-1">Gestión de ocupación diaria.</p>
        </div>
        <div className="flex gap-3">
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Día
                </button>
                <button 
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Semana
                </button>
            </div>
            <Button onClick={() => onAddReservation()}><Plus className="w-4 h-4 mr-2" /> Nueva Reserva</Button>
        </div>
      </header>

      <Card className="p-0 border border-gray-200 shadow-sm bg-white flex-1 flex flex-col overflow-hidden">
        {/* Header Row (Courts) */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 flex-shrink-0">
          <div className="w-20 p-4 border-r border-gray-200 font-medium text-sm text-gray-500 uppercase tracking-wider flex items-center justify-center bg-gray-50 sticky left-0 z-20 flex-shrink-0">
            Hora
          </div>
          <div 
            className="flex-1 grid divide-x divide-gray-200"
            style={{ gridTemplateColumns: `repeat(${courts.length}, minmax(0, 1fr))` }}
          >
             {courts.map(court => (
                <div key={court.id} className="text-center py-4 px-2 flex flex-col justify-center items-center">
                  <span className="text-base font-bold text-gray-800 truncate w-full">{court.name}</span>
                  <span className="text-xs text-gray-400 font-light mt-0.5">
                     {court.isIndoor ? 'Techada' : 'Aire Libre'}
                  </span>
                </div>
             ))}
          </div>
        </div>

        {/* Scrollable Body (Time Slots) */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {TIME_SLOTS.map(hour => (
            <div key={hour} className="flex border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors min-h-[100px]">
              <div className="w-20 border-r border-gray-200 flex items-center justify-center bg-white sticky left-0 z-10 text-sm font-bold text-gray-500 flex-shrink-0">
                {hour}:00
              </div>
              <div 
                className="flex-1 grid divide-x divide-gray-100"
                style={{ gridTemplateColumns: `repeat(${courts.length}, minmax(0, 1fr))` }}
              >
                 {courts.map(court => {
                      const res = getReservation(court.id, hour);
                      return (
                        <div key={`${court.id}-${hour}`} className="relative p-1 h-full">
                          {res ? (
                            <div 
                              onClick={() => onSelectReservation(res)}
                              className={`w-full h-full rounded-md p-3 text-xs flex flex-col justify-between shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                res.status === ReservationStatus.PENDING 
                                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-900' 
                                  : 'bg-gray-900 text-white hover:bg-gray-800'
                              }`}
                            >
                              <div className="truncate font-bold text-sm">{res.clientName}</div>
                              <div className="flex justify-between items-end mt-1">
                                <span className="opacity-90 font-medium">${res.price}</span>
                                {res.isPaid && <Check size={14} className="opacity-70" />}
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => handleSlotClick(court.id, hour)}
                              className="w-full h-full rounded-md hover:bg-gray-100 cursor-pointer transition-all flex items-center justify-center group/cell"
                            >
                              <Plus className="text-gray-300 w-5 h-5 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>
                      );
                  })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const CourtsPage = ({ 
  courts, 
  onAddCourt, 
  onEditCourt 
}: { 
  courts: Court[], 
  onAddCourt: () => void, 
  onEditCourt: (c: Court) => void 
}) => {
  const [isListView, setIsListView] = useState(false);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-light text-gray-900">Canchas</h1>
           <p className="text-base text-gray-500 mt-1">Administra las instalaciones.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setIsListView(false)}
                className={`p-2 rounded-md transition-all ${!isListView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setIsListView(true)}
                className={`p-2 rounded-md transition-all ${isListView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <List size={20} />
              </button>
          </div>
          <Button onClick={onAddCourt}><Plus className="w-4 h-4 mr-2"/>Agregar Cancha</Button>
        </div>
      </div>

      {!isListView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map(court => (
            <Card key={court.id} className="hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <Badge color={court.isIndoor ? 'blue' : 'green'}>{court.isIndoor ? 'Techada' : 'Aire Libre'}</Badge>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                   <Button variant="secondary" className="p-2 h-auto" onClick={() => onEditCourt(court)}>
                      <Edit2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-1">{court.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{court.surface} • {court.types.join(', ')}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Precio Base</span>
                <span className="text-lg font-semibold text-gray-900">${court.basePrice}/hr</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Superficie</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Techada</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Precio/Hr</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courts.map(court => (
                <tr key={court.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{court.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{court.types.join(', ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{court.surface}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{court.isIndoor ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${court.basePrice}</td>
                  <td className="px-6 py-4 text-right">
                     <Button variant="secondary" className="p-2 h-9 w-9" onClick={() => onEditCourt(court)}><Edit2 size={16}/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

const MyClubPage = () => {
  return (
    <div className="p-8 space-y-8 w-full">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-light text-gray-900">Mi Club</h1>
        <p className="text-base text-gray-500 mt-1">Información pública y configuración general del complejo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">Logo del Club</label>
          <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-gray-50">
             <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
             <span className="text-sm font-medium">Click para subir</span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <Input label="Nombre del Complejo" placeholder="Ej. Club Central" defaultValue="Club Central" />
             <Input label="Teléfono" placeholder="+54 9 11..." />
          </div>
          <Input label="Dirección" placeholder="Calle, Número, Ciudad" />
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Ubicación</span>
            </div>
            <div className="h-40 bg-gray-200 rounded w-full flex items-center justify-center text-gray-400 text-sm">
              Google Maps Embed Placeholder
            </div>
          </div>

          <div>
             <label className="text-sm font-medium text-gray-700 block mb-3">Servicios Disponibles</label>
             <div className="flex flex-wrap gap-4">
               {['Wi-Fi', 'Estacionamiento', 'Vestuarios', 'Bar', 'Parrilla'].map(s => (
                 <label key={s} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                   <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-0" defaultChecked />
                   {s}
                 </label>
               ))}
             </div>
          </div>
          
          <div className="pt-6 flex justify-end">
             <Button>Guardar Cambios</Button>
          </div>
        </div>
      </div>
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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-light text-gray-900">Usuarios</h1>
            <p className="text-base text-gray-500 mt-1">Gestiona el acceso y roles del personal.</p>
         </div>
         <Button onClick={onAddUser}><Plus className="w-4 h-4 mr-2"/>Agregar Usuario</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge color={user.role === 'OWNER' ? 'blue' : user.role === 'ADMIN' ? 'gray' : 'yellow'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                     <span className="text-sm text-gray-600">{user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <Button variant="secondary" className="p-2 h-9 w-9 border-gray-200 text-gray-600 hover:text-gray-900" onClick={() => onEditUser(user)}><Edit2 size={16}/></Button>
                     <Button variant="secondary" className="p-2 h-9 w-9 border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDeleteUser(user.id)}><Trash2 size={16}/></Button>
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

const InventoryPage = ({ inventory, onAddProduct }: { inventory: Product[], onAddProduct: () => void }) => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-light text-gray-900">Inventario</h1>
            <p className="text-base text-gray-500 mt-1">Control de stock y productos.</p>
         </div>
         <Button onClick={onAddProduct}><Plus className="w-4 h-4 mr-2"/>Agregar Producto</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
         {/* Fixed text color for visibility */}
         <Card className="flex items-center gap-4 bg-gray-900 text-white border-0">
            <div className="p-3 bg-gray-800 rounded-lg"><Package className="w-6 h-6"/></div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Total Items</p>
              <p className="text-2xl font-bold text-white">{inventory.length}</p>
            </div>
         </Card>
         <Card className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Filter className="w-6 h-6"/></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Bajo Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.filter(i => i.status === 'LOW_STOCK').length}</p>
            </div>
         </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.stock} u.</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${item.price}</td>
                <td className="px-6 py-4">
                   <Badge color={item.status === 'IN_STOCK' ? 'green' : item.status === 'LOW_STOCK' ? 'yellow' : 'red'}>
                     {item.status === 'IN_STOCK' ? 'En Stock' : item.status === 'LOW_STOCK' ? 'Bajo Stock' : 'Agotado'}
                   </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <Button variant="secondary" className="p-2 h-9 w-9"><Edit2 size={16}/></Button>
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

const ReportsPage = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const data = [
    { name: 'Fútbol 5', value: 400000 },
    { name: 'Pádel', value: 300000 },
    { name: 'Bar', value: 150000 },
    { name: 'Torneos', value: 200000 },
  ];
  
  const COLORS = ['#171717', '#525252', '#A3A3A3', '#E5E5E5'];

  const handleGenerateInsight = async () => {
    setLoading(true);
    const result = await analyzeFinancials(data);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-light text-gray-900">Reportes</h1>
           <p className="text-base text-gray-500 mt-1">Métricas de rendimiento e ingresos.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary">Exportar CSV</Button>
           <Button variant="secondary">Exportar PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="col-span-1 lg:col-span-2">
            <h3 className="text-base font-medium text-gray-900 mb-6">Ingresos por Categoría</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F5F5F5'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#171717" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </Card>

         <Card>
            <h3 className="text-base font-medium text-gray-900 mb-6">Distribución</h3>
            <div className="h-[300px] w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-2xl font-light text-gray-900">1.05M</span>
              </div>
            </div>
         </Card>
      </div>

      <Card className="bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-start justify-between mb-4">
           <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
               <DollarSign className="w-5 h-5" />
             </div>
             <h3 className="font-medium text-gray-900">Análisis Inteligente (Gemini AI)</h3>
           </div>
           <Button onClick={handleGenerateInsight} disabled={loading} isLoading={loading} variant="primary">
             Generar Análisis
           </Button>
        </div>
        
        {insight ? (
          <div className="prose prose-sm max-w-none text-gray-600 font-light">
             <p className="whitespace-pre-line">{insight}</p>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic py-4">
            Haga clic en "Generar Análisis" para obtener recomendaciones estratégicas basadas en sus datos financieros actuales.
          </div>
        )}
      </Card>
    </div>
  );
}

// --- Main Logic & State ---

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // App Data State
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [courts, setCourts] = useState<Court[]>(MOCK_COURTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [inventory, setInventory] = useState<Product[]>(MOCK_INVENTORY);

  // Selection State for Edit/View
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  
  // Prefill State for New Reservation
  const [prefillReservation, setPrefillReservation] = useState<{date: string, time: string, courtId: string} | null>(null);

  // SideSheet State
  const [activeSheet, setActiveSheet] = useState<null | 'RESERVATION' | 'COURT' | 'USER' | 'PRODUCT' | 'VIEW_RESERVATION'>(null);

  const closeSheet = () => {
    setActiveSheet(null);
    // Reset selections after transition
    setTimeout(() => {
        setSelectedReservation(null);
        setSelectedUser(null);
        setSelectedCourt(null);
        setPrefillReservation(null);
    }, 300);
  };

  // --- Handlers ---

  // Reservations
  const handleSaveReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    
    // Construct simplified date/time ISOs
    const date = form.date.value;
    const time = form.time.value;
    const startIso = `${date}T${time}:00`;
    // End time + 1 hour for mock simplicity
    const endHour = parseInt(time.split(':')[0]) + 1;
    const endIso = `${date}T${endHour.toString().padStart(2, '0')}:00:00`;

    const newRes: Reservation = {
        id: Math.random().toString(36),
        courtId: form.courtId.value,
        clientName: form.clientName.value,
        startTime: startIso,
        endTime: endIso,
        price: Number(form.price.value),
        status: ReservationStatus.CONFIRMED,
        isPaid: false
    };
    setReservations([...reservations, newRes]);
    closeSheet();
  };

  const handleDeleteReservation = () => {
    if (selectedReservation) {
        setReservations(reservations.filter(r => r.id !== selectedReservation.id));
        closeSheet();
    }
  };

  // Courts
  const handleSaveCourt = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    
    if (selectedCourt) {
        // Edit
        setCourts(courts.map(c => c.id === selectedCourt.id ? {
            ...c,
            name: form.name.value,
            basePrice: Number(form.basePrice.value),
            isIndoor: form.isIndoor.checked
        } : c));
    } else {
        // Create
        const newCourt: Court = {
            id: Math.random().toString(),
            name: form.name.value,
            types: [CourtType.FUTBOL_5],
            surface: SurfaceType.SYNTHETIC,
            isIndoor: form.isIndoor.checked,
            basePrice: Number(form.basePrice.value)
        };
        setCourts([...courts, newCourt]);
    }
    closeSheet();
  };

  // Users
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;

    if (selectedUser) {
        // Edit
        setUsers(users.map(u => u.id === selectedUser.id ? {
            ...u,
            name: form.name.value,
            email: form.email.value,
            role: form.role.value
        } : u));
    } else {
        // Create
        const newUser: User = {
            id: Math.random().toString(),
            name: form.name.value,
            email: form.email.value,
            role: form.role.value,
            status: 'ACTIVE'
        };
        setUsers([...users, newUser]);
    }
    closeSheet();
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  // Products
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const newProd: Product = {
        id: Math.random().toString(),
        name: form.name.value,
        category: form.category.value,
        stock: Number(form.stock.value),
        price: Number(form.price.value),
        status: 'IN_STOCK'
    };
    setInventory([...inventory, newProd]);
    closeSheet();
  };

  // UI Triggers
  const openEditUser = (user: User) => {
    setSelectedUser(user);
    setActiveSheet('USER');
  };

  const openEditCourt = (court: Court) => {
    setSelectedCourt(court);
    setActiveSheet('COURT');
  };

  const openViewReservation = (res: Reservation) => {
    setSelectedReservation(res);
    setActiveSheet('VIEW_RESERVATION');
  };
  
  const openNewReservation = (date?: string, time?: string, courtId?: string) => {
      if (date && time && courtId) {
          setPrefillReservation({ date, time, courtId });
      }
      setActiveSheet('RESERVATION');
  };

  return (
    <HashRouter>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      
      <div className="flex min-h-screen bg-[#FAFAFA] text-gray-900 font-sans font-light text-base">
        <Sidebar />
        <main className="flex-1 overflow-auto relative flex flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-[#FAFAFA]/95 backdrop-blur-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center flex-shrink-0">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar en todo el sistema..." 
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-900 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          <Routes>
            <Route path="/" element={
                <ReservasPage 
                    courts={courts} 
                    reservations={reservations} 
                    onAddReservation={openNewReservation} 
                    onSelectReservation={openViewReservation}
                />
            } />
            <Route path="/courts" element={
                <CourtsPage 
                    courts={courts} 
                    onAddCourt={() => setActiveSheet('COURT')} 
                    onEditCourt={openEditCourt}
                />
            } />
            <Route path="/my-club" element={<MyClubPage />} />
            <Route path="/users" element={
                <UsersPage 
                    users={users} 
                    onAddUser={() => setActiveSheet('USER')} 
                    onEditUser={openEditUser}
                    onDeleteUser={handleDeleteUser}
                />
            } />
            <Route path="/inventory" element={<InventoryPage inventory={inventory} onAddProduct={() => setActiveSheet('PRODUCT')} />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<ReservasPage courts={courts} reservations={reservations} onAddReservation={openNewReservation} onSelectReservation={openViewReservation} />} />
          </Routes>
        </main>
      </div>

      {/* SideSheets */}
      
      {/* 1. New Reservation */}
      <SideSheet isOpen={activeSheet === 'RESERVATION'} onClose={closeSheet} title="Nueva Reserva">
         <form onSubmit={handleSaveReservation} className="space-y-6">
            <Select name="courtId" label="Cancha" defaultValue={prefillReservation?.courtId}>
               {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Input name="clientName" label="Nombre del Cliente" placeholder="Ej. Juan Pérez" required />
            <div className="grid grid-cols-2 gap-4">
               <Input name="date" label="Fecha" type="date" required defaultValue={prefillReservation?.date || new Date().toISOString().split('T')[0]} />
               <Input name="time" label="Hora" type="time" required defaultValue={prefillReservation?.time} />
            </div>
            <Input name="price" label="Precio" type="number" defaultValue="4500" />
            <div className="pt-8 border-t border-gray-100 flex justify-end gap-3 mt-auto">
               <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
               <Button type="submit">Confirmar Reserva</Button>
            </div>
         </form>
      </SideSheet>

      {/* 2. View/Delete Reservation */}
      <SideSheet isOpen={activeSheet === 'VIEW_RESERVATION'} onClose={closeSheet} title="Detalle de Reserva">
         {selectedReservation && (
             <div className="space-y-6 h-full flex flex-col">
                 <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                    <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Cliente</span>
                        <p className="text-lg font-medium text-gray-900">{selectedReservation.clientName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Hora Inicio</span>
                            <p className="text-gray-900">{new Date(selectedReservation.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Cancha</span>
                            <p className="text-gray-900">{courts.find(c => c.id === selectedReservation.courtId)?.name}</p>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Precio</span>
                        <p className="text-xl font-semibold text-gray-900">${selectedReservation.price}</p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-gray-100 mt-auto flex flex-col gap-3">
                    <Button variant="destructive" onClick={handleDeleteReservation} className="w-full">
                        <Trash2 className="w-4 h-4 mr-2"/> Eliminar Reserva
                    </Button>
                    <Button variant="ghost" onClick={closeSheet} className="w-full">Cerrar</Button>
                 </div>
             </div>
         )}
      </SideSheet>

      {/* 3. Add/Edit Court */}
      <SideSheet isOpen={activeSheet === 'COURT'} onClose={closeSheet} title={selectedCourt ? "Editar Cancha" : "Agregar Cancha"}>
         <form onSubmit={handleSaveCourt} className="space-y-6">
            <Input name="name" label="Nombre de la Cancha" placeholder="Ej. Cancha 4" required defaultValue={selectedCourt?.name} />
            <Select label="Deporte" defaultValue={selectedCourt?.types[0]}>
               <option>Fútbol 5</option>
               <option>Pádel</option>
               <option>Tenis</option>
            </Select>
            <Select label="Superficie" defaultValue={selectedCourt?.surface}>
               <option>Sintético</option>
               <option>Cemento</option>
               <option>Césped</option>
            </Select>
            <div className="flex items-center gap-2">
               <input type="checkbox" id="indoor" name="isIndoor" className="rounded border-gray-300 w-4 h-4 text-gray-900 focus:ring-gray-900" defaultChecked={selectedCourt?.isIndoor} />
               <label htmlFor="indoor" className="text-sm text-gray-700">Techada / Indoor</label>
            </div>
            <Input name="basePrice" label="Precio Base (Hora)" type="number" placeholder="0" required defaultValue={selectedCourt?.basePrice} />
            <div className="pt-8 border-t border-gray-100 flex justify-end gap-3 mt-auto">
               <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
               <Button type="submit">{selectedCourt ? "Guardar Cambios" : "Crear Cancha"}</Button>
            </div>
         </form>
      </SideSheet>

      {/* 4. Add/Edit User */}
      <SideSheet isOpen={activeSheet === 'USER'} onClose={closeSheet} title={selectedUser ? "Editar Usuario" : "Nuevo Usuario"}>
         <form onSubmit={handleSaveUser} className="space-y-6">
            <Input name="name" label="Nombre Completo" placeholder="Ej. María González" required defaultValue={selectedUser?.name} />
            <Input name="email" label="Email" type="email" placeholder="usuario@club.com" required defaultValue={selectedUser?.email} />
            <Select name="role" label="Rol" defaultValue={selectedUser?.role}>
               <option value="RECEPTIONIST">Recepcionista</option>
               <option value="ADMIN">Administrador</option>
               <option value="OWNER">Propietario</option>
            </Select>
            <div className="pt-8 border-t border-gray-100 flex justify-end gap-3 mt-auto">
               <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
               <Button type="submit">{selectedUser ? "Guardar Cambios" : "Crear Usuario"}</Button>
            </div>
         </form>
      </SideSheet>

      {/* 5. Add Product (Only add for now based on prompt scope) */}
      <SideSheet isOpen={activeSheet === 'PRODUCT'} onClose={closeSheet} title="Nuevo Producto">
         <form onSubmit={handleAddProduct} className="space-y-6">
            <Input name="name" label="Nombre del Producto" placeholder="Ej. Agua Mineral 500cc" required />
            <Select name="category" label="Categoría">
               <option>Bebidas</option>
               <option>Snacks</option>
               <option>Equipamiento</option>
               <option>Varios</option>
            </Select>
            <div className="grid grid-cols-2 gap-4">
               <Input name="stock" label="Stock Inicial" type="number" placeholder="0" required />
               <Input name="price" label="Precio Venta" type="number" placeholder="0.00" required />
            </div>
            <div className="pt-8 border-t border-gray-100 flex justify-end gap-3 mt-auto">
               <Button type="button" variant="ghost" onClick={closeSheet}>Cancelar</Button>
               <Button type="submit">Guardar Producto</Button>
            </div>
         </form>
      </SideSheet>

    </HashRouter>
  );
};

export default App;