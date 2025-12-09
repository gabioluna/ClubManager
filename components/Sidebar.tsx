import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Users, Trophy, BarChart3, ShoppingBag, Store, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from './UI';

const NavItem = ({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed: boolean }) => (
  <Tooltip text={label} show={collapsed}>
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-4 px-4 py-3.5 rounded-full text-base font-medium transition-all duration-200 ${
          isActive 
            ? "text-[#1B3530] bg-[#C7F269] font-bold shadow-sm" 
            : "text-gray-500 hover:text-[#1B3530] hover:bg-[#F8F8F8]"
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
    >
      <Icon size={22} strokeWidth={1.5} className="flex-shrink-0" />
      {!collapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
    </NavLink>
  </Tooltip>
);

interface SidebarProps {
  onLogout: () => void;
  user?: {
    name: string;
    role: string;
    email?: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, user }) => {
  const [collapsed, setCollapsed] = useState(true);

  const initials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'U';

  const roleDisplay = user?.role === 'OWNER' ? 'Propietario' : user?.role === 'ADMIN' ? 'Administrador' : 'Recepcionista';

  return (
    <aside 
      className={`${collapsed ? 'w-[88px]' : 'w-[280px]'} border-r border-gray-200 bg-white h-screen sticky top-0 flex flex-col p-4 transition-all duration-300 flex-shrink-0 z-[60] shadow-sm`}
    >
      <div className={`mb-10 px-2 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B3530] rounded-xl flex items-center justify-center text-[#C7F269] font-bold text-lg flex-shrink-0">
            G
          </div>
          {!collapsed && <span className="font-bold text-xl text-[#1B3530] tracking-tight transition-opacity duration-300 delay-100">GestorClub</span>}
        </div>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1 text-gray-400 hover:text-[#1B3530] hover:bg-[#F8F8F8] rounded-full transition-colors">
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {collapsed && (
         <button onClick={() => setCollapsed(false)} className="mx-auto mb-6 p-1 text-gray-400 hover:text-[#1B3530] hover:bg-[#F8F8F8] rounded-full transition-colors">
            <ChevronRight size={18} />
         </button>
      )}

      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={CalendarDays} label="Reservas" collapsed={collapsed} />
        <NavItem to="/clients" icon={Users} label="Clientes" collapsed={collapsed} />
        <NavItem to="/my-club" icon={Store} label="Mi Club" collapsed={collapsed} />
        <NavItem to="/courts" icon={Trophy} label="Canchas" collapsed={collapsed} />
        <NavItem to="/inventory" icon={ShoppingBag} label="Inventario" collapsed={collapsed} />
        <NavItem to="/reports" icon={BarChart3} label="Reportes" collapsed={collapsed} />
      </nav>

      <div className="pt-6 border-t border-gray-200 mt-4 space-y-2">
        <Tooltip text="Mi Perfil" show={collapsed}>
          <NavLink 
            to="/profile"
            className={`flex items-center gap-3 px-2 py-2 rounded-full hover:bg-[#F8F8F8] transition-colors group ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#C7F269] border border-[#C7F269] flex items-center justify-center text-[#1B3530] font-bold flex-shrink-0 transition-colors">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-sm font-bold text-[#1B3530] truncate">{user?.name || 'Usuario'}</span>
                <span className="text-xs text-gray-500 truncate">{roleDisplay || 'Miembro'}</span>
              </div>
            )}
          </NavLink>
        </Tooltip>
        
        <Tooltip text="Cerrar Sesión" show={collapsed}>
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-full text-base font-medium transition-colors ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};