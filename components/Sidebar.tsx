import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Users, Trophy, BarChart3, ShoppingBag, Store, LogOut } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `flex items-center gap-4 px-4 py-3.5 rounded-lg text-base transition-all duration-200 ${
        isActive 
          ? "text-gray-900 bg-gray-100 font-medium" 
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      }`
    }
  >
    <Icon size={22} strokeWidth={1.5} />
    <span>{label}</span>
  </NavLink>
);

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[280px] border-r border-gray-200 bg-white h-screen sticky top-0 flex flex-col p-6 flex-shrink-0 z-30">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-gray-200">G</div>
        <span className="font-semibold text-xl text-gray-900 tracking-tight">GestorClub</span>
      </div>

      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={CalendarDays} label="Reservas" />
        <NavItem to="/my-club" icon={Store} label="Mi Club" />
        <NavItem to="/courts" icon={Trophy} label="Canchas" />
        <NavItem to="/users" icon={Users} label="Usuarios" />
        <NavItem to="/inventory" icon={ShoppingBag} label="Inventario" />
        <NavItem to="/reports" icon={BarChart3} label="Reportes" />
      </nav>

      <div className="pt-6 border-t border-gray-200 mt-4">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-medium">
            JA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Juan Admin</span>
            <span className="text-xs text-gray-500">Propietario</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-base transition-colors">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};