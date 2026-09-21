import React, { useState, useMemo } from 'react';
import { 
  JobPosting, 
  CandidateProfile, 
  ApplicationRecord,
  UserSearchPreferences
} from '../types';
import { calculateCompatibilityScore } from '../lib/scoring';
import { matchesRoleCategory, matchesTargetRoles, matchesLocationList, matchesSkills } from '../lib/userFieldMatcher';
import { GlobalLocationFilter } from './GlobalLocationFilter';
import { 
  GraduationCap, 
  Sparkles, 
  Building2, 
  MapPin, 
  Banknote, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter, 
  ArrowRight, 
  Award, 
  BookOpen, 
  Lightbulb, 
  Users,
  Briefcase,
  Globe,
  Sliders,
  Clock,
  Zap
} from 'lucide-react';

interface InternshipHubProps {
  jobs: JobPosting[];
  candidate: CandidateProfile;
  applications: ApplicationRecord[];
  searchPreferences?: UserSearchPreferences;
  onOpenPreferences?: () => void;
  onOpenJobDetail: (job: JobPosting) => void;
  onSelectForApproval: (job: JobPosting) => void;
  onNavigateToJobs: () => void;
}

export const InternshipHub: React.FC<InternshipHubProps> = ({
  jobs,
  candidate,
  applications,
  searchPreferences,
  onOpenPreferences,
  onOpenJobDetail,
  onSelectForApproval,
  onNavigateToJobs
}) => {
  const activeRoles = useMemo(() => {
    if (searchPreferences?.targetRoles && searchPreferences.targetRoles.length > 0) {
      return searchPreferences.targetRoles;
    }
    if (searchPreferences?.targetRole && searchPreferences.targetRole !== 'Internship') {
      return [searchPreferences.targetRole];
    }
    return [candidate.title || 'DevOps & Cloud Engineer'];
  }, [searchPreferences, candidate.title]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'All' | 'LinkedIn' | 'Indeed' | 'Rozee.pk' | 'Glassdoor' | 'Direct Careers'>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<'All' | '2026' | '2025'>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'stipend' | 'company'>('match');
  const [only48Hours, setOnly48Hours] = useState<boolean>(searchPreferences?.onlyWithin48Hours ?? false);

  // Filter only internships
  const internshipPostings = useMemo(() => {
    return jobs.filter(j => j.isInternship || j.roleCategory === 'Internship' || j.title.toLowerCase().includes('intern'));
  }, [jobs]);

  // Count of internships posted within the last 48 hours
  const recent48HoursCount = useMemo(() => {
    return internshipPostings.filter(j => j.isWithin48Hours || j.postedHoursAgo <= 48).length;
  }, [internshipPostings]);

  // Compute scores and applications for each internship
  const enrichedInternships = useMemo(() => {
    return internshipPostings.map(job => {
      const breakdown = calculateCompatibilityScore(candidate, job);
      const application = applications.find(a => a.jobId === job.id);
      return {
        job,
        breakdown,
        application
      };
    });
  }, [internshipPostings, candidate, applications]);

  // Unique companies list with counts
  const companyOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    internshipPostings.forEach(j => {
      counts[j.company] = (counts[j.company] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [internshipPostings]);

  // Counts by source
  const linkedInCount = useMemo(() => internshipPostings.filter(j => j.source === 'LinkedIn').length, [internshipPostings]);
  const indeedCount = useMemo(() => internshipPostings.filter(j => j.source === 'Indeed').length, [internshipPostings]);
  const otherSourceCount = useMemo(() => internshipPostings.filter(j => j.source !== 'LinkedIn' && j.source !== 'Indeed').length, [internshipPostings]);

  // Counts by timeline (2025 vs 2026)
  const count2026 = useMemo(() => internshipPostings.filter(j => (j.internshipBatch && j.internshipBatch.includes('2026')) || j.postedHoursAgo <= 120).length, [internshipPostings]);
  const count2025 = useMemo(() => internshipPostings.filter(j => (j.internshipBatch && j.internshipBatch.includes('2025')) || j.postedHoursAgo > 120).length, [internshipPostings]);

  // Filter internships strictly based on user's target roles and preferences
  const filteredInternships = useMemo(() => {
    const list = enrichedInternships.filter(({ job }) => {
      // 1. Strict Target Roles Matching (NO UNRELATED FIELDS):
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

      // 2. 48-Hour Filter: Show posts published within the last 48 hours
      if (only48Hours) {
        if (!job.isWithin48Hours && job.postedHoursAgo > 48) {
          return false;
        }
      }

      // 3. Location Filter (Pakistan is optional and choosable, not compulsory):
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
          // A specific other country was chosen (e.g., United States, United Kingdom, Germany, etc.):
          // Strictly exclude Pakistan jobs
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
        // If selectedCountry is 'All', show globally (includes Pakistan AND all worldwide locations).
        // If user has specific non-global locations saved in searchPreferences, respect them:
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

      // 4. Work Mode Match:
      if (searchPreferences?.workModes && searchPreferences.workModes.length > 0 && searchPreferences.workModes.length < 3) {
        if (!searchPreferences.workModes.includes(job.workMode)) {
          return false;
        }
      }

      // Source filter
      if (selectedSource !== 'All') {
        if (job.source !== selectedSource) return false;
      }

      // Timeline filter
      if (selectedTimeline === '2026') {
        const is2026 = (job.internshipBatch && job.internshipBatch.includes('2026')) || job.postedHoursAgo <= 120;
        if (!is2026) return false;
      } else if (selectedTimeline === '2025') {
        const is2025 = (job.internshipBatch && job.internshipBatch.includes('2025')) || job.postedHoursAgo > 120;
        if (!is2025) return false;
      }

      // Company filter
      if (selectedCompany !== 'All' && job.company !== selectedCompany) {
        return false;
      }

      // City filter
      if (selectedCity !== 'All') {
        const cityClean = selectedCity.split(',')[0].toLowerCase().trim();
        const matchesCity = (job.city && job.city.toLowerCase().includes(cityClean)) || 
                            job.location.toLowerCase().includes(cityClean);
        if (!matchesCity) return false;
      }

      // Work Mode filter
      if (selectedWorkMode !== 'All') {
        if (job.workMode !== selectedWorkMode) return false;
      }

      // Duration filter
      if (selectedDuration !== 'All') {
        if (!job.internshipDuration?.includes(selectedDuration)) return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = job.company.toLowerCase().includes(q);
        const inDesc = job.description.toLowerCase().includes(q);
        const inSkills = job.requiredSkills.some(s => s.toLowerCase().includes(q));
        const inBatch = job.internshipBatch?.toLowerCase().includes(q);
        const inLoc = job.location.toLowerCase().includes(q) || (job.country && job.country.toLowerCase().includes(q));
        if (!inTitle && !inCompany && !inDesc && !inSkills && !inBatch && !inLoc) return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'match') {
        return b.breakdown.totalScore - a.breakdown.totalScore;
      }
      if (sortBy === 'recent') {
        return a.job.postedHoursAgo - b.job.postedHoursAgo;
      }
      if (sortBy === 'stipend') {
        const getStipendVal = (st?: string) => {
          if (!st) return 0;
          const match = st.match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        };
        return getStipendVal(b.job.stipend) - getStipendVal(a.job.stipend);
      }
      if (sortBy === 'company') {
        return a.job.company.localeCompare(b.job.company);
      }
      return 0;
    });
  }, [
    enrichedInternships, 
    activeRoles,
    searchPreferences,
    selectedRole,
    selectedSource, 
    selectedTimeline, 
    selectedCompany, 
    selectedCountry,
    selectedCity,
    selectedWorkMode, 
    selectedDuration, 
    searchQuery, 
    sortBy
  ]);

  // Average compatibility score across displayed results
  const avgMatchScore = useMemo(() => {
    if (filteredInternships.length === 0) return 0;
    const sum = filteredInternships.reduce((acc, curr) => acc + curr.breakdown.totalScore, 0);
    return Math.round(sum / filteredInternships.length);
  }, [filteredInternships]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* User's Given Fields Status Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-white text-xs">
                Showing Internships For:
              </span>
              {activeRoles.map(role => (
                <span key={role} className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px]">
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
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Change Target Fields</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Top Banner / Hero Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Global Tech Internships & Fellowships Hub (2025–2026 Archive)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineering & AI Internships
            </h1>
            
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Active opportunities across global tech hubs and worldwide remote positions. Filter across countries, cities, domains, and platforms (LinkedIn, Indeed, Google, DeepMind, G42, 10Pearls) with verified stipends and pre-placement offer (PPO) conversion tracks.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Total Listed</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {internshipPostings.length}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Global Portals</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Active vs Prev</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                <span className="text-emerald-700 font-bold">{count2026}</span> / <span className="text-slate-500">{count2025}</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">2026 / 2025</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Platforms</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {linkedInCount} LI • {indeedCount} IND
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">+{otherSourceCount} Global Desks</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Match Average</span>
              <span className="text-xl font-black text-emerald-700 font-mono">
                {avgMatchScore}%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">High Target Fit</span>
            </div>
          </div>

        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
        
        {/* Top Search & Timeline Filter Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-internships"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search internship by role, global city, company (Google, DeepMind, G42, 10Pearls), technology (React, Python, AI)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Timeline Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
            <button
              id="filter-timeline-all"
              onClick={() => setSelectedTimeline('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTimeline === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Batches ({internshipPostings.length})
            </button>
            <button
              id="filter-timeline-2026"
              onClick={() => setSelectedTimeline('2026')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTimeline === '2026'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2026 Active ({count2026})
            </button>
            <button
              id="filter-timeline-2025"
              onClick={() => setSelectedTimeline('2025')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTimeline === '2025'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2025 Archive ({count2025})
            </button>
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
          variant="emerald"
          totalResultsCount={filteredInternships.length}
        />

        {/* Target Role Filters strictly scoped to user signup roles */}
        {activeRoles.length > 1 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Your Fields:</span>
            <button
              onClick={() => setSelectedRole('All')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                selectedRole === 'All'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              All My Fields ({activeRoles.length})
            </button>
            {activeRoles.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedRole === role
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
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
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeRoles[0] || 'DevOps & Cloud Engineer'}
            </span>
          </div>
        )}

        {/* Dropdowns Row: Platform, Company, Duration, Sort */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs gap-3">
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Source */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Source:</span>
              <select
                id="select-internship-source"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 text-xs outline-none focus:border-emerald-500"
              >
                <option value="All">All Sources</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Rozee.pk">Rozee.pk</option>
                <option value="Direct Careers">Direct Careers</option>
              </select>
            </div>

            {/* Company */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Company:</span>
              <select
                id="select-internship-company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 text-xs outline-none focus:border-emerald-500 max-w-[170px]"
              >
                <option value="All">All Companies ({companyOptions.length})</option>
                {companyOptions.map(([comp, cnt]) => (
                  <option key={comp} value={comp}>
                    {comp} ({cnt})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Duration:</span>
              <select
                id="select-internship-duration"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 text-xs outline-none focus:border-emerald-500"
              >
                <option value="All">All Durations</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="Summer">Summer Cohort</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Sort By:</span>
              <select
                id="select-internship-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-emerald-800 font-semibold text-xs outline-none focus:border-emerald-500"
              >
                <option value="match">Highest Match Score</option>
                <option value="recent">Latest Posted / Active</option>
                <option value="stipend">Highest Stipend</option>
                <option value="company">Company Name (A-Z)</option>
              </select>
            </div>

          </div>

          <div className="text-slate-500 text-xs font-medium">
            Showing <strong className="text-slate-900">{filteredInternships.length}</strong> of <strong className="text-emerald-700">{internshipPostings.length}</strong> internships
          </div>

        </div>

      </div>

      {/* Main Content Layout: Internships Grid + Playbook Tips Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Internship Cards */}
        <div className="lg:col-span-2 space-y-3.5">
          
          {filteredInternships.length === 0 ? (
            <div className="rounded-3xl bg-white border border-slate-200/90 p-12 text-center space-y-4">
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No internships matched your specific filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search query or changing your country/city filters to view all available worldwide tech internships.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('All');
                  setSelectedCountry('All');
                  setSelectedCity('All');
                  setSelectedWorkMode('All');
                  setSelectedDuration('All');
                  setSelectedSource('All');
                  setSelectedCompany('All');
                }}
                className="px-4 py-2 rounded-2xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredInternships.map(({ job, breakdown, application }) => {
              const isApplied = application?.status === 'Sent' || application?.status === 'Application Submitted';
              const isReadyInCockpit = application?.status === 'Awaiting Approval' || application?.status === 'Email Ready';

              return (
                <div
                  key={job.id}
                  id={`internship-card-${job.id}`}
                  className="rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md p-5 sm:p-6 transition-all duration-200 group relative flex flex-col justify-between shadow-xs"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3.5">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-black text-sm shrink-0 shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {job.company}
                            </span>

                            {/* Source Platform Badge */}
                            {job.source === 'LinkedIn' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                                <span className="font-extrabold text-[11px]">in</span> LinkedIn
                              </span>
                            ) : job.source === 'Indeed' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                                <span className="font-extrabold text-[11px]">ind</span> Indeed
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {job.source || 'Direct'}
                              </span>
                            )}

                            {job.internshipBatch && (
                              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                {job.internshipBatch}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition mt-1">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-xs font-mono shadow-xs">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{breakdown.totalScore}% Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Meta Badges: Location, WorkMode, Stipend, Duration */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                        job.workMode === 'Remote' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : job.workMode === 'Hybrid'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        <Briefcase className="w-3 h-3" />
                        {job.workMode}
                      </span>

                      {job.stipend && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          {job.stipend}
                        </span>
                      )}

                      {job.internshipDuration && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {job.internshipDuration}
                        </span>
                      )}

                      {/* 48-Hour Fresh Post Badge */}
                      {(job.isWithin48Hours || job.postedHoursAgo <= 48) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold shadow-2xs">
                          <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>{job.postedHoursAgo === 0 ? 'Just posted (<1h)' : `${job.postedHoursAgo}h ago`}</span>
                          <span className="bg-amber-200/70 text-amber-900 text-[10px] px-1 py-0.2 rounded-md font-mono">Fresh &lt;48h</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{Math.round(job.postedHoursAgo / 24)}d ago</span>
                        </span>
                      )}

                      {isApplied && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Applied
                        </span>
                      )}

                      {isReadyInCockpit && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                          ⚡ Ready in Cockpit
                        </span>
                      )}
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Perks Tags */}
                    {job.perks && job.perks.length > 0 && (
                      <div className="mb-3.5 bg-slate-50/80 rounded-2xl p-2.5 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-500" />
                          Cohort Benefits & Pre-Placement Path:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {job.perks.map((perk, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs"
                            >
                              ✓ {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Skills */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {job.requiredSkills.map((skill, sIdx) => {
                        const isMatched = breakdown.matchedSkills.includes(skill);
                        return (
                          <span
                            key={`${job.id}-skill-${skill}-${sIdx}`}
                            className={`text-[10px] px-2 py-0.5 rounded-lg font-medium border ${
                              isMatched
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                                : 'bg-slate-100 border-slate-200/80 text-slate-600'
                            }`}
                          >
                            {isMatched ? '✓ ' : ''}{skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3">
                    
                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-details-${job.id}`}
                        onClick={() => onOpenJobDetail(job)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                      >
                        View Details
                      </button>

                      {job.applicationUrl && (
                        <a
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>

                    <button
                      id={`btn-cockpit-${job.id}`}
                      onClick={() => onSelectForApproval(job)}
                      className="px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Prepare Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* Right 1 Column: Student & Fresh Graduate AI Career Playbook */}
        <div className="space-y-6">
          
          {/* Playbook Card */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Career Playbook
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Global & Local Tech Hiring Strategies</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Highlight FYP & Live Demos</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Tech leads at top international and local firms prioritize real deployed projects. Your verified academic, portfolio, and industry projects are automatically highlighted in your tailored ATS resume.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-700 font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>Direct Recruiter Outreach</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Reach verified talent desks at Google, DeepMind, G42, Stripe, Systems Ltd, 10Pearls, and SadaPay directly with tailored cover emails and resume PDFs.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Pre-Placement Offers (PPOs)</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Over 85% of interns demonstrating clean React, Python, and AI capabilities receive permanent Associate Software Engineer conversions.
                </p>
              </div>

            </div>
          </div>

          {/* Quick Switch to Full-time Jobs */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 text-center space-y-3 shadow-xs">
            <div className="h-11 w-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto border border-violet-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Looking for Full-Time Roles?
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Explore global Full Stack and AI Engineer positions across Pakistan, USA, UK, UAE, Germany, Canada, and Worldwide Remote.
            </p>
            <button
              onClick={onNavigateToJobs}
              className="w-full py-2.5 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Explore All Global Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
