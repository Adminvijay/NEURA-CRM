
import { Lead, Contact, Deal, Task, User } from './types';

export const MOCK_USER: User = {
  id: '1',
  name: 'Alex Rivera',
  email: 'alex@novacrm.io',
  role: 'admin',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  github: 'alex-rivera-dev',
  linkedin: 'alexriverapro',
  gmail: 'alex.rivera.work@gmail.com',
  plan: 'enterprise',
  notifications: {
    emailLeads: true,
    emailDaily: false,
    pushAlerts: true,
    aiSuggestions: true,
    securityAlerts: true
  }
};

export const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'John Doe', company: 'TechFlow Inc', email: 'john@techflow.com', status: 'new', aiScore: 85, lastInteraction: '2023-10-25', notes: 'Interested in enterprise license', value: 5000 },
  { id: 'l2', name: 'Sarah Smith', company: 'GreenScale', email: 'sarah@greenscale.io', status: 'qualified', aiScore: 92, lastInteraction: '2023-10-27', notes: 'Budget approved. Needs a demo.', value: 12000 },
  { id: 'l3', name: 'Mike Johnson', company: 'BlueSky Ltd', email: 'mike@bluesky.com', status: 'contacted', aiScore: 45, lastInteraction: '2023-10-20', notes: 'Looking for trial access', value: 2000 },
  { id: 'l4', name: 'Emma Wilson', company: 'Nova Labs', email: 'emma@novalabs.ai', status: 'won', aiScore: 98, lastInteraction: '2023-10-28', notes: 'Contract signed yesterday', value: 25000 },
  { id: 'l5', name: 'David Lee', company: 'Pixel Point', email: 'david@pixelpoint.co', status: 'lost', aiScore: 12, lastInteraction: '2023-10-15', notes: 'Price was too high for their budget', value: 3000 }
];

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', firstName: 'Sarah', lastName: 'Smith', email: 'sarah@greenscale.io', phone: '+1 (555) 123-4567', company: 'GreenScale', position: 'VP of Engineering' },
  { id: 'c2', firstName: 'John', lastName: 'Doe', email: 'john@techflow.com', phone: '+1 (555) 987-6543', company: 'TechFlow Inc', position: 'Chief Operations Officer' },
  { id: 'c3', firstName: 'Emma', lastName: 'Wilson', email: 'emma@novalabs.ai', phone: '+1 (555) 246-8135', company: 'Nova Labs', position: 'Founding Partner' },
  { id: 'c4', firstName: 'Robert', lastName: 'Chen', email: 'robert@nexus.com', phone: '+1 (555) 369-1470', company: 'Nexus Systems', position: 'Director of Procurement' },
  { id: 'c5', firstName: 'Olivia', lastName: 'Taylor', email: 'olivia@starlight.co', phone: '+1 (555) 159-7531', company: 'Starlight Media', position: 'Marketing Manager' },
  { id: 'c6', firstName: 'Marcus', lastName: 'Vance', email: 'm.vance@quantumbase.io', phone: '+1 (555) 777-8888', company: 'Quantum Base', position: 'CTO' },
  { id: 'c7', firstName: 'Sophia', lastName: 'Garcia', email: 'sophia.g@global-logistics.net', phone: '+1 (555) 444-5555', company: 'Global Logistics', position: 'Head of Growth' }
];

export const MOCK_DEALS: Deal[] = [
  { id: 'd1', title: 'Enterprise Cloud Migration', leadId: 'l2', value: 12000, stage: 'proposal', expectedClose: '2023-11-15' },
  { id: 'd2', title: 'Consulting Workshop', leadId: 'l3', value: 2500, stage: 'discovery', expectedClose: '2023-11-20' },
  { id: 'd3', title: 'Q4 Support Retainer', leadId: 'l4', value: 8000, stage: 'closed-won', expectedClose: '2023-10-31' }
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Follow up with Sarah Smith regarding GreenScale proposal', dueDate: '2023-11-05', completed: false, priority: 'high', relatedTo: 'Sarah Smith' },
  { id: 't2', title: 'Send revised pricing to TechFlow Inc', dueDate: '2023-11-06', completed: false, priority: 'medium', relatedTo: 'John Doe' },
  { id: 't3', title: 'Initial discovery call with Quantum Base CTO', dueDate: '2023-11-04', completed: true, priority: 'high', relatedTo: 'Marcus Vance' },
  { id: 't4', title: 'Review marketing collateral for Starlight Media', dueDate: '2023-11-08', completed: false, priority: 'low', relatedTo: 'Olivia Taylor' },
  { id: 't5', title: 'Drafting legal agreement for Nova Labs', dueDate: '2023-11-10', completed: false, priority: 'medium', relatedTo: 'Emma Wilson' },
  { id: 't6', title: 'Quarterly sales sync with the team', dueDate: '2023-11-01', completed: true, priority: 'medium', relatedTo: 'Internal' }
];
