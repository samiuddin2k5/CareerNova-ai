import React from 'react';
import { 
  Bot, 
  Send, 
  FileText, 
  Briefcase, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  Sparkles,
  MapPin,
  RefreshCw,
  Search,
  GraduationCap,
  Zap,
  Activity
} from 'lucide-react';
import { TargetRole } from '../types';

interface NavbarProps {
  activeTab: 'jobs' | 'internships' | 'approval' | 'tracker' | 'resume' | 'analytics';
  setActiveTab: (tab: 'jobs' | 'internships' | 'approval' | 'tracker' | 'resume' | 'analytics') => void;
  selectedRoleFilter: TargetRole | 'All';
  setSelectedRoleFilter: (role: TargetRole | 'All') => void;
  onOpenUploadModal: () => void;
  onOpenGmailModal: () => void;
  onRefreshJobs: () => void;
  isRefreshingJobs: boolean;
  isGmailConnected: boolean;
  awaitingApprovalCount: number;
  internshipCount?: number;
  candidateName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRoleFilter,
  setSelectedRoleFilter,
  onOpenUploadModal,
  onOpenGmailModal,
  onRefreshJobs,
  isRefreshingJobs,
  isGmailConnected,
  awaitingApprovalCount,
  internshipCount = 6,
  candidateName
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      {/* Top micro-status bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-slate-950 border-b border-slate-900 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Autonomous Job Agent Engine Active
          </span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400">Target Ecosystem: <strong className="text-slate-200">Worldwide & Selected Hubs</strong></span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400">Model: <strong className="text-emerald-400 font-mono">Gemini 2.5 Flash</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Candidate: <strong className="text-slate-200">{candidateName}</strong></span>
          <span className="text-slate-700">•</span>
          <span className="text-emerald-400 font-mono text-[10px] px-2 py-0.2 rounded bg-emerald-950/50 border border-emerald-500/30">
            Auto-Attach Resume: ON
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('jobs')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/15">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  CareerPilot AI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Autonomous Cockpit
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Worldwide & Selected Locations</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              id="nav-tab-jobs"
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Feed</span>
            </button>

            <button
              id="nav-tab-internships"
              onClick={() => setActiveTab('internships')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'internships'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Internships</span>
              {internshipCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'internships' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {internshipCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-approval"
              onClick={() => setActiveTab('approval')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold relative transition-all ${
                activeTab === 'approval'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approval Cockpit</span>
              {awaitingApprovalCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow-sm animate-bounce">
                  {awaitingApprovalCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-tracker"
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Tracker</span>
            </button>

            <button
              id="nav-tab-resume"
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'resume'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume Profile</span>
            </button>

            <button
              id="nav-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Quick Ingestion / Apify sync trigger */}
            <button
              id="btn-sync-jobs"
              onClick={onRefreshJobs}
              disabled={isRefreshingJobs}
              title="Trigger Live Job Search & Scraper Ingestion"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshingJobs ? 'animate-spin' : ''}`} />
              <span>{isRefreshingJobs ? 'Scanning...' : 'Live Search'}</span>
            </button>

            {/* Gmail OAuth connection status */}
            <button
              id="btn-gmail-auth"
              onClick={onOpenGmailModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isGmailConnected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
              }`}
            >
              <Mail className={`w-3.5 h-3.5 ${isGmailConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">
                {isGmailConnected ? 'Gmail Active' : 'Connect Gmail'}
              </span>
            </button>

            {/* Candidate Profile / Upload Avatar */}
            <button
              id="btn-upload-resume"
              onClick={onOpenUploadModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden md:inline">{candidateName.split(' ')[0]}'s Profile</span>
              <span className="md:hidden">Profile</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-slate-800/80 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${activeTab === 'jobs' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${activeTab === 'internships' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
          >
            Internships ({internshipCount})
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${activeTab === 'approval' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
          >
            Approval {awaitingApprovalCount > 0 && `(${awaitingApprovalCount})`}
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${activeTab === 'tracker' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
          >
            Tracker
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${activeTab === 'resume' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
          >
            Resume
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${activeTab === 'analytics' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};

