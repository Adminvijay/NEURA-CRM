
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  MoreVertical, 
  Download,
  Building2,
  X,
  UserPlus,
  ChevronDown,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { MOCK_CONTACTS } from '../constants';
import { Contact } from '../types';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'company'>('newest');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  });

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let result = contacts.filter(contact => 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.position.toLowerCase().includes(query)
    );

    if (sortBy === 'az') {
      result = [...result].sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === 'company') {
      result = [...result].sort((a, b) => a.company.localeCompare(b.company));
    } else {
      result = [...result]; 
    }

    return result;
  }, [contacts, searchQuery, sortBy]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newContact: Contact = {
        id: `c${Date.now()}`,
        ...formData
      };

      setContacts([newContact, ...contacts]);
      setIsAddModalOpen(false);
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: ''
      });
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Position'];
    const rows = contacts.map(c => [
      c.firstName, 
      c.lastName, 
      `"${c.email}"`, 
      `"${c.phone}"`, 
      `"${c.company}"`, 
      `"${c.position}"`
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nova_contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter">Contacts</h1>
          <p className="text-slate-500 text-sm font-medium">Network intelligence and stakeholder management.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95 group"
          >
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-neon-purple flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl hover:opacity-90 transition-all font-black uppercase tracking-widest text-xs shadow-xl active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, company, or position..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white shadow-inner"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="w-full md:w-48 flex items-center justify-between gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in zoom-in-95 duration-200">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Sort Matrix By</p>
                  {(['newest', 'az', 'company'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => { setSortBy(s); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                        sortBy === s ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s.replace('az', 'A - Z').replace('newest', 'Creation Date').replace('company', 'Organization')}
                      {sortBy === s && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Professional Profile</th>
                <th className="px-8 py-5">Role & Organization</th>
                <th className="px-8 py-5">Connectivity</th>
                <th className="px-8 py-5 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-black dark:text-white font-black text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <p className="font-black text-black dark:text-white tracking-tight text-base group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {contact.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">{contact.position}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-tight mt-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {contact.company}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 group/link cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                          <Mail className="w-3 h-3" />
                        </div>
                        {contact.email}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 group/link cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                          <Phone className="w-3 h-3" />
                        </div>
                        {contact.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 lg:opacity-0 group-hover:opacity-100 transition-all transform lg:translate-x-2 group-hover:translate-x-0">
                      <button className="p-3 text-slate-400 hover:text-black dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-all border border-slate-100 dark:border-slate-700" title="Email Sync">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-black dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-all border border-slate-100 dark:border-slate-700" title="VoIP Sync">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center shadow-inner">
                        <Users className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-black dark:text-white font-black uppercase tracking-widest text-xs">No Connectivity Matches</p>
                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed">No stakeholders were found matching your current intelligence query parameters.</p>
                      </div>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:scale-105 active:scale-95 transition-all"
                      >
                        Reset Matrix Search
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50/30 dark:bg-slate-800/20">
          <p>Intelligence Load: {filteredContacts.length} / {contacts.length} Entities</p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all shadow-sm" disabled>Prev</button>
            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all shadow-sm" disabled>Next</button>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <UserPlus className="w-6 h-6 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Entity Initialization</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Register new network stakeholder</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal First Name</label>
                  <input 
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. John"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Last Name</label>
                  <input 
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Doe"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Email Protocol</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="entity@organization.com"
                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">VoIP / Mobile Connectivity</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization</label>
                  <input 
                    required
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nova Dynamics"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Position</label>
                  <input 
                    required
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Chief of Strategy"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white"
                  />
                </div>
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
                  className="btn-neon-purple flex-[2] bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Confirm Entity Initialization'
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

export default Contacts;
