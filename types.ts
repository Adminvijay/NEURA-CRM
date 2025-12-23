
export interface NotificationSettings {
  emailLeads: boolean;
  emailDaily: boolean;
  pushAlerts: boolean;
  aiSuggestions: boolean;
  securityAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
  github?: string;
  linkedin?: string;
  gmail?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  notifications: NotificationSettings;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
export type DealStage = 'discovery' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
export type Priority = 'low' | 'medium' | 'high';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
  aiScore: number;
  lastInteraction: string;
  notes: string;
  value: number;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
}

export interface Deal {
  id: string;
  title: string;
  leadId: string;
  value: number;
  stage: DealStage;
  expectedClose: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: Priority;
  relatedTo: string;
}

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  content: string;
  timestamp: string;
  actor: string;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  latency: number;
  page: string;
  payloadSize?: string;
}
