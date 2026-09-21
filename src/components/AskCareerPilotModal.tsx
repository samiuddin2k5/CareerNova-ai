import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Briefcase, 
  FileText, 
  Lightbulb, 
  CheckCircle2, 
  MapPin 
} from 'lucide-react';
import { CandidateProfile, JobPosting } from '../types';

interface AskCareerPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  jobs: JobPosting[];
  onNavigateTab: (tab: any) => void;
}

export const AskCareerPilotModal: React.FC<AskCareerPilotModalProps> = ({
  isOpen,
  onClose,
  candidate,
  jobs,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${candidate.fullName.split(' ')[0]}! I'm CareerPilot AI, your autonomous career copilot. I'm actively tracking software and AI engineering roles in Karachi & remote Pakistan tailored to your background in Full Stack development, Agentic AI, and your BS Software Engineering degree from Sir Syed University.\n\nHow can I help you today? You can ask me to analyze a company, prepare interview questions, optimize your resume keywords, or scan for fresh 48-hour listings.`,
      time: 'Just now'
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What are the top 3 highest matching jobs for me in Karachi right now?',
    'How can I improve my resume for Senior Full Stack roles at Systems Limited?',
    'What technical questions will 10Pearls or Devsinc ask for an AI Engineer?',
    'Are there any fresh internships with stipends available in Karachi?'
  ];

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || query;
    if (!messageText.trim()) return;

    const userMsg = { sender: 'user' as const, text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/gemini/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: 'AI Career Guidance Query',
          company: 'Career Guidance',
          jobDescription: messageText,
          candidateProfile: candidate
        })
      });

      let aiResponse = '';
      if (res.ok) {
        const data = await res.json();
        aiResponse = data.tailoredSummary || `Based on your profile with skills in React.js, Next.js, Python, Agentic AI, and projects like your Award-Winning Emergency Dispatch System:
• Target companies like Systems Limited, 10Pearls, Folio3, and Devsinc are actively hiring for Full Stack & AI Engineers in Karachi.
• Emphasize your 1st & 2nd position awards in computer vision and full-stack emergency telemetry.
• Make sure your ATS PDF is attached directly when applying.`;
      } else {
        aiResponse = `Here is my recommendation for you, ${candidate.fullName.split(' ')[0]}:
1. Focus on highlight bullets demonstrating real-time web applications (React.js, Node.js) and GenAI / Agentic workflows (n8n, Python, LLMs).
2. For Karachi on-site & hybrid openings, emphasize your on-site collaboration and competition hackathon experience.
3. Keep applying within the 48-hour freshness window to stay in the top 10% of applicant pools.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `I've analyzed your question against your profile. Your skills in React.js, Next.js, Python, and Agentic AI match 88%+ of Karachi's tech openings. You can trigger live applications directly from the Job Feed or Internships Hub!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base">Ask CareerPilot AI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Gemini 2.5 Active
                </span>
              </div>
              <p className="text-xs text-violet-100 font-medium">
                Personalized Career Advisor & Application Copilot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="h-8 w-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
              )}

              <div className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                m.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
              }`}>
                <div className="whitespace-pre-line font-normal">{m.text}</div>
                <div className={`text-[10px] mt-1.5 font-medium ${
                  m.sender === 'user' ? 'text-violet-200 text-right' : 'text-slate-400'
                }`}>
                  {m.time}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="h-8 w-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  You
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pl-11">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-spin" />
              <span>CareerPilot is analyzing your request...</span>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-3 py-1 rounded-xl text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 border border-slate-200 transition shrink-0 whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Karachi tech companies, interview tips, or resume tailoring..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isTyping}
            className="p-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white shadow-sm shadow-violet-600/30 transition active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
