import React, { useState, useMemo } from 'react';
import { 
  JobPosting, 
  TargetRole, 
  CandidateProfile, 
  ApplicationRecord,
  UserSearchPreferences
} from '../types';
import { calculateCompatibilityScore } from '../lib/scoring';
import { matchesRoleCategory, matchesTargetRoles, matchesLocationList, matchesSkills } from '../lib/userFieldMatcher';
import { JobCard } from './JobCard';
import { GlobalLocationFilter } from './GlobalLocationFilter';
import { 
  Search, 
  Filter, 
  Clock, 
  Sparkles, 
  MapPin, 
  RefreshCw, 
  SlidersHorizontal, 
  Briefcase,
  AlertCircle,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface JobFeedProps {
  jobs: JobPosting[];
  candidate: CandidateProfile;
  applications: ApplicationRecord[];
  searchPreferences?: UserSearchPreferences;
  onOpenPreferences?: () => void;
  onOpenJobDetail: (job: JobPosting) => void;
  onSelectForApproval: (job: JobPosting) => void;
  onRefreshJobs: () => void;
  isRefreshing: boolean;
}

export const JobFeed: React.FC<JobFeedProps> = ({
  jobs,
  candidate,
  applications,
  searchPreferences,
  onOpenPreferences,
  onOpenJobDetail,
  onSelectForApproval,
  onRefreshJobs,
  isRefreshing
}) => {
  const activeRoles = useMemo(() => {
    if (searchPreferences?.targetRoles && searchPreferences.targetRoles.length > 0) {
      return searchPreferences.targetRoles;
    }
    if (searchPreferences?.targetRole) {
      return [searchPreferences.targetRole];
    }
    return [candidate.title || 'DevOps & Cloud Engineer'];
  }, [searchPreferences, candidate.title]);

  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [only48Hours, setOnly48Hours] = useState<boolean>(true);
  const [minMatchScore, setMinMatchScore] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'newest'>('score');

  // Compute scores and applications for each job
  const enrichedJobs = useMemo(() => {
    return jobs.map(job => {
      const breakdown = calculateCompatibilityScore(candidate, job);
      const application = applications.find(a => a.jobId === job.id);
      return {
        job,
        breakdown,
        application
      };
    });
  }, [jobs, candidate, applications]);

  // Count of jobs within the last 48 hours
  const recent48HoursCount = useMemo(() => {
    return enrichedJobs.filter(j => j.job.isWithin48Hours || j.job.postedHoursAgo <= 48).length;
  }, [enrichedJobs]);

  // Filter and sort jobs strictly according to user's signup preferences
  const filteredJobs = useMemo(() => {
    return enrichedJobs
      .filter(({ job, breakdown }) => {
        // 1. Strict Target Roles Match (NO unrelated fields allowed!)
        if (activeRoles.length > 0) {
          if (!matchesTargetRoles(job, activeRoles)) {
            return false;
          }
        }

        // Sub-filter only if user chose one of their multiple active roles
        if (selectedRole !== 'All') {
          if (!matchesTargetRoles(job, [selectedRole])) {
            return false;
          }
        }

        // 2. Country filter (Pakistan is optional and choosable, not compulsory):
        if (selectedCountry !== 'All') {
          if (selectedCountry === 'Pakistan') {
            const isPK = job.isKarachiOrRemotePK || 
                         job.country === 'Pakistan' || 
                         job.location.toLowerCase().includes('pakistan') || 
                         job.location.toLowerCase().includes('karachi') || 
                         job.location.toLowerCase().includes('lahore') || 
                         job.location.toLowerCase().includes('islamabad') ||
                         job.location.toLowerCase().includes('rawalpindi') ||
                         job.location.toLowerCase().includes('peshawar');
            if (!isPK) return false;
          } else if (selectedCountry === 'Global Remote') {
            const isGlobalRemote = job.country === 'Global Remote' || 
                                  (job.workMode === 'Remote' && (
                                    job.location.toLowerCase().includes('worldwide') || 
                                    job.location.toLowerCase().includes('anywhere')
                                  ));
            if (!isGlobalRemote) return false;
          } else {
            // Specific foreign country: strictly exclude Pakistan
            const isPK = job.isKarachiOrRemotePK || 
                         job.country === 'Pakistan' || 
                         job.location.toLowerCase().includes('pakistan');
            if (isPK) return false;

            const countryClean = selectedCountry.toLowerCase().trim();
            const matchesCountry = (job.country && job.country.toLowerCase().includes(countryClean)) || 
                                   job.location.toLowerCase().includes(countryClean);
            if (!matchesCountry) return false;
          }
        } else {
          // 'All': show globally including Pakistan and all international locations.
          // Respect specific non-global user saved locations if present:
          if (searchPreferences?.targetLocations && searchPreferences.targetLocations.length > 0) {
            const hasGlobalPreference = searchPreferences.targetLocations.some(loc => {
              const l = loc.toLowerCase().trim();
              return l === 'all' || l.includes('worldwide') || l.includes('global') || l.includes('all locations');
            });
            if (!hasGlobalPreference) {
              if (!matchesLocationList(job, searchPreferences.targetLocations)) {
                return false;
              }
            }
          }
        }

        // City filter
        if (selectedCity !== 'All') {
          const cityClean = selectedCity.split(',')[0].toLowerCase().trim();
          const matchesCity = (job.city && job.city.toLowerCase().includes(cityClean)) || 
                              job.location.toLowerCase().includes(cityClean);
          if (!matchesCity) return false;
        }

        // Work mode filter
        if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
          return false;
        }

        // 48 hours filter (only show posts within the last 48 hours)
        if (only48Hours && (!job.isWithin48Hours && job.postedHoursAgo > 48)) {
          return false;
        }

        // Min match score filter
        if (breakdown.totalScore < minMatchScore) {
          return false;
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matches =
            job.title.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.location.toLowerCase().includes(q) ||
            (job.country && job.country.toLowerCase().includes(q)) ||
            (job.city && job.city.toLowerCase().includes(q)) ||
            job.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
            job.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.breakdown.totalScore - a.breakdown.totalScore;
        } else {
          return a.job.postedHoursAgo - b.job.postedHoursAgo;
        }
      });
  }, [enrichedJobs, activeRoles, selectedRole, selectedCountry, selectedCity, selectedWorkMode, only48Hours, minMatchScore, searchQuery, sortBy, searchPreferences]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Control Banner & Search Filters */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">

        {/* User's Given Fields Status Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-violet-500/30 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-white text-xs">
                  Showing Roles For:
                </span>
                {activeRoles.map(role => (
                  <span key={role} className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold text-[11px]">
                    {role}
                  </span>
                ))}
                {searchPreferences?.targetLocations && searchPreferences.targetLocations.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                    {searchPreferences.targetLocations.join(' • ')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Filtered strictly according to your signup form preferences ({activeRoles.join(', ')}). Unrelated fields are excluded.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onOpenPreferences && (
              <button
                onClick={onOpenPreferences}
                className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Change Target Roles</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-jobs"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, global cities, skills (React, Next.js, Python, RAG, PyTorch, Node.js), companies (Google, Stripe, Systems, 10Pearls)..."
              className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded bg-slate-200 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Trigger for Live Apify Job Ingestion */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="btn-trigger-apify"
              onClick={onRefreshJobs}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 shadow-xs transition active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-violet-600' : 'text-violet-600'}`} />
              <span>{isRefreshing ? 'Scanning Portals...' : 'Live Apify Ingest'}</span>
            </button>

            {/* Sort Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setSortBy('score')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  sortBy === 'score' ? 'bg-white text-violet-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Highest Match
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  sortBy === 'newest' ? 'bg-white text-violet-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Newest (&lt;48h)
              </button>
            </div>
          </div>

        </div>

        {/* Global Country & City Filter Component */}
        <GlobalLocationFilter
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedWorkMode={selectedWorkMode}
          setSelectedWorkMode={setSelectedWorkMode}
          only48Hours={only48Hours}
          setOnly48Hours={setOnly48Hours}
          recent48HoursCount={recent48HoursCount}
          variant="violet"
          totalResultsCount={filteredJobs.length}
        />

        {/* Filter Pills: Role, 48-Hour Fresh, Match Slider */}
        <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3.5 text-xs">
          
          {/* Target Role Filters strictly scoped to user signup roles */}
          {activeRoles.length > 1 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Your Fields:</span>
              <button
                onClick={() => setSelectedRole('All')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedRole === 'All'
                    ? 'bg-violet-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                All My Roles ({activeRoles.length})
              </button>
              {activeRoles.map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    selectedRole === role
                      ? 'bg-violet-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Your Field:</span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
                {activeRoles[0] || 'DevOps & Cloud Engineer'}
              </span>
            </div>
          )}

          {/* 48-Hour Fresh Filter Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition">
            <input
              type="checkbox"
              checked={only48Hours}
              onChange={(e) => setOnly48Hours(e.target.checked)}
              className="accent-violet-600 rounded cursor-pointer"
            />
            <Clock className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-xs font-semibold text-slate-700">≤ 48h Verified Only</span>
          </label>

          {/* Compatibility Slider */}
          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-slate-500 text-xs font-medium">Min Match:</span>
            <input
              type="range"
              min="40"
              max="90"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-20 accent-violet-600 cursor-pointer"
            />
            <span className="text-xs font-black text-violet-700 font-mono">{minMatchScore}%</span>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredJobs.length}</span> verified job postings matching criteria
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Globe className="w-3.5 h-3.5 text-violet-600" />
          <span>
            {selectedCountry === 'All' 
              ? 'Global Feed (Worldwide + Remote)' 
              : `${selectedCountry}${selectedCity !== 'All' ? ` • ${selectedCity}` : ''}`}
          </span>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map(({ job, breakdown, application }) => (
            <JobCard
              key={job.id}
              job={job}
              scoreBreakdown={breakdown}
              application={application}
              onOpenDetails={onOpenJobDetail}
              onSelectForApproval={onSelectForApproval}
              onQuickTailorAndApply={onSelectForApproval}
              isProcessing={false}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Job Postings Match Current Filter Threshold</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your Location, Country/City filters, or Minimum Match Score slider, or trigger a live Apify search to ingest new listings.
          </p>
          <button
            onClick={() => {
              setSelectedRole('All');
              setSelectedCountry('All');
              setSelectedCity('All');
              setSelectedWorkMode('All');
              setMinMatchScore(50);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
