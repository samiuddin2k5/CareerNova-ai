import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  Search, 
  Send, 
  FileText, 
  Sparkles, 
  BarChart3, 
  Mail, 
  Bookmark, 
  Settings, 
  Crown,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { CandidateProfile, AuthUser } from '../types';

export type NavTabType = 
  | 'dashboard'
  | 'jobs'
  | 'internships'
  | 'applications'
  | 'approval'
  | 'resume'
  | 'ai-resumes'
  | 'analytics'
  | 'emails'
  | 'saved'
  | 'settings';

interface SidebarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  candidate: CandidateProfile;
  currentUser?: AuthUser | null;
  isGmailConnected: boolean;
  userGmail: string;
  awaitingApprovalCount: number;
  unreadEmailCount?: number;
  savedJobsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenGmailModal: () => void;
  onOpenAuthModal?: (mode: 'signup' | 'signin' | 'preferences') => void;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  candidate,
  currentUser,
  isGmailConnected,
  userGmail,
  awaitingApprovalCount,
  unreadEmailCount = 12,
  savedJobsCount = 5,
  isCollapsed = false,
  onOpenGmailModal,
  onOpenAuthModal,
  onSignOut
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'jobs' as NavTabType,
      label: 'Job Search',
      icon: Search,
      badge: null
    },
    {
      id: 'internships' as NavTabType,
      label: 'Internships Hub',
      icon: GraduationCap,
      badge: null
    },
    {
      id: 'applications' as NavTabType,
      label: 'Applications',
      icon: Send,
      badge: awaitingApprovalCount > 0 ? `${awaitingApprovalCount}` : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'resume' as NavTabType,
      label: 'Resume',
      icon: FileText,
      badge: 'New',
      badgeColor: 'bg-violet-100 text-violet-700 border border-violet-200'
    },
    {
      id: 'ai-resumes' as NavTabType,
      label: 'AI Resume Versions',
      icon: Sparkles,
      badge: null
    },
    {
      id: 'analytics' as NavTabType,
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'emails' as NavTabType,
      label: 'Emails',
      icon: Mail,
      badge: unreadEmailCount > 0 ? `${unreadEmailCount}` : null,
      badgeColor: 'bg-violet-100 text-violet-700 font-semibold'
    },
    {
      id: 'saved' as NavTabType,
      label: 'Saved Jobs',
      icon: Bookmark,
      badge: savedJobsCount > 0 ? `${savedJobsCount}` : null,
      badgeColor: 'bg-slate-100 text-slate-600'
    },
    {
      id: 'settings' as NavTabType,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className={`bg-white border-r border-slate-200/90 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
      isCollapsed ? 'w-20' : 'w-64'
    } min-h-screen`}>
      {/* Brand Header */}
      <div>
        <div className="h-18 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 p-0.5 shadow-md shadow-violet-500/20 flex items-center justify-center text-white shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                CareerPilot <span className="text-violet-600">AI</span>
              </span>
            </div>
          )}
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'applications' && activeTab === 'approval');
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-violet-600' : 'text-slate-500 group-hover:text-slate-700'
                }`} />
                
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    item.badgeColor || 'bg-violet-100 text-violet-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets (Connected Account & Active Status) */}
      {!isCollapsed ? (
        <div className="p-4 space-y-3 border-t border-slate-100 bg-slate-50/50">
          
          {/* Autonomous Status Indicator */}
          <div className="p-3 rounded-2xl bg-violet-50/80 border border-violet-100 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-800">Auto-Sync Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Live portal scanner active for Karachi & Remote internships and jobs.
            </p>
          </div>

          {/* Connected Gmail Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-red-50 text-red-600">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Sending Gmail</span>
              </div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isGmailConnected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {isGmailConnected && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                {isGmailConnected ? 'Ready' : 'Connect'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 truncate font-mono">
                {userGmail || candidate.email}
              </span>
              <button
                onClick={onOpenGmailModal}
                className="text-[10px] font-semibold text-violet-600 hover:text-violet-700 ml-1 shrink-0"
              >
                Configure
              </button>
            </div>

            {onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('preferences')}
                className="w-full mt-1 py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-[11px] font-bold border border-slate-200/60 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Edit Search Criteria</span>
                <span className="text-[10px] text-slate-400">→</span>
              </button>
            )}

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="w-full py-1.5 px-2.5 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 text-[11px] font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        <div className="p-3 flex flex-col items-center gap-2 border-t border-slate-100">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" title="Auto-Sync Active" />
          <button 
            onClick={onOpenGmailModal}
            className="p-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
            title="Connected Gmail"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
