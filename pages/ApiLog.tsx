
import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Activity, 
  Wifi, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Database,
  ArrowRight,
  CircleDot,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { ApiLogEntry } from '../types';
import { apiLogService } from '../services/apiLogService';

const ApiLog: React.FC = () => {
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    setLogs(apiLogService.getLogs());
    
    const handleUpdate = () => {
      if (isLive) {
        setLogs(apiLogService.getLogs());
      }
    };
    
    window.addEventListener('neura-api-update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('neura-api-update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [isLive]);

  const clearLogs = () => {
    localStorage.removeItem('neura_api_logs');
    setLogs([]);
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Protocol Monitoring</p>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter">API Matrix Log</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              isLive 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
            {isLive ? 'Live Feed' : 'Feed Paused'}
          </button>
          <button 
            onClick={clearLogs}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Intelligence Core', value: 'Gemini-3 Pro', icon: Cpu, color: 'text-indigo-500' },
          { label: 'Protocol Latency', value: `${logs.length > 0 ? Math.round(logs.reduce((a, b) => a + b.latency, 0) / logs.length) : 0}ms`, icon: Activity, color: 'text-emerald-500' },
          { label: 'Total Requests', value: logs.length, icon: Database, color: 'text-amber-500' },
          { label: 'Uptime Protocol', value: '99.98%', icon: Wifi, color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <stat.icon className={`w-6 h-6 mb-4 ${stat.color}`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-black text-black dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-black text-slate-300 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col min-h-[500px]">
        <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Matrix Terminal v4.0.2</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 sm:p-8 space-y-3 font-mono text-[11px] no-scrollbar">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-700 opacity-50 italic">
              <RefreshCw className="w-8 h-8 mb-4 animate-spin-slow" />
              Awaiting data transmission...
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group animate-in slide-in-from-left-2">
                <div className="flex items-center gap-3 min-w-[140px]">
                  <span className="text-slate-600 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${
                    log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                    log.status === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white animate-pulse'
                  }`}>
                    {log.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-indigo-400 font-black">{log.method}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-white font-bold truncate">{log.endpoint}</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                    <CircleDot className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-400 uppercase tracking-tighter text-[9px]">Page: {log.page}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className={`font-bold ${log.latency > 1000 ? 'text-amber-400' : 'text-slate-400'}`}>{log.latency}ms</span>
                  </div>
                  <span className="text-slate-600 font-bold hidden sm:block">{log.payloadSize}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiLog;
