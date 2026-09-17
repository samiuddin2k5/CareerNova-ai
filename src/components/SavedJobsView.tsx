import React from 'react';
import { Bookmark, Building2, MapPin, Clock, ArrowRight, Trash2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { JobPosting, CandidateProfile } from '../types';
import { calculateCompatibilityScore } from '../lib/scoring';

interface SavedJobsViewProps {
  jobs: JobPosting[];
  candidate: CandidateProfile;
  savedJobIds: string[];
  onToggleSaveJob: (jobId: string) => void;
  onOpenJobDetail: (job: JobPosting) => void;
  onSelectForApproval: (job: JobPosting) => void;
  onNavigateToSearch: () => void;
}

export const SavedJobsView: React.FC<SavedJobsViewProps> = ({
  jobs,
  candidate,
  savedJobIds,
  onToggleSaveJob,
  onOpenJobDetail,
  onSelectForApproval,
  onNavigateToSearch
}) => {
  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-violet-600 fill-violet-600" />
            <span>Saved Jobs & Opportunities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Review your shortlisted roles and proceed to the AI Approval Cockpit whenever you are ready.
          </p>
        </div>

        <button
          onClick={onNavigateToSearch}
          className="px-4 py-2 rounded-2xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition shrink-0"
        >
          Explore More Openings
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">No saved jobs yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click the bookmark icon on any job card in your Dashboard or Job Feed to save and track it here.
            </p>
          </div>
          <button
            onClick={onNavigateToSearch}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-600/30 transition"
          >
            Browse High Match Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map(job => {
            const score = calculateCompatibilityScore(candidate, job).totalScore;
            return (
              <div
                key={job.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company}</span>
                        <span className="text-[10px] text-slate-400 font-normal">• {job.source}</span>
                      </div>
                      <h3
                        onClick={() => onOpenJobDetail(job)}
                        className="text-base font-bold text-slate-900 hover:text-violet-700 transition cursor-pointer mt-0.5"
                      >
                        {job.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black font-mono">
                        {score}%
                      </div>
                      <button
                        onClick={() => onToggleSaveJob(job.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location} ({job.workMode})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {job.postedHoursAgo}h ago
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requiredSkills.slice(0, 4).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenJobDetail(job)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    View Match Matrix
                  </button>

                  <button
                    onClick={() => onSelectForApproval(job)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Open in Cockpit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
