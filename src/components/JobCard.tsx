import React from 'react';
import { 
  JobPosting, 
  CompatibilityScoreBreakdown, 
  ApplicationRecord 
} from '../types';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Send, 
  FileCheck,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
  scoreBreakdown?: CompatibilityScoreBreakdown;
  application?: ApplicationRecord | null;
  onOpenDetails: (job: JobPosting) => void;
  onSelectForApproval: (job: JobPosting) => void;
  onQuickTailorAndApply: (job: JobPosting) => void;
  isProcessing: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  scoreBreakdown,
  application,
  onOpenDetails,
  onSelectForApproval,
  onQuickTailorAndApply,
  isProcessing
}) => {
  const score = scoreBreakdown?.totalScore || 85;

  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (s >= 70) return 'text-teal-700 border-teal-200 bg-teal-50';
    if (s >= 55) return 'text-amber-700 border-amber-200 bg-amber-50';
    return 'text-slate-600 border-slate-200 bg-slate-50';
  };

  const getStatusBadge = () => {
    if (!application) return null;
    switch (application.status) {
      case 'Sent':
      case 'Application Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Applied
          </span>
        );
      case 'Interview':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            🎉 Interview Scheduled
          </span>
        );
      case 'Awaiting Approval':
      case 'Email Ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            ⚡ Ready in Cockpit
          </span>
        );
      case 'Resume Enhanced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
            <FileCheck className="w-3 h-3" />
            Resume Tailored
          </span>
        );
      default:
        return null;
    }
  };

  const getCompanyBrandStyle = (company: string) => {
    const c = company.toLowerCase();
    if (c.includes('systems')) return { bg: 'bg-[#0a4275]', letter: 'Systems' };
    if (c.includes('10pearls')) return { bg: 'bg-[#111827]', letter: '10P' };
    if (c.includes('metricx')) return { bg: 'bg-[#059669]', letter: 'metricx' };
    if (c.includes('devsinc')) return { bg: 'bg-[#ea580c]', letter: 'devsinc' };
    if (c.includes('folio3')) return { bg: 'bg-[#4f46e5]', letter: 'folio3' };
    return { bg: 'bg-violet-600', letter: company.slice(0, 2).toUpperCase() };
  };

  const brand = getCompanyBrandStyle(job.company);

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 hover:border-violet-300 hover:shadow-md p-5 sm:p-6 transition-all duration-200 group flex flex-col justify-between relative shadow-xs">
      
      <div>
        {/* Top Meta Row */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl ${brand.bg} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs p-1 text-center leading-tight`}>
              {brand.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {job.company}
                </span>
                <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  {job.source}
                </span>
                {job.isWithin48Hours && (
                  <span className="text-[10px] text-violet-700 font-bold px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200">
                    &lt; 48h Fresh
                  </span>
                )}
              </div>
              <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-violet-700 transition line-clamp-1 mt-0.5">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Compatibility Score Pill */}
          <div className="flex flex-col items-end shrink-0">
            <div className={`px-2.5 py-1 rounded-xl border font-black text-xs flex items-center gap-1.5 shadow-xs ${getScoreColor(score)}`}>
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span className="font-mono">{score}%</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Match Fit</span>
          </div>

        </div>

        {/* Location & Status Line */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{job.location}</span>
            <span className="font-bold text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded text-[10px]">
              {job.workMode}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{job.postedHoursAgo}h ago</span>
          </div>

          {getStatusBadge()}
        </div>

        {/* Short Summary / Requirements Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed font-normal">
          {job.description}
        </p>

        {/* Key Matched Skills */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Tech Stack Required:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100">
                +{job.requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Direct Email Discovery Status */}
        {job.discoveredEmail && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              <span className="text-slate-500 text-[11px]">HR Contact:</span>
              <span className="text-slate-800 font-mono text-[11px] truncate">{job.discoveredEmail}</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 border border-emerald-200">
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        
        <button
          onClick={() => onOpenDetails(job)}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
        >
          <span>Match Matrix</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="flex items-center gap-2">
          {job.applicationUrl && (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              title="View on External Portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => onSelectForApproval(job)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Apply with AI</span>
          </button>
        </div>

      </div>

    </div>
  );
};
