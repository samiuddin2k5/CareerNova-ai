import React, { useState } from 'react';
import { 
  ApplicationRecord, 
  JobPosting, 
  CandidateProfile 
} from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle, 
  Building2, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  FileText, 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  MoreVertical,
  Filter,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationTrackerProps {
  applications: ApplicationRecord[];
  allJobs: JobPosting[];
  candidate: CandidateProfile;
  onUpdateApplication: (app: ApplicationRecord) => void;
  onOpenCockpitForJob: (job: JobPosting) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  allJobs,
  candidate,
  onUpdateApplication,
  onOpenCockpitForJob
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeFollowUpApp, setActiveFollowUpApp] = useState<ApplicationRecord | null>(null);
  const [followUpDraft, setFollowUpDraft] = useState<string>('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  const statuses: ApplicationRecord['status'][] = [
    'Recommended',
    'Awaiting Approval',
    'Sent',
    'Interview',
    'Rejected'
  ];

  const handleStatusChange = async (app: ApplicationRecord, newStatus: ApplicationRecord['status']) => {
    try {
      const updated = {
        ...app,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.application) {
        onUpdateApplication(data.application);
      }
      if (newStatus === 'Interview') {
        confetti({ particleCount: 70, spread: 60 });
      }
    } catch (e) {
      console.error('Failed to change status:', e);
    }
  };

  const handleOpenFollowUpModal = async (app: ApplicationRecord) => {
    setActiveFollowUpApp(app);
    try {
      const res = await fetch(`/api/applications/${app.id}/follow-up`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.followUpDraft) {
        setFollowUpDraft(data.followUpDraft);
      }
    } catch (e) {
      console.error('Follow-up draft error:', e);
    }
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-slate-100">
              Career Application Pipeline & Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of sent Gmail applications, follow-up schedules, and recruiter responses
          </p>
        </div>

        {/* View mode toggle & Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'kanban' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'list' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List View
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="All">All Statuses ({applications.length})</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {statuses.map(status => {
            const appsInStatus = applications.filter(a => a.status === status);
            return (
              <div key={status} className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 space-y-3 min-w-[260px]">
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">{status}</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {appsInStatus.length}
                  </span>
                </div>

                {/* Cards in column */}
                <div className="space-y-3 min-h-[150px]">
                  {appsInStatus.map(app => {
                    const job = allJobs.find(j => j.id === app.jobId);
                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-2 shadow-sm transition"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                            {app.jobTitle}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 shrink-0">
                            {app.compatibilityScore}%
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          {app.company}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                          <span>{app.location.split(',')[0]}</span>
                          {app.gmailMessageId && (
                            <span className="text-emerald-400 font-mono">Gmail Sent</span>
                          )}
                        </div>

                        {/* Status Select & Quick Actions */}
                        <div className="pt-2 flex items-center justify-between gap-1">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app, e.target.value as any)}
                            className="text-[10px] bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300 focus:outline-none"
                          >
                            {statuses.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          {job && (
                            <button
                              onClick={() => onOpenCockpitForJob(job)}
                              className="text-[10px] font-semibold text-emerald-400 hover:underline"
                            >
                              Cockpit
                            </button>
                          )}
                        </div>

                        {/* Follow up button if sent */}
                        {(app.status === 'Sent' || app.status === 'Application Submitted') && (
                          <button
                            onClick={() => handleOpenFollowUpModal(app)}
                            className="w-full mt-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 border border-slate-700 transition"
                          >
                            📅 Schedule Follow-up
                          </button>
                        )}

                      </div>
                    );
                  })}

                  {appsInStatus.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-600">
                      No applications in this stage
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Target Role & Company</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Match Score</th>
                  <th className="p-4">Recipient Channel</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Sent/Applied Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredApps.map(app => {
                  const job = allJobs.find(j => j.id === app.jobId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-100">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-400">{app.company} • {app.jobSource}</div>
                      </td>
                      <td className="p-4 text-slate-400">
                        {app.location} ({app.workMode})
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                          {app.compatibilityScore}%
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">
                        {app.discoveredEmail || 'Direct Portal'}
                      </td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as any)}
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200"
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-slate-400">
                        {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Pending Approval'}
                      </td>
                      <td className="p-4 text-right">
                        {job && (
                          <button
                            onClick={() => onOpenCockpitForJob(job)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition"
                          >
                            Open Cockpit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Follow-up Draft Modal */}
      {activeFollowUpApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              Follow-Up Email Drafter: {activeFollowUpApp.company}
            </h3>

            <p className="text-xs text-slate-400">
              Professional follow-up drafted for {activeFollowUpApp.jobTitle}. Ready to send or copy.
            </p>

            <textarea
              rows={8}
              value={followUpDraft}
              onChange={(e) => setFollowUpDraft(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveFollowUpApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Close
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(followUpDraft);
                  setCopiedDraft(true);
                  setTimeout(() => setCopiedDraft(false), 2000);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition"
              >
                {copiedDraft ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDraft ? 'Copied to Clipboard' : 'Copy Follow-up Draft'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
