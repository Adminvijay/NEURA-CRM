import { GoogleGenAI } from "@google/genai";
import { Lead, Deal, Task } from "../types";
import { apiLogService } from "./apiLogService";

export const geminiService = {
  // Fixed: 'private_async' is not a valid modifier in an object literal. Changed to 'async'.
  async callIntelligence(
    model: string, 
    contents: any, 
    page: string, 
    endpoint: string,
    systemInstruction?: string
  ): Promise<string> {
    const startTime = Date.now();
    const logId = apiLogService.addLog({
      method: 'POST',
      endpoint: `gemini-api/${endpoint}`,
      status: 'pending',
      latency: 0,
      page,
      payloadSize: `${Math.round(JSON.stringify(contents).length / 1024)}KB`
    });

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: systemInstruction ? { systemInstruction } : undefined
      });
      
      const latency = Date.now() - startTime;
      apiLogService.updateLogStatus(logId, 'success', latency);
      return response.text || "";
    } catch (error) {
      const latency = Date.now() - startTime;
      apiLogService.updateLogStatus(logId, 'error', latency);
      console.error("NEURA Intelligence Error:", error);
      throw error;
    }
  },

  async generateFollowUpEmail(lead: Lead): Promise<string> {
    return this.callIntelligence(
      'gemini-3-flash-preview',
      `Generate a high-conversion follow-up email.
       Lead: ${lead.name} from ${lead.company}
       Context: ${lead.notes}`,
      'Leads Matrix',
      'outreach-synthesis'
    );
  },

  async getDashboardInsights(leads: Lead[], deals: Deal[]): Promise<string> {
    const context = `Leads: ${leads.length}, Pipeline: $${deals.reduce((a, b) => a + b.value, 0)}`;
    return this.callIntelligence(
      'gemini-3-pro-preview',
      `Analyze CRM state: ${context}. Provide 3 bullet points on growth strategy.`,
      'Dashboard',
      'strategic-insight'
    );
  },

  async getExecutiveSummary(metrics: any): Promise<string> {
    return this.callIntelligence(
      'gemini-3-pro-preview',
      `Generate executive summary for metrics: ${JSON.stringify(metrics)}`,
      'Growth Matrix',
      'executive-reporting'
    );
  },

  async chatAssistant(query: string, leads: Lead[], tasks: Task[]): Promise<string> {
    return this.callIntelligence(
      'gemini-3-pro-preview',
      query,
      'NEURA AI',
      'conversational-nlp',
      `You are NEURA Core. CRM Context: ${leads.length} leads, ${tasks.length} tasks.`
    );
  }
};