
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Target, 
  Search, 
  Filter, 
  Mail, 
  MoreVertical, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  X, 
  ExternalLink, 
  Building2, 
  ChevronDown, 
  Loader2,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { MOCK_LEADS } from '../constants';
import { Lead, LeadStatus } from '../types';
import { geminiService } from '../services/geminiService';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('nova_leads');
    return saved ? JSON.parse(saved) : MOCK_LEADS;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_leads', JSON.stringify(leads));
  }, [leads]);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    value: 0,
    status: 'new' as LeadStatus,
    notes: ''
  });

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const handleOpenProfile = (lead: Lead) => {
    setSelectedLead(lead);
    setIsProfileModalOpen(true);
  };

  const handleOpenOutreach = async (lead: Lead) => {
    setSelectedLead(lead);
    setGeneratedEmail('');
    setIsOutreachModalOpen(true);
    setIsGenerating(true);
    try {
      const email = await geminiService.generateFollowUpEmail(lead);
      setGeneratedEmail(email);
    } catch (error) {
      setGeneratedEmail("Protocol failure. Unable to synthesize intelligence.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newLead: Lead = {
        id: `l${Date.now()}`,
        ...formData,
        aiScore: Math.floor(Math.random() * 40) + 40,
        lastInteraction: new Date().toISOString().split('T')[0]
      };
      setLeads([newLead, ...leads]);
      setIsAddModalOpen(false);
      setIsSubmitting(false);
      setFormData({ name: '', company: '', email: '', value: 0, status: 'new', notes: '' });
    }, 800);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'won': return 'bg-emerald-500 text-white';
      case 'lost': return 'bg-rose-500 text-white';
      case 'qualified': return 'bg-indigo-500 text-white';
      case 'contacted': return 'bg-amber-500 text-white';
      case 'new': return 'bg-slate-900 text-white dark:bg-white dark:text-black';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter">Leads Matrix</h1>
          <p className="text-slate-500 text-sm font-medium">Capture and qualify high-intent intelligence.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-neon-purple flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl hover:opacity-90 transition-all font-black uppercase tracking-widest text-xs shadow-xl active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Lead
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white shadow-inner"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full md:w-48 flex items-center justify-between gap-3 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {statusFilter === 'all' ? 'All Status' : statusFilter.toUpperCase()}
              </div>
              <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in zoom-in-95 duration-200">
                {(['all', 'new', 'contacted', 'qualified', 'won', 'lost'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === s ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Entity Name</th>
                <th className="px-8 py-5">Status & Intelligence</th>
                <th className="px-8 py-5">Potential Value</th>
                <th className="px-8 py-5 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-black dark:text-white font-black text-lg border border-slate-200 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-black dark:text-white tracking-tight text-lg group-hover:text-indigo-600 transition-colors">{lead.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-tight">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {lead.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <span className={`w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Score: {lead.aiScore}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <p className="text-lg font-black text-black dark:text-white tracking-tighter">${lead.value.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">USD Contract Est.</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenOutreach(lead)}
                        className="p-3 text-slate-400 hover:text-black dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md"
                        title="AI Outreach"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleOpenProfile(lead)}
                        className="btn-neon-purple px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                      >
                        Open Profile <ExternalLink className="w-3 h-3" />
                      </button>
                      <button className="p-3 text-slate-300 hover:text-black dark:hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isProfileModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
             <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-black dark:bg-white rounded-[2rem] flex items-center justify-center text-white dark:text-black font-black text-3xl shadow-2xl">
                   {selectedLead.name[0]}
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-black dark:text-white tracking-tighter">{selectedLead.name}</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> {selectedLead.company}
                    </p>
                 </div>
               </div>
               <button onClick={() => setIsProfileModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
                 <X className="w-8 h-8 text-slate-400" />
               </button>
             </div>
             
             <div className="p-10 grid grid-cols-2 gap-10">
               <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Protocol Status</p>
                   <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedLead.status)}`}>
                     {selectedLead.status}
                   </span>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Contract Potential</p>
                   <p className="text-2xl font-black text-black dark:text-white tracking-tighter italic">${selectedLead.value.toLocaleString()}.00</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Digital Protocol</p>
                   <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 underline">{selectedLead.email}</p>
                 </div>
               </div>
               <div className="space-y-6">
                 <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">AI Intelligence Core</p>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-relaxed">
                      {selectedLead.notes || "No historical notes synchronized."}
                    </p>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Last Interaction: {selectedLead.lastInteraction}</p>
                 </div>
               </div>
             </div>
             <div className="p-10 bg-slate-50 dark:bg-slate-800/30 flex gap-4">
               <button 
                 onClick={() => {
                   setIsProfileModalOpen(false);
                   handleOpenOutreach(selectedLead);
                 }}
                 className="btn-neon-purple flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 <Sparkles className="w-4 h-4" /> Synthesize Outreach
               </button>
               <button className="px-8 py-4 border border-slate-200 dark:border-slate-700 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                 Edit Matrix
               </button>
             </div>
          </div>
        </div>
      )}

      {isOutreachModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight dark:text-white">AI Strategy Synthesis</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Outreach Generation</p>
                  </div>
               </div>
               <button onClick={() => setIsOutreachModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                 <X className="w-6 h-6 text-slate-400" />
               </button>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 min-h-[250px] relative">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Calculating optimal wording...</p>
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert">
                      <p className="text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">
                        {generatedEmail}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    disabled={isGenerating}
                    onClick={() => handleOpenOutreach(selectedLead)}
                    className="flex-1 py-4 border border-slate-200 dark:border-slate-700 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    Re-Synthesize
                  </button>
                  <button 
                    disabled={isGenerating}
                    onClick={() => {
                      alert("Transmission sequence initialized. Protocol: Success.");
                      setIsOutreachModalOpen(false);
                    }}
                    className="btn-neon-purple flex-[2] bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Execute Transmission
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="bg-black dark:bg-white p-3 rounded-2xl shadow-xl">
                  <Target className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight dark:text-white">Initialize New Entity</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Lead Qualification Matrix</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Michael Chen"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
                  <input 
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g. Flux Dynamics"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Digital Protocol (Email)</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@organization.com"
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contract Potential ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                      className="w-full pl-11 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Matrix Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as LeadStatus})}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white appearance-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intelligence Notes</label>
                <textarea 
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Contextual insights regarding the entity..."
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white resize-none"
                />
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
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Confirm Initialization'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
