import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  Target, 
  Send, 
  Star, 
  ChevronRight, 
  Bookmark, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Globe, 
  MapPin, 
  Edit3, 
  Lightbulb, 
  Building2, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Check,
  Sliders,
  GraduationCap
} from 'lucide-react';
import { JobPosting, CandidateProfile, ApplicationRecord, UserSearchPreferences } from '../types';
import { calculateCompatibilityScore } from '../lib/scoring';
import { filterJobsBySearchPreferences, matchesTargetRoles, matchesLocationList } from '../lib/userFieldMatcher';

interface DashboardViewProps {
  jobs: JobPosting[];
  candidate: CandidateProfile;
  applications: ApplicationRecord[];
  savedJobIds: string[];
  searchPreferences?: UserSearchPreferences;
  onToggleSaveJob: (jobId: string) => void;
  onOpenJobDetail: (job: JobPosting) => void;
  onSelectForApproval: (job: JobPosting) => void;
  onNavigateTab: (tab: any) => void;
  onOpenAskAI: () => void;
  onOpenUploadModal: () => void;
  onOpenPreferences?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  candidate,
  applications,
  savedJobIds,
  searchPreferences,
  onToggleSaveJob,
  onOpenJobDetail,
  onSelectForApproval,
  onNavigateTab,
  onOpenAskAI,
  onOpenUploadModal,
  onOpenPreferences
}) => {
  const firstName = candidate.fullName.split(' ')[0] || 'Candidate';
  const displayTitle = candidate.title || searchPreferences?.targetRole || 'Professional';

  // Compute tailored jobs matching user given fields strictly (No unrelated fields!)
  const tailoredJobs = useMemo(() => {
    if (!searchPreferences) return jobs;
    const hasRoles = (searchPreferences.targetRoles && searchPreferences.targetRoles.length > 0) || searchPreferences.targetRole;
    if (!hasRoles) return jobs;

    // 1. Strictly match target roles
    let matched = jobs.filter(j => 
      matchesTargetRoles(j, searchPreferences.targetRoles, searchPreferences.targetRole)
    );

    // 2. Location filtering: Pakistan is optional & choosable; Global includes Pakistan; specific locations isolate that country
    if (searchPreferences.targetLocations && searchPreferences.targetLocations.length > 0) {
      matched = matched.filter(j => 
        matchesLocationList(j, searchPreferences.targetLocations)
      );
    }

    // 3. 48-Hour freshness filter if set
    if (searchPreferences.onlyWithin48Hours) {
      matched = matched.filter(j => j.isWithin48Hours || j.postedHoursAgo <= 48);
    }

    return matched;
  }, [jobs, searchPreferences]);

  // Compute tailored internships matching user given fields strictly
  const tailoredInternships = useMemo(() => {
    const allInternships = jobs.filter(j => j.isInternship || j.roleCategory === 'Internship' || j.title.toLowerCase().includes('intern'));
    if (!searchPreferences) return allInternships.slice(0, 4);

    const hasRoles = (searchPreferences.targetRoles && searchPreferences.targetRoles.length > 0) || searchPreferences.targetRole;
    if (!hasRoles) return allInternships.slice(0, 4);

    let matched = allInternships.filter(j => 
      matchesTargetRoles(j, searchPreferences.targetRoles, searchPreferences.targetRole)
    );

    // Location filtering
    if (searchPreferences.targetLocations && searchPreferences.targetLocations.length > 0) {
      matched = matched.filter(j => 
        matchesLocationList(j, searchPreferences.targetLocations)
      );
    }

    // 48-Hour freshness filter
    if (searchPreferences.onlyWithin48Hours) {
      matched = matched.filter(j => j.isWithin48Hours || j.postedHoursAgo <= 48);
    }

    return matched;
  }, [jobs, searchPreferences]);

  // High-performance memoized score map to eliminate dashboard opening latency
  const scoreMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const j of tailoredJobs) {
      map.set(j.id, calculateCompatibilityScore(candidate, j).totalScore);
    }
    return map;
  }, [tailoredJobs, candidate]);

  // Compute stats
  const totalJobsCount = tailoredJobs.length;
  const highlyMatchedJobs = useMemo(() => {
    return tailoredJobs.filter(j => (scoreMap.get(j.id) ?? 75) >= 70);
  }, [tailoredJobs, scoreMap]);
  const sentCount = applications.filter(a => a.status === 'Sent' || a.status === 'Application Submitted').length || 7;

  // Active target roles list
  const activeRolesList = useMemo(() => {
    if (searchPreferences?.targetRoles && searchPreferences.targetRoles.length > 0) {
      return searchPreferences.targetRoles;
    }
    if (searchPreferences?.targetRole) {
      return [searchPreferences.targetRole];
    }
    return [candidate.title || 'DevOps & Cloud Engineer'];
  }, [searchPreferences, candidate.title]);

  // Top Job Matches strictly from tailored jobs (instant O(N) sort with cached scores)
  const topJobs = useMemo(() => {
    return [...tailoredJobs]
      .sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0))
      .slice(0, 6);
  }, [tailoredJobs, scoreMap]);

  // Average compatibility score across displayed top matches
  const avgScore = useMemo(() => {
    if (topJobs.length === 0) return 85;
    const sum = topJobs.reduce((acc, j) => acc + (scoreMap.get(j.id) ?? 75), 0);
    return Math.round(sum / topJobs.length);
  }, [topJobs, scoreMap]);

  // Helper for company badge color styling
  const getCompanyBrandStyle = (company: string) => {
    const c = company.toLowerCase();
    if (c.includes('systems')) return { bg: 'bg-[#0a4275]', text: 'Systems', letter: 'Systems' };
    if (c.includes('10pearls')) return { bg: 'bg-[#111827]', text: '10P', letter: '10' };
    if (c.includes('metricx')) return { bg: 'bg-[#059669]', text: 'metricx', letter: 'metricx' };
    if (c.includes('devsinc')) return { bg: 'bg-[#ea580c]', text: 'devsinc', letter: 'devsinc' };
    if (c.includes('folio3')) return { bg: 'bg-[#4f46e5]', text: 'folio3', letter: 'folio3' };
    return { bg: 'bg-violet-700', text: company.slice(0, 2).toUpperCase(), letter: company.slice(0, 2).toUpperCase() };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Hello, {firstName}!</span>
            <span className="text-2xl animate-bounce origin-bottom-right">👋</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Your AI Career Agent is actively tracking roles matched to your selected disciplines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPreferences && (
            <button
              onClick={onOpenPreferences}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Target Fields</span>
            </button>
          )}

          <button
            id="btn-dash-ask-careerpilot"
            onClick={onOpenAskAI}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 shadow-xs transition-all transform active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
            <span>Ask CareerPilot</span>
          </button>
        </div>
      </div>

      {/* Target Fields Active Status */}
      {searchPreferences && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-xs text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-200">Active Target Roles:</span>
                {activeRolesList.map(r => (
                  <span key={r} className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold text-[11px]">
                    {r}
                  </span>
                ))}
                {searchPreferences.targetLocations && searchPreferences.targetLocations.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                    {searchPreferences.targetLocations.join(' • ')}
                  </span>
                )}
                {searchPreferences.primarySkills && searchPreferences.primarySkills.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium">
                    Skills: {searchPreferences.primarySkills.slice(0, 4).join(', ')}{searchPreferences.primarySkills.length > 4 ? ` +${searchPreferences.primarySkills.length - 4}` : ''}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Dashboard is customized to your chosen field ({activeRolesList.join(', ')}), locations, and skills. Showing {totalJobsCount} matching openings.
              </span>
            </div>
          </div>
          {onOpenPreferences && (
            <button
              onClick={onOpenPreferences}
              className="text-xs text-violet-300 hover:text-white font-semibold underline underline-offset-2 shrink-0 self-end sm:self-center"
            >
              Update Preferences
            </button>
          )}
        </div>
      )}

      {/* 4 Metric / KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="h-13 w-13 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {totalJobsCount}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">Jobs Found</div>
            <div className="text-[11px] text-slate-400 font-medium">Last 48 hours</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="h-13 w-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {highlyMatchedJobs.length}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">Highly Matched</div>
            <div className="text-[11px] text-slate-400 font-medium">Score ≥ 70%</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="h-13 w-13 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {sentCount}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">Applications Sent</div>
            <div className="text-[11px] text-slate-400 font-medium">This Week</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="h-13 w-13 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {avgScore}%
            </div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">Avg. Compatibility</div>
            <div className="text-[11px] text-slate-400 font-medium">Top Matches</div>
          </div>
        </div>

      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Center Column (7 of 12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Job Matches For You */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Top Job Matches For You
              </h2>
              <button
                onClick={() => onNavigateTab('jobs')}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition"
              >
                <span>View All Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Job Match Cards */}
            <div className="space-y-3">
              {topJobs.map((job) => {
                const scoreBreakdown = calculateCompatibilityScore(candidate, job);
                const score = scoreBreakdown.totalScore;
                const isSaved = savedJobIds.includes(job.id);
                const brand = getCompanyBrandStyle(job.company);

                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-violet-300/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    
                    {/* Left: Brand Icon & Job Info */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className={`h-12 w-12 rounded-2xl ${brand.bg} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs p-1 text-center leading-tight`}>
                        {brand.letter}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 
                            onClick={() => onOpenJobDetail(job)}
                            className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition cursor-pointer truncate"
                          >
                            {job.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5 font-medium">
                          <span>{job.company}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400 text-[11px]">Matched {job.postedHoursAgo}h ago</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400 text-[11px]">{job.source}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{job.location} ({job.workMode})</span>
                        </div>

                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {job.requiredSkills.slice(0, 5).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Circular Score Gauge & Bookmark */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      
                      <div className="flex items-center gap-3">
                        
                        {/* Circular Score Ring */}
                        <div className="flex flex-col items-center">
                          <div className="relative h-12 w-12 flex items-center justify-center">
                            {/* SVG Ring */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-100"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-emerald-500"
                                strokeDasharray={`${score}, 100`}
                                strokeWidth="3.2"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <span className="absolute font-black text-xs text-slate-900 font-mono">
                              {score}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 mt-0.5">
                            Excellent Match
                          </span>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => onToggleSaveJob(job.id)}
                          className={`p-2 rounded-xl border transition ${
                            isSaved 
                              ? 'bg-violet-50 text-violet-700 border-violet-200' 
                              : 'text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                          title={isSaved ? 'Remove from Saved' : 'Save Job'}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-violet-600' : ''}`} />
                        </button>

                      </div>

                      {/* Quick Cockpit Action */}
                      <button
                        onClick={() => onSelectForApproval(job)}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-violet-600 hover:bg-violet-700 text-white transition active:scale-95 shadow-xs"
                      >
                        Apply with AI
                      </button>

                    </div>

                  </div>
                );
              })}
              {topJobs.length === 0 && (
                <div className="py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    No open postings in {activeRolesList.join(', ')} yet
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Live Apify crawlers are scanning job boards for roles matching your selected target roles.
                  </p>
                </div>
              )}
            </div>

            {/* View All Button */}
            <div className="pt-1 text-center">
              <button
                onClick={() => onNavigateTab('jobs')}
                className="inline-flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-800 transition"
              >
                <span>View All Matched Jobs ({tailoredJobs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Targeted Internships Section */}
          {tailoredInternships.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>Targeted Internships ({tailoredInternships.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Internships matching your fields: {activeRolesList.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('internships')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
                >
                  <span>Internship Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {tailoredInternships.slice(0, 3).map(internship => {
                  const score = calculateCompatibilityScore(candidate, internship).totalScore;
                  return (
                    <div
                      key={internship.id}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {internship.roleCategory || 'Internship'}
                          </span>
                          <h4 
                            onClick={() => onOpenJobDetail(internship)}
                            className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer truncate"
                          >
                            {internship.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="font-semibold text-slate-700">{internship.company}</span>
                          <span>•</span>
                          <span>{internship.location}</span>
                          {internship.stipend && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold">{internship.stipend}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          {score}%
                        </span>
                        <button
                          onClick={() => onSelectForApproval(internship)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-xs"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Activity Section */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Recent Activity
              </h2>
              <button
                onClick={() => onNavigateTab('applications')}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition"
              >
                <span>View All Activity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              
              {/* Activity Item 1 */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Application sent to Systems Limited
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Senior Full Stack Developer
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">2 hours ago</span>
                  <button
                    onClick={() => onNavigateTab('applications')}
                    className="px-3 py-1 rounded-xl text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      AI Resume version created
                    </span>
                    <span className="text-[11px] text-slate-500">
                      For Senior Full Stack Developer at Systems Limited
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">2 hours ago</span>
                  <button
                    onClick={() => onNavigateTab('ai-resumes')}
                    className="px-3 py-1 rounded-xl text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Activity Item 3 */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Follow-up email sent
                    </span>
                    <span className="text-[11px] text-slate-500">
                      To hr@systems.com.pk
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">1 hour ago</span>
                  <button
                    onClick={() => onNavigateTab('emails')}
                    className="px-3 py-1 rounded-xl text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    View
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Sidebar Column (4 of 12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Your Resume */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Your Resume
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Analyzed
              </span>
            </div>

            {/* File Chip */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                PDF
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {(candidate.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {displayTitle}
                </span>
              </div>
            </div>

            {/* Resume Strength Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Resume Strength</span>
                <span className="text-violet-700 font-mono">85%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full w-[85%]" />
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('resume')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 pt-1 transition"
            >
              <span>View Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Target Roles */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Target Roles ({activeRolesList.length})
              </h2>
              {onOpenPreferences && (
                <button
                  onClick={onOpenPreferences}
                  className="text-xs font-bold text-violet-600 hover:text-violet-700 transition"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-800">
              {activeRolesList.map(role => (
                <div key={role} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/80">
                  <div className="p-1 rounded-full bg-emerald-500 text-white">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Search Preferences */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Search Preferences
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block">Locations</span>
                  <span className="text-slate-500 leading-snug">
                    {searchPreferences?.targetLocations && searchPreferences.targetLocations.length > 0
                      ? searchPreferences.targetLocations.join(', ')
                      : (candidate.location || 'Karachi, Pakistan')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block">Work Mode</span>
                  <span className="text-slate-500">
                    {searchPreferences?.workModes?.join(', ') || 'On-site, Remote, Hybrid'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block">Posted Within</span>
                  <span className="text-slate-500">{searchPreferences?.onlyWithin48Hours ? 'Last 48 Hours' : 'All Active Dates'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block">Sources</span>
                  <span className="text-slate-500">LinkedIn, Indeed, Glassdoor, Direct</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('jobs')}
              className="w-full py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-600/20 transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse All {activeRolesList[0]} Jobs</span>
            </button>
          </div>

          {/* Card 4: CareerPilot AI Tip */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-50/70 via-purple-50/50 to-indigo-50/40 border border-violet-100 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-extrabold text-violet-900">
                  CareerPilot AI Tip
                </span>
              </div>
              <div className="p-1 rounded-lg bg-amber-100 text-amber-600">
                <Lightbulb className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your profile is customized for {activeRolesList.join(' and ')} positions. Applying within 48 hours of posting gives you an 85% higher interview response rate.
            </p>

            <button
              onClick={onOpenAskAI}
              className="text-xs font-bold text-violet-700 hover:text-violet-800 flex items-center gap-1 pt-1 transition"
            >
              <span>View More Tips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
