import React from 'react';
import { 
  Home, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ClipboardList, 
  MessageSquare, 
  Network, 
  ShieldAlert, 
  Compass,
  X
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: SupportedLanguage;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  mobileOpen,
  onCloseMobile,
  unreadCount = 0
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const navItems = [
    { id: 'home', label: t.navHome || 'Home', icon: Home },
    { id: 'documents', label: t.navDocuments || 'My Documents', icon: FileText, badge: '5' },
    { id: 'eligibility', label: t.navEligibility || 'My Eligibility', icon: CheckCircle2 },
    { id: 'services', label: t.navServices || 'Recommended Services', icon: Sparkles },
    { id: 'tracker', label: t.navTracker || 'Application Tracker', icon: ClipboardList, badge: '2' },
    { id: 'evidence-map', label: t.navEvidenceMap || 'Evidence Map', icon: Network },
    { id: 'chat', label: t.askNagrivox || 'Ask NAGRIVOX', icon: MessageSquare },
    { id: 'admin', label: t.navAdmin || 'Admin Portal', icon: ShieldAlert }
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Logo Section */}
        <div>
          <div className="h-18 px-6 border-b border-slate-100 flex items-center justify-between">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Civic Tech Brand Mark */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004D3A] to-[#006B4F] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-[#004D3A]">NAGRI</span>
                  <span className="font-extrabold text-xl tracking-tight text-[#16A36A]">VOX</span>
                </div>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Citizen Readiness</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150
                    ${isActive 
                      ? 'bg-[#E8F7F0] text-[#006B4F] shadow-xs font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#006B4F]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#006B4F] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#E8F7F0] to-[#d8f2e5] border border-emerald-200/60 shadow-xs relative overflow-hidden">
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-2 bg-[#006B4F] text-white rounded-xl shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#004D3A] leading-tight">
                  Inclusive • Simple • Trusted
                </p>
                <p className="text-[11px] text-[#006B4F]/80 mt-1">
                  For Every Indian Citizen.
                </p>
              </div>
            </div>
            
            {/* Subtle decorative motif */}
            <div className="mt-2.5 pt-2 border-t border-emerald-300/40 flex items-center justify-between text-[10px] text-emerald-800 font-medium">
              <span>National Portal Sync</span>
              <span className="inline-flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
