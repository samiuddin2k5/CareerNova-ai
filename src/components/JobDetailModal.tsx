import React from 'react';
import { 
  JobPosting, 
  CompatibilityScoreBreakdown, 
  CandidateProfile, 
  ApplicationRecord 
} from '../types';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  Layers, 
  Send, 
  Mail, 
  Award,
  ChevronRight
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobPosting | null;
  scoreBreakdown?: CompatibilityScoreBreakdown;
  candidate: CandidateProfile;
  application?: ApplicationRecord | null;
  onClose: () => void;
  onProceedToCockpit: (job: JobPosting) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  scoreBreakdown,
  candidate,
  application,
  onClose,
  onProceedToCockpit
}) => {
  if (!job) return null;

  const score = scoreBreakdown?.totalScore || 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-slate-100 shrink-0">
              {job.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{job.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <MapPin className="w-3 h-3" /> {job.location} ({job.workMode})
                </span>
                <span>•</span>
                <span className="text-slate-500 font-mono">Job ID: {job.externalJobId}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-1">
                {job.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Compatibility Breakdown Gauge Banner */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Deterministic 5-Factor Compatibility Score
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated from genuine candidate profile data vs job requirements
                </p>
              </div>

              <div className="flex items-baseline gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl shrink-0">
                <span className="text-2xl font-black text-emerald-400">{score}</span>
                <span className="text-xs font-semibold text-emerald-500">/ 100</span>
              </div>
            </div>

            {/* 5-Factor Progress Bars */}
            {scoreBreakdown && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Tech Skills (35% wt):</span>
                    <span className="font-semibold text-emerald-400">{scoreBreakdown.technicalSkillMatch}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scoreBreakdown.technicalSkillMatch}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Semantic Fit (25% wt):</span>
                    <span className="font-semibold text-teal-400">{scoreBreakdown.semanticSimilarity}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreBreakdown.semanticSimilarity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Experience (20% wt):</span>
                    <span className="font-semibold text-cyan-400">{scoreBreakdown.experienceMatch}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${scoreBreakdown.experienceMatch}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Qualification (10% wt):</span>
                    <span className="font-semibold text-purple-400">{scoreBreakdown.qualificationMatch}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${scoreBreakdown.qualificationMatch}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Role Target (10% wt):</span>
                    <span className="font-semibold text-amber-400">{scoreBreakdown.roleMatch}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${scoreBreakdown.roleMatch}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Recommendation Summary */}
          {scoreBreakdown?.aiRecommendation && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Strategic Application Assessment:
              </div>
              <p className="text-slate-400 leading-relaxed">
                {scoreBreakdown.aiRecommendation}
              </p>
            </div>
          )}

          {/* Key Strengths & Potential Gaps */}
          {scoreBreakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Alignment Strengths:
                </span>
                <ul className="space-y-1">
                  {scoreBreakdown.keyStrengths.map((st, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Gaps & Tailoring Targets:
                </span>
                <ul className="space-y-1">
                  {scoreBreakdown.potentialGaps.length > 0 ? (
                    scoreBreakdown.potentialGaps.map((gp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{gp}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400">Zero material gaps identified for candidate background.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Job Description & Requirements */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Job Description & Core Scope
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
              {job.description}
            </p>
          </div>

          {/* Requirements List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Key Requirements & Qualifications
            </h3>
            <ul className="space-y-1.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Contact Discovery Meta */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Discovered Recipient Contact:</span>
              <span className="font-semibold text-slate-200">
                {job.discoveredEmail || 'Official Careers Web Portal'}
              </span>
              <span className="text-[10px] text-slate-500 block">{job.emailSource} • {job.emailConfidence}</span>
            </div>

            {job.applicationUrl && (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
              >
                <span>Visit Official Job Post</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onProceedToCockpit(job);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Proceed to Approval Cockpit</span>
          </button>
        </div>

      </div>
    </div>
  );
};
