
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Calendar as CalendarIcon, TrendingUp, Zap, Target, Activity, ArrowUpRight, ArrowDownRight, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const Reports: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');
  const [isExporting, setIsExporting] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const metrics = {
    revenue: timeframe === 'monthly' ? 88000 : 188000,
    conversion: timeframe === 'monthly' ? '18.4%' : '22.1%',
    velocity: timeframe === 'monthly' ? '14.2d' : '12.8d',
    pipeline: timeframe === 'monthly' ? '$240k' : '$840k'
  };

  const fetchSummary = async () => {
    setIsSummarizing(true);
    try {
      const summary = await geminiService.getExecutiveSummary(metrics);
      setAiSummary(summary);
    } catch (e) {
      setAiSummary("Unable to synthesize executive summary at this time.");
    } finally {
      setIsSummarizing(false);
    }
  };

  useEffect(() => { fetchSummary(); }, [timeframe]);

  return (
    <div className="report-container space-y-8 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Live Analytics Engine</p>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter">Growth Matrix</h1>
        </div>
        <div className="flex gap-3 no-print">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex">
            {['monthly', 'quarterly'].map(t => (
              <button key={t} onClick={() => setTimeframe(t as any)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeframe === t ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-slate-400'}`}>{t}</button>
            ))}
          </div>
          <button onClick={() => window.print()} className="btn-neon-purple flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            <Download className="w-4 h-4" /> PDF Report
          </button>
        </div>
      </div>

      {/* AI Executive Summary Card */}
      <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/10 group">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform"><Sparkles className="w-32 h-32" /></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4"><Sparkles className="w-6 h-6 text-white" /></div>
            <h3 className="text-xl font-black uppercase tracking-tighter">AI Executive Analysis</h3>
            <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mt-1">Nova Core Insights</p>
          </div>
          <div className="flex-1">
            {isSummarizing ? (
              <div className="flex items-center gap-3"><Loader2 className="w-4 h-4 animate-spin" /><p className="text-xs font-black uppercase tracking-widest animate-pulse">Calculating Growth Trajectories...</p></div>
            ) : (
              <div className="prose prose-invert prose-sm font-medium leading-relaxed opacity-90">{aiSummary}</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Conversion', value: metrics.conversion, trend: '+4.2%', icon: Target },
          { label: 'Avg Velocity', value: metrics.velocity, trend: '-2.1d', icon: Zap },
          { label: 'Pipeline Value', value: metrics.pipeline, trend: '+12%', icon: TrendingUp },
          { label: 'Revenue (Oct)', value: `$${metrics.revenue.toLocaleString()}`, trend: '+8%', icon: Activity },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-black dark:hover:border-white transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors"><kpi.icon className="w-5 h-5" /></div>
              <div className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {kpi.trend}</div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{kpi.label}</p>
            <h4 className="text-3xl font-black text-black dark:text-white">{kpi.value}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
