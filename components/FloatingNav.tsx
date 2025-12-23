
import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Kanban, 
  CheckSquare, 
  MessageSquareCode,
  Settings
} from 'lucide-react';

interface FloatingNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ currentPath, onNavigate }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leads', icon: Target, path: '/leads' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Pipeline', icon: Kanban, path: '/pipeline' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'AI Assistant', icon: MessageSquareCode, path: '/ai' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-black/90 backdrop-blur-xl p-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`p-3.5 rounded-full transition-all group relative btn-neon-purple ${
                isActive 
                  ? 'bg-white text-black shadow-lg scale-110' 
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap">
                {item.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingNav;
