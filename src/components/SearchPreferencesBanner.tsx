import React from 'react';
import { Search, MapPin, Briefcase, Mail, CheckCircle2, Sliders, Sparkles } from 'lucide-react';
import { UserSearchPreferences, AuthUser } from '../types';

interface SearchPreferencesBannerProps {
  user: AuthUser | null;
  preferences: UserSearchPreferences;
  isGmailConnected: boolean;
  onOpenPreferences: () => void;
  onOpenGmailModal: () => void;
}

export const SearchPreferencesBanner: React.FC<SearchPreferencesBannerProps> = ({
  user,
  preferences,
  isGmailConnected,
  onOpenPreferences,
  onOpenGmailModal
}) => {
  const locationsStr = preferences.targetLocations?.length > 0 
    ? preferences.targetLocations.slice(0, 3).join(', ') + (preferences.targetLocations.length > 3 ? ` +${preferences.targetLocations.length - 3}` : '')
    : 'Karachi, Remote';

  const skillsStr = preferences.primarySkills?.length > 0
    ? preferences.primarySkills.slice(0, 4).join(', ') + (preferences.primarySkills.length > 4 ? ` +${preferences.primarySkills.length - 4}` : '')
    : 'React, Node.js, Python';

  return (
    <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in duration-150">
      
      {/* Left items: Active Search Profile Tags */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
        
        {/* Role tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-50 text-violet-800 border border-violet-200/70 font-bold max-w-[320px]">
          <Briefcase className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <span className="truncate">
            {preferences.targetRoles && preferences.targetRoles.length > 0 
              ? preferences.targetRoles.join(' • ') 
              : (preferences.targetRole || 'DevOps & Cloud Engineer')}
          </span>
        </div>

        {/* Location tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[200px]">{locationsStr}</span>
        </div>

        {/* Skills tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[220px]">{skillsStr}</span>
        </div>

        {/* Work Mode */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-medium">
          <span>{preferences.workModes?.join(' / ') || 'On-site / Remote'}</span>
        </div>

        {/* 48h Freshness badge */}
        {preferences.onlyWithin48Hours && (
          <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            48h Fresh Filter Active
          </span>
        )}

      </div>

      {/* Right controls: Gmail status indicator & Edit Criteria CTA */}
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
        
        {/* Gmail status pill */}
        <button
          onClick={onOpenGmailModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isGmailConnected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
          title="Configure Sending Gmail"
        >
          <Mail className="w-3.5 h-3.5 text-red-500" />
          <span>{isGmailConnected ? 'Gmail Ready' : 'Connect Gmail'}</span>
          {isGmailConnected && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
        </button>

        {/* Edit Search Preferences Button */}
        <button
          onClick={onOpenPreferences}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition active:scale-95"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Search & Matching Settings</span>
        </button>

      </div>

    </div>
  );
};
