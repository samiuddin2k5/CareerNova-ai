import React from 'react';
import { GLOBAL_LOCATION_DATA } from '../data/globalJobs';
import { Globe, MapPin, Building, Briefcase, Clock, Zap, Check } from 'lucide-react';

interface GlobalLocationFilterProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedWorkMode: string;
  setSelectedWorkMode: (mode: string) => void;
  only48Hours?: boolean;
  setOnly48Hours?: (val: boolean) => void;
  totalResultsCount?: number;
  recent48HoursCount?: number;
  variant?: 'violet' | 'emerald';
}

export const GlobalLocationFilter: React.FC<GlobalLocationFilterProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  selectedWorkMode,
  setSelectedWorkMode,
  only48Hours = false,
  setOnly48Hours,
  totalResultsCount,
  recent48HoursCount,
  variant = 'violet'
}) => {
  const isEmerald = variant === 'emerald';
  const primaryBg = isEmerald ? 'bg-emerald-600 text-white shadow-xs' : 'bg-violet-600 text-white shadow-xs';
  const selectBorder = isEmerald ? 'focus:border-emerald-600' : 'focus:border-violet-600';
  const activePill = isEmerald ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' : 'bg-violet-50 text-violet-700 border-violet-200 font-bold';

  // Get available cities for selected country
  const currentCountryObj = GLOBAL_LOCATION_DATA.find(c => c.country === selectedCountry);
  const availableCities = currentCountryObj ? currentCountryObj.cities : [];

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    setSelectedCity('All'); // Reset city when country changes
  };

  return (
    <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 space-y-3 shadow-xs">
      {/* Top Header: Location title + 48-Hour Toggle + Work Mode */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <Globe className={`w-4 h-4 ${isEmerald ? 'text-emerald-600' : 'text-violet-600'}`} />
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Location & Live Filters
          </span>

          {/* Active location tag */}
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${activePill} flex items-center gap-1`}>
            {selectedCountry === 'All' ? '🌐 All Countries (Worldwide Inc. Pakistan)' : `📍 ${selectedCountry}`}
            {selectedCity !== 'All' ? ` • ${selectedCity}` : ''}
          </span>

          {/* Live auto-sync indicator */}
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Live Auto-Sync Active (Every 30s)</span>
          </span>
        </div>

        {/* Action Controls: 48-Hour Filter + Work Mode */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Last 48 Hours Filter Switch */}
          {setOnly48Hours && (
            <button
              type="button"
              onClick={() => setOnly48Hours(!only48Hours)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                only48Hours
                  ? isEmerald
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-violet-600 border-violet-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Show only postings published within the last 48 hours in selected location"
            >
              <Zap className={`w-3.5 h-3.5 ${only48Hours ? 'text-amber-300 fill-amber-300' : 'text-amber-500'}`} />
              <span>Last 48 Hours Only</span>
              {typeof recent48HoursCount === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  only48Hours ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {recent48HoursCount}
                </span>
              )}
            </button>
          )}

          {/* Work Mode Toggle (All, On-site, Hybrid, Remote) */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Mode:
            </span>
            {[
              { id: 'All', label: 'All' },
              { id: 'On-site', label: 'On-site' },
              { id: 'Hybrid', label: 'Hybrid' },
              { id: 'Remote', label: 'Remote' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedWorkMode(mode.id)}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                  selectedWorkMode === mode.id
                    ? primaryBg
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Country and City Dropdown Selectors + Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {/* Country Selector (Pakistan is optional and choosable, not compulsory!) */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex-1 flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Country (Optional / Choosable)
            </span>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={`text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer ${selectBorder}`}
            >
              <option value="All">🌐 All Countries (Worldwide Inc. Pakistan)</option>
              {GLOBAL_LOCATION_DATA.map((loc) => (
                <option key={loc.country} value={loc.country}>
                  {loc.country === 'Pakistan' ? '🇵🇰 Pakistan (Karachi, Lahore, Islamabad)' : loc.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex-1 flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">City / Region</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={selectedCountry === 'All'}
              className={`text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer disabled:text-slate-400 ${selectBorder}`}
            >
              <option value="All">
                {selectedCountry === 'All' ? 'Worldwide (Select Country for Cities)' : `All Cities in ${selectedCountry}`}
              </option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Country Shortcuts */}
        <div className="sm:col-span-2 lg:col-span-1 flex items-center flex-wrap gap-1 justify-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
          {[
            { label: '🌐 All', country: 'All', tooltip: 'Worldwide including Pakistan' },
            { label: '🇵🇰 PK', country: 'Pakistan', tooltip: 'Pakistan only' },
            { label: '🇺🇸 USA', country: 'United States', tooltip: 'United States only' },
            { label: '🇦🇪 UAE', country: 'United Arab Emirates', tooltip: 'UAE only' },
            { label: '🇬🇧 UK', country: 'United Kingdom', tooltip: 'UK only' },
            { label: '🇩🇪 DE', country: 'Germany', tooltip: 'Germany only' },
            { label: '🇨🇦 CA', country: 'Canada', tooltip: 'Canada only' },
            { label: '🌐 Remote', country: 'Global Remote', tooltip: 'Worldwide Remote only' }
          ].map((item) => (
            <button
              key={item.country}
              onClick={() => handleCountryChange(item.country)}
              title={item.tooltip}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition border cursor-pointer active:scale-95 ${
                selectedCountry === item.country
                  ? isEmerald
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-violet-100 text-violet-800 border-violet-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
