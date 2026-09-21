import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle2, 
  Search, 
  Building2, 
  ArrowRight, 
  Paperclip, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ApplicationRecord, CandidateProfile, JobPosting } from '../types';

interface EmailsViewProps {
  applications: ApplicationRecord[];
  allJobs: JobPosting[];
  candidate: CandidateProfile;
  isGmailConnected: boolean;
  userGmail: string;
  onOpenGmailModal: () => void;
  onOpenCockpitForJob: (job: JobPosting) => void;
}

export const EmailsView: React.FC<EmailsViewProps> = ({
  applications,
  allJobs,
  candidate,
  isGmailConnected,
  userGmail,
  onOpenGmailModal,
  onOpenCockpitForJob
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'pending' | 'followup'>('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(applications[0] || null);

  const filteredApps = applications.filter(a => {
    if (activeFilter === 'sent' && a.status !== 'Sent' && a.status !== 'Application Submitted') return false;
    if (activeFilter === 'pending' && a.status !== 'Awaiting Approval' && a.status !== 'Email Ready') return false;
    if (activeFilter === 'followup' && (!a.followUpStatus || a.followUpStatus === 'Not Needed')) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.company.toLowerCase().includes(q) || a.jobTitle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-violet-600" />
            <span>Recruiter Emails & Dispatch Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track official HR contacts, tailored MIME drafts, verified PDF attachments, and automated follow-up sequences.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700 font-mono text-[11px]">{userGmail}</span>
          </div>
          <button
            onClick={onOpenGmailModal}
            className="px-3 py-1.5 rounded-2xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition"
          >
            Gmail Settings
          </button>
        </div>
      </div>

      {/* Main Grid: Email Thread List + Email Reader Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Email Thread List */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Search bar & filter pills */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emails by company or role..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${activeFilter === 'all' ? 'bg-violet-600 text-white' : 'hover:bg-slate-100'}`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setActiveFilter('sent')}
                className={`px-2.5 py-1 rounded-lg transition ${activeFilter === 'sent' ? 'bg-violet-600 text-white' : 'hover:bg-slate-100'}`}
              >
                Sent
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-2.5 py-1 rounded-lg transition ${activeFilter === 'pending' ? 'bg-violet-600 text-white' : 'hover:bg-slate-100'}`}
              >
                Ready in Cockpit
              </button>
              <button
                onClick={() => setActiveFilter('followup')}
                className={`px-2.5 py-1 rounded-lg transition ${activeFilter === 'followup' ? 'bg-violet-600 text-white' : 'hover:bg-slate-100'}`}
              >
                Follow-ups
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                No email records found.
              </div>
            ) : (
              filteredApps.map(app => {
                const isSelected = selectedApp?.id === app.id;
                const isSent = app.status === 'Sent' || app.status === 'Application Submitted';
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-violet-50/90 border-violet-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {app.company}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSent
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isSent ? 'Sent via Gmail' : 'Cockpit Draft'}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-700 truncate">
                      {app.jobTitle}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                      <span>{app.discoveredEmail || 'hr@' + app.company.toLowerCase().replace(/\s+/g, '') + '.com'}</span>
                      <span>{app.appliedDate || 'Pending'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Email Reader & Inspection Pane */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              
              {/* Top Details */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {selectedApp.applicationEmail?.subject || `Application: ${selectedApp.jobTitle} — ${candidate.fullName}`}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-slate-700">To:</span>
                    <span className="font-mono text-violet-700">{selectedApp.discoveredEmail || `careers@${selectedApp.company.toLowerCase().replace(/\s+/g, '')}.com`}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const job = allJobs.find(j => j.id === selectedApp.jobId);
                    if (job) onOpenCockpitForJob(job);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Open in Cockpit</span>
                </button>
              </div>

              {/* Verified Attachment Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-100 text-red-600 font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {candidate.fullName.replace(/\s+/g, '_')}_Resume_{selectedApp.company.replace(/\s+/g, '')}.pdf
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Attached with Tailored ATS Keywords
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 font-mono">142 KB</span>
              </div>

              {/* Email Body Content */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line space-y-4">
                {selectedApp.applicationEmail?.bodyText || `Dear Hiring Team at ${selectedApp.company},

I am writing to express my strong interest in the ${selectedApp.jobTitle} position. With my background in Full Stack Software Engineering, Agentic AI, and full-stack web applications (React.js, Next.js, TypeScript, Node.js, Python), I am excited about the opportunity to contribute to your engineering team in Karachi.

In my recent projects, I developed an Award-Winning Smart Emergency Dispatch System (1st Position) utilizing real-time telemetry and full-stack cloud workflows. I have also built AI computer vision systems and scalable microservices.

Please find my tailored resume attached for your review. I would welcome the opportunity to discuss how my skill set aligns with ${selectedApp.company}'s goals.

Thank you for your time and consideration.

Warm regards,

${candidate.fullName}
${candidate.phone} | ${candidate.email}
Karachi, Pakistan`}
              </div>

              {/* Follow-up Sequence Note */}
              <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100 flex items-start gap-3 text-xs text-violet-900">
                <Clock className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Autonomous Follow-Up Sequence Active</span>
                  <span className="text-violet-700 text-[11px]">
                    If no reply is detected in your inbox after 5 business days, CareerPilot will prepare a courteous follow-up draft in your Cockpit.
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500">
              Select an email thread from the left to view details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
