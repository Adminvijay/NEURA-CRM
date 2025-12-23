
import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  Shield, 
  Bell, 
  CreditCard, 
  Github,
  Mail as GmailIcon,
  CheckCircle2,
  Upload,
  Cloud,
  X,
  Camera,
  Zap,
  Download,
  ExternalLink,
  Linkedin,
  Plus,
  ShieldCheck,
  Star,
  Target,
  LogOut,
  Activity
} from 'lucide-react';
import { User, NotificationSettings } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [github, setGithub] = useState(user.github || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [gmail, setGmail] = useState(user.gmail || '');
  const [notifs, setNotifs] = useState<NotificationSettings>(user.notifications);
  const [selectedPlan, setSelectedPlan] = useState(user.plan);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarUrl(user.avatar);
    setName(user.name);
    setEmail(user.email);
    setGithub(user.github || '');
    setLinkedin(user.linkedin || '');
    setGmail(user.gmail || '');
    setNotifs(user.notifications);
    setSelectedPlan(user.plan);
  }, [user]);

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({
        ...user,
        name,
        email,
        avatar: avatarUrl,
        github,
        linkedin,
        gmail,
        notifications: notifs,
        plan: selectedPlan
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const notificationCategories = [
    { key: 'emailLeads', label: 'New Lead Alerts', desc: 'Get notified as soon as a high-intent lead enters the system.', icon: Target },
    { key: 'emailDaily', label: 'Daily Digest', desc: 'Receive a morning summary of your pipeline and top priorities.', icon: Activity },
    { key: 'pushAlerts', label: 'Push Notifications', desc: 'Real-time alerts for incoming emails and task deadlines.', icon: Zap },
    { key: 'aiSuggestions', label: 'AI Strategy Tips', desc: 'NEURA will suggest follow-up wording and timing optimizations.', icon: Star },
    { key: 'securityAlerts', label: 'Security Notifications', desc: 'Alerts regarding new logins and account permission changes.', icon: ShieldCheck },
  ];

  const plans = [
    { id: 'starter', name: 'Starter', price: '$29', features: ['Up to 500 Leads', 'Basic AI Search', 'Single Workspace'] },
    { id: 'pro', name: 'Pro', price: '$59', features: ['Unlimited Leads', 'Advanced AI Assistant', 'Priority Support', 'Custom Fields'] },
    { id: 'enterprise', name: 'Enterprise', price: '$99', features: ['Full Team Sync', 'NEURA Core API Access', 'SLA Support', 'Data Sovereignty'] },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">System Configuration</p>
          <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tighter transition-colors">Settings</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-5 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl transition-all whitespace-nowrap font-black text-[10px] sm:text-[11px] uppercase tracking-widest ${
                activeTab === tab.id 
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/10 scale-[1.02]' 
                : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-black dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-[2.5rem] shadow-sm overflow-hidden min-h-[600px] transition-colors relative">
          <div className="p-6 sm:p-10 h-full overflow-y-auto no-scrollbar max-h-[750px]">
            {activeTab === 'profile' && (
              <div className="space-y-8 sm:space-y-10 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    <div className="relative group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                      <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white z-10 backdrop-blur-[2px]">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
                      </div>
                      <img src={avatarUrl} alt="Avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] object-cover ring-4 sm:ring-8 ring-slate-50 dark:ring-slate-800 shadow-2xl transition-all" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-black text-black dark:text-white tracking-tighter transition-colors">{name}</h3>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">{email}</p>
                    </div>
                  </div>
                  <button onClick={onLogout} className="px-6 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 group"><LogOut className="w-4 h-4" /> Sign Out</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-sm font-bold transition-all dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-sm font-bold transition-all dark:text-white" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end pt-6 gap-4">
                  {saveSuccess && <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-2">Changes Synchronized</span>}
                  <button 
                    onClick={handleSaveChanges} 
                    disabled={isSaving} 
                    className="btn-neon-purple w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? 'Processing...' : saveSuccess ? 'Saved' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
