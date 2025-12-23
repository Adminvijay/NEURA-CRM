
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, Users, Target, DollarSign, ArrowUpRight, AlertCircle, RefreshCcw } from 'lucide-react';
import { MOCK_LEADS, MOCK_DEALS } from '../constants';
import { geminiService } from '../services/geminiService';
import { Lead, Deal } from '../types';

const Dashboard: React.FC = () => {
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [forecastTimeframe, setForecastTimeframe] = useState<'7D' | '30D'>('7D');

  // Unified Data Access Layer
  const [data, setData] = useState({
    leads: JSON.parse(localStorage.getItem('nova_leads') || JSON.stringify(MOCK_LEADS)),
    deals: JSON.parse(localStorage.getItem('nova_deals') || JSON.stringify(MOCK_DEALS))
  });

  useEffect(() => {
    const handleUpdate = () => {
      setData({
        leads: JSON.parse(localStorage.getItem('nova_leads') || JSON.stringify(MOCK_LEADS)),
        deals: JSON.parse(localStorage.getItem('nova_deals') || JSON.stringify(MOCK_DEALS))
      });
    };
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    setHasError(false);
    try {
      const insights = await geminiService.getDashboardInsights(data.leads, data.deals);
      setAiInsights(insights);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => { fetchInsights(); }, [data.leads.length, data.deals.length]);

  const stats = [
    { label: 'Leads', value: data.leads.length, icon: Target, path: '/leads', trend: '+4%' },
    { label: 'Deals', value: data.deals.length, icon: Users, path: '/pipeline', trend: '+2%' },
    { label: 'Value', value: `$${data.deals.reduce((acc: number, d: Deal) => acc + d.value, 0).toLocaleString()}`, icon: DollarSign, path: '/pipeline', trend: '+18%' },
    { label: 'Growth', value: `${((data.leads.length / MOCK_LEADS.length) * 100 - 100).toFixed(1)}%`, icon: TrendingUp, path: '/reports', trend: 'Global' },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Workspace Overview</p>
          <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tighter">Welcome back, Alex.</h1>
        </div>
        <button onClick={fetchInsights} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:scale-105 transition-all shadow-sm">
          <RefreshCcw className={`w-4 h-4 text-slate-400 ${isLoadingInsights ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-black dark:hover:border-white transition-all group cursor-pointer active:scale-[0.98]" onClick={() => window.dispatchEvent(new CustomEvent('nova-navigate', { detail: stat.path }))}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex text-black dark:text-white text-[10px] font-black items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> {stat.trend}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-black dark:text-white mt-1 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-black text-black dark:text-white uppercase tracking-widest text-sm">Revenue Forecast</h3>
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {['7D', '30D'].map(t => (
                <button key={t} onClick={() => setForecastTimeframe(t as any)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${forecastTimeframe === t ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-sm' : 'text-slate-400'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastTimeframe === '7D' ? [{n:'Mon',v:400},{n:'Tue',v:300},{n:'Wed',v:600},{n:'Thu',v:800},{n:'Fri',v:500},{n:'Sat',v:900},{n:'Sun',v:1100}] : [{n:'W1',v:2500},{n:'W2',v:3200},{n:'W3',v:2800},{n:'W4',v:4100}]}>
                <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={isDarkMode ? "#FFF" : "#000"} stopOpacity={0.1}/><stop offset="95%" stopColor={isDarkMode ? "#FFF" : "#000"} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDarkMode ? '#0f172a' : '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="v" stroke={isDarkMode ? "#FFF" : "#000"} strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black dark:bg-slate-900 text-white p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Sparkles className="w-48 h-48" /></div>
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20"><Sparkles className="w-5 h-5 text-white" /></div>
              <h3 className="font-black text-xl uppercase tracking-tighter">AI Intelligence</h3>
            </div>
            {isLoadingInsights ? (
              <div className="animate-pulse space-y-4"><div className="h-4 bg-white/10 rounded w-3/4"></div><div className="h-4 bg-white/10 rounded w-full"></div><div className="h-4 bg-white/10 rounded w-5/6"></div></div>
            ) : hasError ? (
              <div className="text-center p-4 space-y-4"><AlertCircle className="w-8 h-8 text-rose-500 mx-auto" /><p className="text-xs font-black uppercase text-rose-500 tracking-widest">Protocol Offline</p></div>
            ) : (
              <div className="prose prose-invert prose-sm font-medium text-slate-300 leading-relaxed whitespace-pre-wrap">{aiInsights || "Awaiting intelligence stream..."}</div>
            )}
          </div>
          <button onClick={fetchInsights} disabled={isLoadingInsights} className="btn-neon-purple mt-6 w-full py-4 bg-white dark:bg-slate-100 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg disabled:opacity-50">
            {isLoadingInsights ? 'Analyzing Matrix...' : 'Regenerate Strategy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
