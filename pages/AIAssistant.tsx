
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, ShieldCheck, Loader2, Maximize2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { MOCK_LEADS, MOCK_TASKS } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Initialization complete. I am NEURA. How can I assist with your sales intelligence today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.chatAssistant(input, MOCK_LEADS, MOCK_TASKS);
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: "Protocol error. Failed to process request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter">NEURA AI</h1>
        <p className="text-slate-500 text-sm font-medium tracking-tight">Real-time Conversational Intelligence.</p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-black text-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest">NEURA Core</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Operational</p>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-all">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20 dark:bg-slate-950/20 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[75%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-slate-200 text-black font-black' : 'bg-black text-white'
                }`}>
                  {msg.role === 'user' ? 'U' : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-tr-none shadow-xl' 
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-black dark:text-white animate-spin" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Processing Intelligence...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query NEURA Core..."
              className="w-full pl-8 pr-16 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-black dark:focus:ring-white focus:bg-white outline-none transition-all shadow-inner dark:text-white"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
                input.trim() && !isLoading ? 'bg-black text-white shadow-xl hover:scale-[1.05] active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Pipeline Summary', 'Hot Leads', 'Task Priority Alpha'].map((suggestion) => (
              <button 
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-all border border-slate-200 dark:border-slate-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
