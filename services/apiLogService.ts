
import { ApiLogEntry } from '../types';

const LOG_STORAGE_KEY = 'neura_api_logs';
const MAX_LOGS = 50;

export const apiLogService = {
  getLogs(): ApiLogEntry[] {
    const saved = localStorage.getItem(LOG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  addLog(log: Omit<ApiLogEntry, 'id' | 'timestamp'>): string {
    const logs = this.getLogs();
    const id = Math.random().toString(36).substr(2, 9);
    const newLog: ApiLogEntry = {
      ...log,
      id,
      timestamp: new Date().toISOString()
    };
    
    const updatedLogs = [newLog, ...logs].slice(0, MAX_LOGS);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
    
    // Broadcast event for real-time UI updates
    window.dispatchEvent(new CustomEvent('neura-api-update', { detail: newLog }));
    
    return id;
  },

  updateLogStatus(id: string, status: 'success' | 'error', latency: number) {
    const logs = this.getLogs();
    const index = logs.findIndex(l => l.id === id);
    if (index !== -1) {
      logs[index].status = status;
      logs[index].latency = latency;
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
      window.dispatchEvent(new CustomEvent('neura-api-update', { detail: logs[index] }));
    }
  }
};
