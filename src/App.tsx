import React, { useState, useEffect } from 'react';
import { 
  JobPosting, 
  CandidateProfile, 
  ApplicationRecord, 
  TargetRole, 
  CareerAnalytics,
  AuthUser,
  UserSearchPreferences
} from './types';
import { INITIAL_JOB_POSTINGS, DEFAULT_CANDIDATE_PROFILE } from './data/initialJobs';
import { Sidebar, NavTabType } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { JobFeed } from './components/JobFeed';
import { InternshipHub } from './components/InternshipHub';
import { ApprovalCockpit } from './components/ApprovalCockpit';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ResumeProfileView } from './components/ResumeProfileView';
import { AIResumeVersionsView } from './components/AIResumeVersionsView';
import { SavedJobsView } from './components/SavedJobsView';
import { EmailsView } from './components/EmailsView';
import { SettingsView } from './components/SettingsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { GmailConnectModal } from './components/GmailConnectModal';
import { JobDetailModal } from './components/JobDetailModal';
import { AskCareerPilotModal } from './components/AskCareerPilotModal';
import { AuthModal } from './components/AuthModal';
import { AuthPortalView } from './components/AuthPortalView';
import { SearchPreferencesBanner } from './components/SearchPreferencesBanner';
import { calculateCompatibilityScore } from './lib/scoring';
import { 
  getStoredAuthUser, 
  setStoredAuthUser, 
  signOutAuthUser, 
  DEFAULT_SEARCH_PREFERENCES 
} from './lib/firebaseAuth';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('dashboard');
  
  // User Authentication & Search Preferences State (Immediate cache-first resolution)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [searchPreferences, setSearchPreferences] = useState<UserSearchPreferences>(() => {
    const stored = getStoredAuthUser();
    return stored?.searchPreferences || DEFAULT_SEARCH_PREFERENCES;
  });

  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    const stored = getStoredAuthUser();
    if (stored) {
      return {
        ...DEFAULT_CANDIDATE_PROFILE,
        fullName: stored.fullName,
        email: stored.email,
        title: stored.title || DEFAULT_CANDIDATE_PROFILE.title,
        location: stored.location || DEFAULT_CANDIDATE_PROFILE.location,
        originalFileName: stored.cvFileName || `${stored.fullName.replace(/\s+/g, '_')}_CV.pdf`,
        cvDataUrl: stored.cvDataUrl,
        rawResumeText: stored.cvFileContent || (DEFAULT_CANDIDATE_PROFILE as CandidateProfile).rawResumeText || '',
      };
    }
    return DEFAULT_CANDIDATE_PROFILE;
  });

  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOB_POSTINGS);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(INITIAL_JOB_POSTINGS[0]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<TargetRole | 'All'>('All');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1', 'job-3']);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'signin' | 'preferences'>('signup');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false);
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [activeDetailJob, setActiveDetailJob] = useState<JobPosting | null>(null);

  // Status
  const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [userGmail, setUserGmail] = useState('');
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Fetch initial profile & jobs + Background Live Auto-Sync
  useEffect(() => {
    fetchInitialData();

    // Regular live background sync every 35 seconds (without requiring manual clicks)
    const syncInterval = setInterval(async () => {
      try {
        const syncRes = await fetch('/api/jobs/sync');
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          if (syncData.jobs && syncData.jobs.length > 0) {
            setJobs(syncData.jobs);
            if (syncData.newJobAdded) {
              showToast(`⚡ Live Update: New internship/job posting added from ${syncData.newJobAdded.company} (${syncData.newJobAdded.source})`, 'info');
            }
          }
        }
      } catch (e) {
        // Silent background failover
      }
    }, 35000);

    return () => clearInterval(syncInterval);
  }, []);

  const fetchInitialData = async () => {
    try {
      // Execute all 4 network requests in parallel for instantaneous load
      const [profRes, jobsRes, appRes, authRes] = await Promise.allSettled([
        fetch('/api/resume/profile'),
        fetch('/api/jobs'),
        fetch('/api/applications'),
        fetch('/api/auth/status')
      ]);

      // 1. Profile
      if (profRes.status === 'fulfilled' && profRes.value.ok) {
        const profData = await profRes.value.json();
        const stored = getStoredAuthUser();
        setCandidate(prev => ({
          ...profData,
          fullName: stored?.fullName || prev.fullName || profData.fullName,
          email: stored?.email || prev.email || profData.email,
          title: stored?.title || prev.title || profData.title,
          location: stored?.location || prev.location || profData.location,
          originalFileName: stored?.cvFileName || prev.originalFileName || profData.originalFileName,
          cvDataUrl: stored?.cvDataUrl || prev.cvDataUrl || profData.cvDataUrl,
          rawResumeText: stored?.cvFileContent || prev.rawResumeText || profData.rawResumeText
        }));
      }

      // 2. Jobs
      if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
        const jobsData = await jobsRes.value.json();
        if (jobsData.length > 0) {
          setJobs(jobsData);
          setSelectedJob(prev => prev || jobsData[0]);
        }
      }

      // 3. Applications
      if (appRes.status === 'fulfilled' && appRes.value.ok) {
        const appData = await appRes.value.json();
        setApplications(appData);
      }

      // 4. Auth & Search Preferences
      if (authRes.status === 'fulfilled' && authRes.value.ok) {
        const authData = await authRes.value.json();
        setIsGmailConnected(authData.connected);
        if (authData.userEmail) setUserGmail(authData.userEmail);
        if (authData.user) {
          setCurrentUser(authData.user);
          setStoredAuthUser(authData.user);
          if (authData.user.searchPreferences) {
            setSearchPreferences(authData.user.searchPreferences);
          }
        } else {
          // No user session on server
          const stored = getStoredAuthUser();
          if (!stored) {
            setCurrentUser(null);
          }
          if (authData.searchPreferences) {
            setSearchPreferences(authData.searchPreferences);
          }
        }
      }
    } catch (e) {
      console.warn('Initial data load warning:', e);
    }
  };

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAuthModal = (mode: 'signup' | 'signin' | 'preferences' = 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.searchPreferences) {
      setSearchPreferences(user.searchPreferences);
    }
    if (user.gmailConnected) {
      setIsGmailConnected(true);
      if (user.gmailAddress) setUserGmail(user.gmailAddress);
    }
    setCandidate(prev => ({
      ...prev,
      fullName: user.fullName || prev.fullName,
      email: user.email || prev.email,
      title: user.title || prev.title,
      location: user.location || prev.location,
      originalFileName: user.cvFileName || prev.originalFileName || `${user.fullName.replace(/\s+/g, '_')}_CV.pdf`,
      cvDataUrl: user.cvDataUrl || prev.cvDataUrl,
      rawResumeText: user.cvFileContent || prev.rawResumeText
    }));
    showToast(`Welcome ${user.fullName}! Your CV & preferences are ready for company applications.`);
  };

  const handleSignOut = async () => {
    signOutAuthUser();
    setCurrentUser(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // silent
    }
    showToast('Signed out successfully.', 'info');
  };

  const handleRefreshJobs = async () => {
    setIsRefreshingJobs(true);
    try {
      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRoleFilter })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Live Apify Ingestion: ${data.addedCount} new jobs retrieved, ${data.duplicateCount} duplicate listings filtered out.`);
        const jobsRes = await fetch('/api/jobs');
        if (jobsRes.ok) {
          const freshJobs = await jobsRes.json();
          setJobs(freshJobs);
        }
      }
    } catch (e) {
      showToast('Error connecting to live job search service.', 'error');
    } finally {
      setIsRefreshingJobs(false);
    }
  };

  const handleSelectJobForApproval = (job: JobPosting) => {
    setSelectedJob(job);
    setActiveTab('approval');
  };

  const handleOpenJobDetail = (job: JobPosting) => {
    setActiveDetailJob(job);
    setIsJobDetailModalOpen(true);
  };

  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('Removed from saved jobs.');
        return prev.filter(id => id !== jobId);
      } else {
        showToast('Saved to your shortlisted jobs.');
        return [...prev, jobId];
      }
    });
  };

  const handleApplicationUpdated = (updatedApp: ApplicationRecord) => {
    setApplications(prev => {
      const idx = prev.findIndex(a => a.id === updatedApp.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedApp;
        return next;
      }
      return [updatedApp, ...prev];
    });
  };

  const awaitingApprovalCount = applications.filter(
    a => a.status === 'Awaiting Approval' || a.status === 'Email Ready'
  ).length;

  // Compute analytics
  const analytics: CareerAnalytics = {
    totalJobsRetrieved: jobs.length,
    jobsPassing48hFilter: jobs.filter(j => j.isWithin48Hours).length,
    karachiOnsiteJobs: jobs.filter(j => j.workMode === 'On-site' && j.location.includes('Karachi')).length,
    pakistanRemoteJobs: jobs.filter(j => j.workMode === 'Remote').length,
    fullStackMatches: jobs.filter(j => j.roleCategory === 'Full Stack Developer').length,
    aiEngineerMatches: jobs.filter(j => j.roleCategory === 'AI Engineer').length,
    averageCompatibilityScore: 86,
    highMatchCount: applications.filter(a => a.compatibilityScore >= 80).length,
    awaitingApprovalCount,
    sentApplicationsCount: applications.filter(a => a.status === 'Sent' || a.status === 'Application Submitted').length,
    interviewCount: applications.filter(a => a.status === 'Interview').length,
    rejectedCount: applications.filter(a => a.status === 'Rejected').length,
    responseRatePercent: 33
  };

  // Strictly enforce authentication gate:
  // "first signup then login without login dashboard not show"
  // If user is not authenticated, render the comprehensive Auth & Onboarding Portal
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased">
        <AuthPortalView onAuthSuccess={handleAuthSuccess} />
        {notification && (
          <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200 backdrop-blur-xl ${
            notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <span>{notification.msg}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans selection:bg-violet-600 selection:text-white antialiased">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200 backdrop-blur-xl ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidate={candidate}
        currentUser={currentUser}
        isGmailConnected={isGmailConnected}
        userGmail={userGmail}
        awaitingApprovalCount={awaitingApprovalCount}
        unreadEmailCount={applications.length || 12}
        savedJobsCount={savedJobIds.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenGmailModal={() => setIsGmailModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header */}
        <TopHeader
          candidate={candidate}
          currentUser={currentUser}
          isGmailConnected={isGmailConnected}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenAskAI={() => setIsAskAIOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onOpenGmailModal={() => setIsGmailModalOpen(true)}
          onOpenAuthModal={handleOpenAuthModal}
          onSignOut={handleSignOut}
          onNavigateTab={setActiveTab}
        />

        {/* Dynamic Main Workspace Tab Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* Active Search Criteria & Gmail Dispatch Banner */}
          <div className="mb-6">
            <SearchPreferencesBanner
              user={currentUser}
              preferences={searchPreferences}
              isGmailConnected={isGmailConnected}
              onOpenPreferences={() => handleOpenAuthModal('preferences')}
              onOpenGmailModal={() => setIsGmailModalOpen(true)}
            />
          </div>
          
          {activeTab === 'dashboard' && (
            <DashboardView
              jobs={jobs}
              candidate={candidate}
              applications={applications}
              savedJobIds={savedJobIds}
              searchPreferences={searchPreferences}
              onToggleSaveJob={handleToggleSaveJob}
              onOpenJobDetail={handleOpenJobDetail}
              onSelectForApproval={handleSelectJobForApproval}
              onNavigateTab={setActiveTab}
              onOpenAskAI={() => setIsAskAIOpen(true)}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenPreferences={() => handleOpenAuthModal('preferences')}
            />
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <JobFeed
                jobs={jobs}
                candidate={candidate}
                applications={applications}
                searchPreferences={searchPreferences}
                onOpenPreferences={() => handleOpenAuthModal('preferences')}
                onOpenJobDetail={handleOpenJobDetail}
                onSelectForApproval={handleSelectJobForApproval}
                onRefreshJobs={handleRefreshJobs}
                isRefreshing={isRefreshingJobs}
              />
            </div>
          )}

          {activeTab === 'internships' && (
            <InternshipHub
              jobs={jobs}
              candidate={candidate}
              applications={applications}
              searchPreferences={searchPreferences}
              onOpenPreferences={() => handleOpenAuthModal('preferences')}
              onOpenJobDetail={handleOpenJobDetail}
              onSelectForApproval={handleSelectJobForApproval}
              onNavigateToJobs={() => setActiveTab('jobs')}
            />
          )}

          {(activeTab === 'applications' || activeTab === 'approval') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveTab('approval')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'approval' 
                      ? 'bg-violet-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Approval Cockpit {awaitingApprovalCount > 0 && `(${awaitingApprovalCount})`}
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'applications' 
                      ? 'bg-violet-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Application Status Kanban
                </button>
              </div>

              {activeTab === 'approval' ? (
                <ApprovalCockpit
                  selectedJob={selectedJob}
                  allJobs={jobs}
                  candidate={candidate}
                  applications={applications}
                  onSelectJob={(j) => setSelectedJob(j)}
                  onApplicationUpdated={handleApplicationUpdated}
                  onOpenGmailModal={() => setIsGmailModalOpen(true)}
                  isGmailConnected={isGmailConnected}
                />
              ) : (
                <ApplicationTracker
                  applications={applications}
                  allJobs={jobs}
                  candidate={candidate}
                  onUpdateApplication={handleApplicationUpdated}
                  onOpenCockpitForJob={(j) => {
                    setSelectedJob(j);
                    setActiveTab('approval');
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'resume' && (
            <ResumeProfileView
              profile={candidate}
              onUpdateProfile={(p) => {
                setCandidate(p);
                showToast('Candidate profile updated and scores recalculated.');
              }}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeTab === 'ai-resumes' && (
            <AIResumeVersionsView
              candidate={candidate}
              jobs={jobs}
              applications={applications}
              onSelectJobForApproval={handleSelectJobForApproval}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeTab === 'saved' && (
            <SavedJobsView
              jobs={jobs}
              candidate={candidate}
              savedJobIds={savedJobIds}
              onToggleSaveJob={handleToggleSaveJob}
              onOpenJobDetail={handleOpenJobDetail}
              onSelectForApproval={handleSelectJobForApproval}
              onNavigateToSearch={() => setActiveTab('jobs')}
            />
          )}

          {activeTab === 'emails' && (
            <EmailsView
              applications={applications}
              allJobs={jobs}
              candidate={candidate}
              isGmailConnected={isGmailConnected}
              userGmail={userGmail}
              onOpenGmailModal={() => setIsGmailModalOpen(true)}
              onOpenCockpitForJob={handleSelectJobForApproval}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              analytics={analytics}
              jobs={jobs}
              applications={applications}
              candidate={candidate}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              candidate={candidate}
              currentUser={currentUser}
              searchPreferences={searchPreferences}
              isGmailConnected={isGmailConnected}
              userGmail={userGmail}
              onUpdateCandidate={(p) => {
                setCandidate(p);
                showToast('Preferences updated.');
              }}
              onOpenGmailModal={() => setIsGmailModalOpen(true)}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenAuthModal={handleOpenAuthModal}
            />
          )}

        </main>

        {/* Sleek Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-5 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">CareerPilot AI</span>
              <span>•</span>
              <span>Autonomous Career Agent for Full Stack & AI Engineers (Karachi & Remote PK)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Human-in-the-Loop Cockpit Active
              </span>
            </div>
          </div>
        </footer>

      </div>

      {/* Upload Master Resume Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProfileUpdated={(p) => {
          setCandidate(p);
          showToast('Resume parsed successfully! Skills and achievements synchronized.');
        }}
      />

      {/* Gmail Connect Modal */}
      <GmailConnectModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        isGmailConnected={isGmailConnected}
        userEmail={userGmail}
        onConnectionSaved={(token, email) => {
          setIsGmailConnected(Boolean(token));
          setUserGmail(email);
          showToast(token ? `Gmail OAuth active for ${email}` : 'Gmail disconnected');
        }}
      />

      {/* Ask CareerPilot AI Modal */}
      <AskCareerPilotModal
        isOpen={isAskAIOpen}
        onClose={() => setIsAskAIOpen(false)}
        candidate={candidate}
        jobs={jobs}
        onNavigateTab={setActiveTab}
      />

      {/* Job Details Modal */}
      {activeDetailJob && (
        <JobDetailModal
          job={activeDetailJob}
          scoreBreakdown={calculateCompatibilityScore(candidate, activeDetailJob)}
          candidate={candidate}
          application={applications.find(a => a.jobId === activeDetailJob.id)}
          onClose={() => {
            setIsJobDetailModalOpen(false);
            setActiveDetailJob(null);
          }}
          onProceedToCockpit={(j) => {
            setIsJobDetailModalOpen(false);
            setActiveDetailJob(null);
            handleSelectJobForApproval(j);
          }}
        />
      )}

      {/* User Authentication, Job Search Criteria & Gmail Setup Wizard Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

    </div>
  );
}
