import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  MapPin, 
  Target, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Bot,
  Sliders,
  Bell,
  Save
} from 'lucide-react';
import { CandidateProfile, TargetRole, AuthUser, UserSearchPreferences } from '../types';

interface SettingsViewProps {
  candidate: CandidateProfile;
  currentUser?: AuthUser | null;
  searchPreferences?: UserSearchPreferences;
  isGmailConnected: boolean;
  userGmail: string;
  onUpdateCandidate: (candidate: CandidateProfile) => void;
  onOpenGmailModal: () => void;
  onOpenUploadModal: () => void;
  onOpenAuthModal?: (mode: 'signup' | 'signin' | 'preferences') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  candidate,
  currentUser,
  searchPreferences,
  isGmailConnected,
  userGmail,
  onUpdateCandidate,
  onOpenGmailModal,
  onOpenUploadModal,
  onOpenAuthModal
}) => {
  const [targetRoles, setTargetRoles] = useState<TargetRole[]>(candidate.targetRoles || ['Full Stack Developer', 'AI Engineer']);
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(70);
  const [autoAttachResume, setAutoAttachResume] = useState<boolean>(true);
  const [only48Hours, setOnly48Hours] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const toggleRole = (role: TargetRole) => {
    setTargetRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    onUpdateCandidate({
      ...candidate,
      targetRoles
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-violet-600" />
            <span>Agent Settings & Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Configure target roles, Karachi location filters, automated ATS attachments, and AI models.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-600/30 transition flex items-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved and applied to your autonomous search engine!</span>
        </div>
      )}

      <div className="space-y-6">
        
        {/* Section 0: User Authentication, Search Preferences & Gmail Setup */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-600" />
                <span>Active User Account & Search Preferences</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Target job roles, multi-location search hubs, primary skills, and verified sending Gmail.
              </p>
            </div>

            {onOpenAuthModal && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('preferences')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 transition"
                >
                  Edit Search Fields
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Switch / New User
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Authenticated Account</span>
              <div className="font-bold text-slate-800 truncate">{currentUser?.fullName || candidate.fullName}</div>
              <div className="text-slate-500 font-mono text-[11px] truncate">{currentUser?.email || candidate.email}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Target Role Category</span>
              <div className="font-bold text-violet-700">{searchPreferences?.targetRole || 'Full Stack Developer'}</div>
              <div className="text-slate-500 text-[11px]">{searchPreferences?.experienceLevel || 'Entry / Fresh Grad (0-1 yrs)'}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Sending Gmail Status</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span className="truncate">{userGmail || candidate.email}</span>
              </div>
              <div className={`text-[10px] font-bold mt-0.5 ${isGmailConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isGmailConnected ? '✓ Ready to send emails directly' : 'Needs Google OAuth connection'}
              </div>
            </div>
          </div>

          {searchPreferences?.targetLocations && searchPreferences.targetLocations.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Target Job Search Hubs:</span>
              <div className="flex flex-wrap gap-1.5">
                {searchPreferences.targetLocations.map(loc => (
                  <span key={loc} className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-800 border border-violet-200 text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-violet-600" />
                    <span>{loc}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Candidate Identity */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-600" />
            <span>Candidate Profile & Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-bold block mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={candidate.fullName}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              />
            </div>

            <div>
              <label className="text-slate-500 font-bold block mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={candidate.email}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-500 font-bold block mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                disabled
                value={candidate.phone}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-500 font-bold block mb-1">Location</label>
              <input
                type="text"
                disabled
                value={candidate.location}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onOpenUploadModal}
              className="text-xs font-bold text-violet-700 hover:underline"
            >
              Upload / Re-parse Master Resume →
            </button>
          </div>
        </div>

        {/* Section 2: Target Roles & Filtering */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-600" />
            <span>Target Roles & Ecosystem</span>
          </h2>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Selected Target Roles</label>
            <div className="flex flex-wrap gap-2">
              {(['Full Stack Developer', 'AI Engineer', 'Internship'] as TargetRole[]).map(role => {
                const isSelected = targetRoles.includes(role);
                return (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Minimum Match Threshold</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={minMatchThreshold}
                  onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                  className="flex-1 accent-violet-600"
                />
                <span className="text-xs font-black font-mono text-violet-700">{minMatchThreshold}%</span>
              </div>
              <p className="text-[11px] text-slate-500">Only surface jobs with high compatibility</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">48-Hour Freshness Strict Mode</span>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={only48Hours}
                  onChange={(e) => setOnly48Hours(e.target.checked)}
                  className="accent-violet-600 rounded"
                />
                <span className="text-xs font-medium text-slate-700">Filter out jobs older than 48 hours</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Gmail Integration & Dispatch */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-600" />
            <span>Gmail Integration & Auto-Attachment</span>
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Active Sender Account</span>
              <span className="text-xs font-mono text-violet-700">{userGmail || candidate.email}</span>
            </div>
            <button
              onClick={onOpenGmailModal}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              Configure OAuth
            </button>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAttachResume}
                onChange={(e) => setAutoAttachResume(e.target.checked)}
                className="accent-violet-600 rounded mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Automatically Attach Tailored ATS PDF Resume to Dispatches
                </span>
                <span className="text-[11px] text-slate-500">
                  Embeds the truth-grounded candidate PDF generated for each specific company.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="accent-violet-600 rounded mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Real-time High Match Push Alerts
                </span>
                <span className="text-[11px] text-slate-500">
                  Notify when a &gt;90% match role is scraped in Karachi.
                </span>
              </div>
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};
