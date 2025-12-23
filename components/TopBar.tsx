
import React from 'react';
import { Search, Bell, Plus, Maximize, Minimize, Moon, Sun, Menu } from 'lucide-react';
import { User } from '../types';

interface TopBarProps {
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  user: User;
  onNavigate: (path: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenMobileMenu: () => void;
  onQuickAdd: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onToggleFullscreen, 
  isFullscreen, 
  user, 
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenMobileMenu,
  onQuickAdd
}) => {
  return (
    <header className={`h-20 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 transition-all duration-500 ${
      isFullscreen 
        ? 'bg-white dark:bg-black border-none' 
        : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
    }`}>
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {!isFullscreen && (
          <button 
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Intelligence..."
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl transition-all text-sm outline-none ${
              isFullscreen 
                ? 'bg-slate-100 dark:bg-slate-800 border-none' 
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-black dark:focus:ring-white dark:text-white'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <button 
          onClick={onToggleTheme}
          className="p-2.5 text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button 
          onClick={onToggleFullscreen}
          className="hidden sm:block p-2.5 text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          title={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {!isFullscreen && (
          <button 
            onClick={onQuickAdd}
            className="hidden md:flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md font-bold group active:scale-95 btn-neon-purple"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs uppercase tracking-widest">Quick Add</span>
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
          <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black dark:bg-white border border-white dark:border-slate-900 rounded-full"></span>
          </button>
          
          <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

          <button 
            onClick={() => onNavigate('/settings')}
            className="flex items-center gap-3 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group active:scale-95"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-black dark:text-white uppercase tracking-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{user.role}</p>
            </div>
            <div className="relative flex-shrink-0">
              <img src={user.avatar} alt="User" className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 object-cover grayscale group-hover:grayscale-0 transition-all" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
