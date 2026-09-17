import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  User, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  Mail, 
  Check, 
  ExternalLink,
  Sliders,
  UserPlus,
  LogIn
} from 'lucide-react';
import { CandidateProfile, AuthUser } from '../types';

interface TopHeaderProps {
  candidate: CandidateProfile;
  currentUser: AuthUser | null;
  isGmailConnected: boolean;
  onToggleSidebar: () => void;
  onOpenAskAI: () => void;
  onOpenUploadModal: () => void;
  onOpenGmailModal: () => void;
  onOpenAuthModal: (mode: 'signup' | 'signin' | 'preferences') => void;
  onSignOut: () => void;
  onNavigateTab: (tab: any) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  candidate,
  currentUser,
  isGmailConnected,
  onToggleSidebar,
  onOpenAskAI,
  onOpenUploadModal,
  onOpenGmailModal,
  onOpenAuthModal,
  onSignOut,
  onNavigateTab
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'New High Compatibility Job in Karachi',
      desc: 'Systems Limited posted "Senior Full Stack Developer" (92% match)',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'AI Resume Tailored & Attached',
      desc: 'ATS PDF ready for 10Pearls with auto-attachment payload',
      time: '4 hours ago',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'Follow-up Due in 2 Days',
      desc: 'MetricX Solutions application sent on Tuesday',
      time: '1 day ago',
      unread: false
    }
  ];

  const displayName = currentUser?.fullName || candidate.fullName || 'Sami Uddin';
  const firstName = displayName.split(' ')[0] || 'Sami';
  const userTitle = currentUser?.title || candidate.title || 'Full Stack Developer';

  return (
    <header className="h-18 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      
      {/* Left section: Hamburger button & optional breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          id="btn-sidebar-toggle"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Autonomous Workspace</span>
          <span>/</span>
          <span className="text-violet-700 font-bold max-w-xs truncate">
            {currentUser?.searchPreferences?.targetLocations && currentUser.searchPreferences.targetLocations.length > 0
              ? currentUser.searchPreferences.targetLocations.slice(0, 2).join(', ') + (currentUser.searchPreferences.targetLocations.length > 2 ? ` +${currentUser.searchPreferences.targetLocations.length - 2}` : '')
              : 'Worldwide & Remote'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Auto-Sync Live
          </span>
        </div>
      </div>

      {/* Right section: Ask AI CTA, Search Settings, Notifications, Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        
        {/* Quick Search Preferences CTA */}
        <button
          id="btn-header-search-prefs"
          onClick={() => onOpenAuthModal('preferences')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition active:scale-95"
          title="Customize search roles, cities, and skills"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Search Criteria</span>
        </button>

        {/* Ask CareerPilot AI button */}
        <button
          id="btn-header-ask-careerpilot"
          onClick={onOpenAskAI}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 shadow-xs transition active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
          <span>Ask CareerPilot</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                <span className="text-[11px] font-semibold text-violet-600 hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100 my-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setIsNotificationsOpen(false);
                  onNavigateTab('jobs');
                }}
                className="w-full mt-2 py-1.5 text-center text-xs font-bold text-violet-600 hover:bg-violet-50 rounded-xl transition"
              >
                View All Job Matches →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown or Sign In / Sign Up */}
        <div className="relative">
          <button
            id="btn-header-profile"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
          >
            {/* User Avatar with initial */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {firstName.charAt(0)}
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {firstName}
              </div>
              <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                <span className="truncate max-w-[120px]">{userTitle}</span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Menu Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900 block truncate">{displayName}</span>
                <span className="text-[11px] text-slate-500 block truncate font-mono">{currentUser?.email || candidate.email}</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-violet-700 font-bold bg-violet-100 px-2 py-0.5 rounded-full truncate">
                    {userTitle}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isGmailConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isGmailConnected ? '✓ Gmail Ready' : 'Gmail Off'}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 text-xs font-medium text-slate-700">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenAuthModal('preferences');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-violet-50 text-violet-700 font-semibold transition text-left"
                >
                  <Sliders className="w-4 h-4 text-violet-600" />
                  <span>Job Search & Matching Criteria</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenGmailModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition text-left"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Gmail Dispatch Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigateTab('resume');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition text-left"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Resume & Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenUploadModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Upload / Re-parse Resume</span>
                </button>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenAuthModal('signup');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition text-left text-slate-600"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Create Another Account (Sign Up)</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenAuthModal('signin');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition text-left text-slate-600"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Switch User / Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold transition text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

