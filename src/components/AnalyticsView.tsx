import React from 'react';
import { 
  CareerAnalytics, 
  JobPosting, 
  ApplicationRecord, 
  CandidateProfile 
} from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  Clock, 
  Send, 
  Award, 
  CheckCircle2, 
  Building2, 
  Cpu, 
  Layers 
} from 'lucide-react';

interface AnalyticsViewProps {
  analytics: CareerAnalytics;
  jobs: JobPosting[];
  applications: ApplicationRecord[];
  candidate: CandidateProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  jobs,
  applications,
  candidate
}) => {
  // Compute top skills in current Karachi & Remote tech market
  const skillCounts: { [key: string]: number } = {};
  jobs.forEach(j => {
    j.requiredSkills.forEach(s => {
      skillCounts[s] = (skillCounts[s] || 0) + 1;
    });
  });

  const sortedSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxSkillCount = sortedSkills[0]?.[1] || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-slate-100">
              Career & Job Market Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time intelligence on Full Stack & AI engineering roles in Karachi & Pakistan Remote ecosystems
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
            {jobs.length} Verified Listings Analyzed
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Match Score</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {analytics.averageCompatibilityScore}%
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            High alignment with Karachi tech standards
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>≤ 48h Fresh Verified</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {analytics.jobsPassing48hFilter} / {analytics.totalJobsRetrieved}
          </div>
          <p className="text-[11px] text-cyan-400 font-medium">
            100% genuine real-time postings
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Applications Dispatched</span>
            <Send className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {analytics.sentApplicationsCount}
          </div>
          <p className="text-[11px] text-purple-400 font-medium">
            {analytics.awaitingApprovalCount} pending in Approval Cockpit
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Interview Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {analytics.responseRatePercent}%
          </div>
          <p className="text-[11px] text-amber-400 font-medium">
            {analytics.interviewCount} Active interview rounds
          </p>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Market Skill Demand in Karachi / Remote PK */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Most In-Demand Skills (Karachi & PK Remote)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Apify Live Ingestion</span>
          </div>

          <div className="space-y-3 pt-2">
            {sortedSkills.map(([skill, count]) => {
              const pct = Math.round((count / maxSkillCount) * 100);
              const candidateHas = 
                candidate.skills.programmingLanguages.includes(skill) ||
                candidate.skills.frameworks.includes(skill) ||
                candidate.skills.aiMlTech.includes(skill) ||
                candidate.skills.databases.includes(skill) ||
                candidate.skills.cloudDevOps.includes(skill);

              return (
                <div key={skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{skill}</span>
                      {candidateHas && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                          In Your Profile
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 font-medium">{count} Active Jobs</span>
                  </div>

                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location & Role Distribution */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Geographic & Role Distribution
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Work Mode */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Work Location Mode</span>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Karachi On-Site</span>
                  <span className="font-bold text-emerald-400">{analytics.karachiOnsiteJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Remote (Pakistan)</span>
                  <span className="font-bold text-blue-400">{analytics.pakistanRemoteJobs}</span>
                </div>
              </div>
            </div>

            {/* Target Role Ratio */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Target Role Match</span>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Full Stack Roles</span>
                  <span className="font-bold text-emerald-400">{analytics.fullStackMatches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">AI Engineer Roles</span>
                  <span className="font-bold text-purple-400">{analytics.aiEngineerMatches}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Hiring Companies in Karachi */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Verified Hiring Companies</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Array.from(new Set(jobs.map(j => j.company))).map(comp => (
                <span key={comp} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                  {comp}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
