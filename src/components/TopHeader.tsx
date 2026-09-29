import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Globe, 
  Bell, 
  Menu, 
  Check, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../locales/translations';
import { UserProfile } from '../types';

interface TopHeaderProps {
  user: UserProfile;
  lang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenMobileMenu: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onStartVoice: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTab: (tab: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  lang,
  onLanguageChange,
  onOpenMobileMenu,
  unreadCount,
  onOpenNotifications,
  onStartVoice,
  searchQuery,
  onSearchChange,
  onSelectTab
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder || "Search schemes, services or ask anything..."}
            className="w-full pl-10 pr-11 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006B4F]/20 focus:border-[#006B4F] transition-all"
          />
          <button
            type="button"
            onClick={onStartVoice}
            title="Search with Voice (बोलकर खोजें)"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#006B4F] transition-colors"
          >
            <div className="p-1 rounded-md hover:bg-emerald-50">
              <Mic className="w-4 h-4 text-[#006B4F]" />
            </div>
          </button>
        </div>
      </div>

      {/* Right Controls: Language, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#006B4F]" />
            <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
            <span className="sm:hidden">{currentLangObj.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Indian Language
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {SUPPORTED_LANGUAGES.map(item => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onLanguageChange(item.code);
                      setLangMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-emerald-50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{item.nativeName}</span>
                      <span className="ml-2 text-slate-400 text-[11px]">({item.name})</span>
                    </div>
                    {lang === item.code && <Check className="w-3.5 h-3.5 text-[#006B4F]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative pl-1 sm:pl-2 border-l border-slate-200" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006B4F]/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md inline-block">
                {user.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{user.district}, {user.state}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectTab('eligibility');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Citizen Evidence Profile</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('admin');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Dashboard</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  onClick={() => {
                    alert('Session active for demo citizen: Sanjeet Kumar');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
