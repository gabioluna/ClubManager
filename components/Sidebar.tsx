
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Users, Trophy, BarChart3, ShoppingBag, Store, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from './UI';

const NavItem = ({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed: boolean }) => (
  <Tooltip text={label} show={collapsed}>
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-4 px-4 py-3.5 rounded-lg text-base transition-all duration-200 ${
          isActive 
            ? "text-gray-900 bg-gray-100 font-semibold" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
    >
      <Icon size={22} strokeWidth={1.5} className="flex-shrink-0" />
      {!collapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
    </NavLink>
  </Tooltip>
);

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`${collapsed ? 'w-[80px]' : 'w-[280px]'} border-r border-gray-200 bg-white h-screen sticky top-0 flex flex-col p-4 transition-all duration-300 flex-shrink-0 z-30`}
    >
      <div className={`mb-8 px-2 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-gray-200 flex-shrink-0">
            G
          </div>
          {!collapsed && <span className="font-semibold text-xl text-gray-900 tracking-tight transition-opacity duration-300 delay-100">GestorClub</span>}
        </div>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {collapsed && (
         <button onClick={() => setCollapsed(false)} className="mx-auto mb-6 p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronRight size={18} />
         </button>
      )}

      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={CalendarDays} label="Reservas" collapsed={collapsed} />
        <NavItem to="/my-club" icon={Store} label="Mi Club" collapsed={collapsed} />
        <NavItem to="/courts" icon={Trophy} label="Canchas" collapsed={collapsed} />
        <NavItem to="/users" icon={Users} label="Usuarios" collapsed={collapsed} />
        <NavItem to="/inventory" icon={ShoppingBag} label="Inventario" collapsed={collapsed} />
        <NavItem to="/reports" icon={BarChart3} label="Reportes" collapsed={collapsed} />
      </nav>

      <div className="pt-6 border-t border-gray-200 mt-4">
        <div className={`flex items-center gap-3 px-2 mb-4 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
            JA
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 truncate">Juan Admin</span>
              <span className="text-xs text-gray-500 truncate">Propietario</span>
            </div>
          )}
        </div>
        <Tooltip text="Cerrar Sesión" show={collapsed}>
          <button className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-base transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};
