
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Kanban, 
  CheckSquare, 
  MessageSquareCode, 
  Settings,
  ShieldCheck,
  TrendingUp,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leads', icon: Target, path: '/leads' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Pipeline', icon: Kanban, path: '/pipeline' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'AI Assistant', icon: MessageSquareCode, path: '/ai' },
    { name: 'Reports', icon: TrendingUp, path: '/reports' },
    { name: 'API Matrix', icon: Terminal, path: '/api-log' },
  ];

  return (
    <div className="w-64 bg-black dark:bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 border-r border-transparent dark:border-slate-800 shadow-2xl lg:shadow-none">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-black" />
        </div>
        <span className="text-xl font-black tracking-tighter uppercase italic">NEURA DESK</span>
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
              currentPath === item.path 
                ? 'bg-white dark:bg-white text-black font-bold shadow-lg shadow-white/10 scale-[1.02]' 
                : 'text-slate-500 hover:text-white hover:bg-slate-900 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm tracking-wide">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-900 dark:border-slate-800 space-y-1">
        <button
          onClick={() => onNavigate('/settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            currentPath === '/settings' 
              ? 'bg-white dark:bg-white text-black font-bold' 
              : 'text-slate-500 hover:text-white hover:bg-slate-900 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm tracking-wide">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
