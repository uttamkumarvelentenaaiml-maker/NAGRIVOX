import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  GraduationCap,
  HeartPulse,
  Home,
  Briefcase,
  Award,
  Users,
  Sprout,
  ShieldCheck
} from 'lucide-react';
import { ServiceEligibilityResult, ServiceScheme } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';

interface RecommendedServicesProps {
  results: ServiceEligibilityResult[];
  onSelectService: (result: ServiceEligibilityResult) => void;
  lang: SupportedLanguage;
  searchQuery?: string;
}

export const RecommendedServices: React.FC<RecommendedServicesProps> = ({
  results,
  onSelectService,
  lang,
  searchQuery = ''
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = [
    { id: 'All', label: t.tabAll || 'All' },
    { id: 'Scholarships', label: t.tabScholarships || 'Scholarships' },
    { id: 'Health', label: t.tabHealth || 'Health' },
    { id: 'Employment', label: t.tabEmployment || 'Employment' },
    { id: 'Housing', label: t.tabHousing || 'Housing' },
    { id: 'Pension', label: t.tabPension || 'Pension' },
    { id: 'Farmers', label: t.tabFarmers || 'Farmers' },
    { id: 'Certificates', label: t.tabCertificates || 'Certificates' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Scholarships':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'Health':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Housing':
        return <Home className="w-5 h-5 text-amber-600" />;
      case 'Employment':
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case 'Pension':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'Farmers':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'Certificates':
        return <Award className="w-5 h-5 text-[#006B4F]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-slate-600" />;
    }
  };

  // Filter results by tab and search
  const filteredResults = results.filter(item => {
    const matchesTab = activeTab === 'All' || item.service.category === activeTab;
    const matchesSearch = !searchQuery || 
      item.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t.recommendedServicesTitle || 'Recommended Services for You'}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              {filteredResults.length} Available
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t.recommendedServicesSubtitle || 'Based on your documents and profile'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                ${isActive
                  ? 'bg-[#006B4F] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'}
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map(item => {
          const srv = item.service;
          const isEligible = item.status === 'LIKELY_ELIGIBLE';
          const hasExpired = item.hasExpiredDocuments;
          const hasMissing = item.missingDocuments.length > 0;

          return (
            <div
              key={srv.id}
              onClick={() => onSelectService(item)}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header: Icon, Category & Status Pill */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(srv.category)}
                  </div>

                  <div>
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Likely Eligible</span>
                      </span>
                    ) : hasExpired ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Needs Renewal</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Needs {item.missingDocuments.length} Doc</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#006B4F] transition-colors leading-snug">
                  {srv.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {srv.shortDescription}
                </p>

                {/* Benefits Badge */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Benefit:</span>
                  <span className="font-bold text-[#006B4F]">{srv.benefitAmount || srv.benefit}</span>
                </div>

                {/* Missing documents indicator */}
                {hasMissing && (
                  <p className="mt-2 text-[11px] text-amber-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Missing: {item.missingDocuments.map(d => d.replace(/_/g, ' ')).join(', ')}</span>
                  </p>
                )}

                {hasExpired && (
                  <p className="mt-2 text-[11px] text-red-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Expired: {item.expiredDocuments.map(d => d.replace(/_/g, ' ')).join(', ')}</span>
                  </p>
                )}
              </div>

              {/* Card Footer: Readiness & Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-[#006B4F]'}`}
                        style={{ width: `${item.readinessPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {item.readinessPercentage}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Match Score</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#006B4F] group-hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
