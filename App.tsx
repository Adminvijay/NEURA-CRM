
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import ApiLog from './pages/ApiLog';
import FloatingNav from './components/FloatingNav';
import { ShieldCheck, X, Target, UserPlus, CheckSquare, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { MOCK_USER } from './constants';
import { User } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddStep, setQuickAddStep] = useState<'menu' | 'lead' | 'contact' | 'task'>('menu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleInternalNav = (e: any) => {
      if (e.detail) {
        setCurrentPath(e.detail);
      }
    };
    window.addEventListener('nova-navigate', handleInternalNav);
    window.addEventListener('neura-navigate', handleInternalNav);
    return () => {
      window.removeEventListener('nova-navigate', handleInternalNav);
      window.removeEventListener('neura-navigate', handleInternalNav);
    };
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('nova_auth');
    if (auth === 'true') setIsAuthenticated(true);

    const savedUser = localStorage.getItem('nova_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }

    const savedTheme = localStorage.getItem('nova_dark_mode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextState = !isDarkMode;
    setIsDarkMode(nextState);
    localStorage.setItem('nova_dark_mode', String(nextState));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('nova_user', JSON.stringify(updatedUser));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('nova_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nova_auth');
    setCurrentPath('/');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const navigate = (path: string) => {
    setCurrentPath(path);
    setIsMobileMenuOpen(false);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsQuickAddOpen(false);
      setQuickAddStep('menu');
    }, 1000);
  };

  const renderQuickAddContent = () => {
    switch (quickAddStep) {
      case 'lead':
        return (
          <form onSubmit={handleQuickAddSubmit} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black uppercase tracking-tight dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5" /> New Lead
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Lead Name" className="p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
              <input placeholder="Company" className="p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
            </div>
            <input placeholder="Email" type="email" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
            <div className="flex gap-3">
              <button type="button" onClick={() => setQuickAddStep('menu')} className="flex-1 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">Back</button>
              <button disabled={isSubmitting} type="submit" className="btn-neon-purple flex-[2] py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Lead'}
              </button>
            </div>
          </form>
        );
      case 'contact':
        return (
          <form onSubmit={handleQuickAddSubmit} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black uppercase tracking-tight dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> New Contact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
              <input placeholder="Last Name" className="p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
            </div>
            <input placeholder="Company" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
            <div className="flex gap-3">
              <button type="button" onClick={() => setQuickAddStep('menu')} className="flex-1 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">Back</button>
              <button disabled={isSubmitting} type="submit" className="btn-neon-purple flex-[2] py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Contact'}
              </button>
            </div>
          </form>
        );
      case 'task':
        return (
          <form onSubmit={handleQuickAddSubmit} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black uppercase tracking-tight dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5" /> Quick Task
            </h3>
            <input placeholder="Task Title" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required />
              <select className="p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none dark:text-white" required>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setQuickAddStep('menu')} className="flex-1 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">Back</button>
              <button disabled={isSubmitting} type="submit" className="btn-neon-purple flex-[2] py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Task'}
              </button>
            </div>
          </form>
        );
      default:
        return (
          <div className="space-y-3 animate-in fade-in duration-300">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">Global Quick Actions</h3>
            <button 
              onClick={() => setQuickAddStep('lead')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <Target className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">New Lead</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
            <button 
              onClick={() => setQuickAddStep('contact')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <UserPlus className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">New Contact</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
            <button 
              onClick={() => setQuickAddStep('task')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <CheckSquare className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">New Task</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/': return <Dashboard />;
      case '/leads': return <Leads />;
      case '/contacts': return <Contacts />;
      case '/tasks': return <Tasks />;
      case '/pipeline': return <Pipeline />;
      case '/reports': return <Reports />;
      case '/ai': return <AIAssistant />;
      case '/settings': return <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      case '/api-log': return <ApiLog />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
            <ShieldCheck className="w-12 h-12 text-slate-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Page under development</h2>
            <p className="text-slate-500 dark:text-slate-400">This feature will be available in the next version of NEURA DESKCRM.</p>
          </div>
        </div>
      );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500 ${isFullscreen ? 'bg-white dark:bg-black' : ''}`}>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {!isFullscreen && (
        <div className={`fixed inset-y-0 left-0 z-[70] transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            currentPath={currentPath} 
            onNavigate={navigate} 
            onLogout={handleLogout} 
          />
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 -right-12 p-2 bg-black text-white rounded-xl lg:hidden shadow-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-500 ${isFullscreen ? 'ml-0' : 'lg:ml-64'}`}>
        <TopBar 
          onToggleFullscreen={toggleFullscreen} 
          isFullscreen={isFullscreen} 
          user={user} 
          onNavigate={navigate}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickAdd={() => {
            setQuickAddStep('menu');
            setIsQuickAddOpen(true);
          }}
        />
        
        <main className={`flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 transition-colors duration-500 ${isFullscreen ? 'p-4 sm:p-12 pb-32 bg-white dark:bg-black' : 'p-4 sm:p-8'}`}>
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>

        {isFullscreen && (
          <FloatingNav 
            currentPath={currentPath} 
            onNavigate={navigate} 
          />
        )}
      </div>

      {isQuickAddOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsQuickAddOpen(false)}></div>
          <div className="relative w-full max-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsQuickAddOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-8 flex justify-center">
              <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-7 h-7 text-white dark:text-black" />
              </div>
            </div>
            {renderQuickAddContent()}
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        /* Neon Purple Edge Effect */
        .btn-neon-purple {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .btn-neon-purple::before {
          content: '';
          position: absolute;
          inset: -1px;
          padding: 1.5px;
          background: conic-gradient(
            from 0deg,
            transparent,
            #a855f7 10%,
            transparent 20%,
            transparent 50%,
            #a855f7 60%,
            transparent 70%,
            transparent
          );
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          border-radius: inherit;
          animation: neon-spin 4s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes neon-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        * {
          transition-property: background-color, border-color, color, fill, stroke, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      `}</style>
    </div>
  );
};

export default App;
