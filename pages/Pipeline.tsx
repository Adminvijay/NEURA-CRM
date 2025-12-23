
import React, { useState, useMemo } from 'react';
import { Kanban, Filter, Plus, Clock, DollarSign, Calendar, X, ChevronDown, CheckCircle2, TrendingUp, Search } from 'lucide-react';
import { MOCK_DEALS, MOCK_LEADS } from '../constants';
import { DealStage, Deal } from '../types';

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'high-value' | 'urgent'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    leadId: MOCK_LEADS[0].id,
    value: 0,
    stage: 'discovery' as DealStage,
    expectedClose: new Date().toISOString().split('T')[0]
  });

  const stages: { key: DealStage; label: string; color: string }[] = [
    { key: 'discovery', label: 'Discovery', color: 'bg-blue-500' },
    { key: 'proposal', label: 'Proposal', color: 'bg-amber-500' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-indigo-500' },
    { key: 'closed-won', label: 'Won', color: 'bg-emerald-500' },
    { key: 'closed-lost', label: 'Lost', color: 'bg-rose-500' },
  ];

  const filteredDeals = useMemo(() => {
    switch (viewFilter) {
      case 'high-value':
        return deals.filter(d => d.value > 10000);
      case 'urgent':
        const today = new Date();
        return deals.filter(d => {
          const closeDate = new Date(d.expectedClose);
          const diffTime = closeDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays < 15;
        });
      default:
        return deals;
    }
  }, [deals, viewFilter]);

  const getDealsInStage = (stage: DealStage) => filteredDeals.filter(d => d.stage === stage);

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newDeal: Deal = {
        id: `d${Date.now()}`,
        ...formData
      };
      setDeals([newDeal, ...deals]);
      setIsAddModalOpen(false);
      setIsSubmitting(false);
      setFormData({
        title: '',
        leadId: MOCK_LEADS[0].id,
        value: 0,
        stage: 'discovery',
        expectedClose: new Date().toISOString().split('T')[0]
      });
    }, 600);
  };

  return (
    <div className="h-full flex flex-col space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter">Sales Pipeline</h1>
          <p className="text-slate-500 text-sm font-medium">Visualizing flow from outreach to closure.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                View: {viewFilter.replace('-', ' ')}
              </div>
              <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 animate-in zoom-in-95 duration-200">
                {(['all', 'high-value', 'urgent'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setViewFilter(f); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      viewFilter === f ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.replace('-', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-neon-purple flex-1 sm:flex-none bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin flex-1 min-h-[500px]">
        {stages.map((stage) => {
          const stageDeals = getDealsInStage(stage.key);
          const totalValue = stageDeals.reduce((acc, d) => acc + d.value, 0);

          return (
            <div key={stage.key} className="w-80 flex-shrink-0 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-[2rem] transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-sm shadow-current/30`}></div>
                    <h3 className="font-black text-black dark:text-white text-sm uppercase tracking-widest">{stage.label}</h3>
                  </div>
                  <span className="text-[10px] bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 font-black">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xl font-black text-black dark:text-white tracking-tighter">${totalValue.toLocaleString()}</p>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-340px)] no-scrollbar">
                {stageDeals.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-2">
                    <TrendingUp className="w-5 h-5 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No active deals</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div key={deal.id} className="bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:border-black dark:hover:border-white cursor-pointer transition-all group active:scale-[0.98]">
                      <h4 className="font-black text-black dark:text-white group-hover:text-indigo-600 transition-colors leading-tight mb-4">{deal.title}</h4>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                           <DollarSign className="w-3 h-3 text-emerald-500" />
                           <span className="text-xs font-black text-slate-700 dark:text-slate-300">{deal.value.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                           <Calendar className="w-3 h-3" />
                           {deal.expectedClose}
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="bg-black dark:bg-white p-3 rounded-2xl shadow-xl">
                  <Kanban className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight dark:text-white">Initialize New Deal</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pipeline Integration</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deal Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Q4 Software License Migration"
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contract Value ($)</label>
                  <input 
                    required
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Close Date</label>
                  <input 
                    required
                    type="date"
                    value={formData.expectedClose}
                    onChange={(e) => setFormData({...formData, expectedClose: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Stage</label>
                <select 
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value as DealStage})}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white appearance-none"
                >
                  {stages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-4 border border-slate-200 dark:border-slate-700 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-neon-purple flex-[2] bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : 'Confirm Deal Initialization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
