import React from 'react';
import { Zap, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';
import { NextBestAction } from '../types';

interface NextActionCardProps {
  action: NextBestAction;
  onViewSteps: () => void;
  lang: SupportedLanguage;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  action,
  onViewSteps,
  lang
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-emerald-50/50 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-xs relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{t.nextBestAction || 'Next Best Action'}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            High Impact
          </span>
        </div>

        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {action.description}
        </p>

        <p className="text-xs text-slate-600 leading-relaxed">
          {action.actionType === 'RENEW_DOCUMENT' 
            ? 'Your residence certificate expired on 10 Aug 2025. Restoring this single proof satisfies prerequisites for Post Matric Scholarship, Bihar Student Credit Card, and PMAY.'
            : 'Uploading this document completes your eligibility criteria.'}
        </p>

        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={onViewSteps}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006B4F] hover:bg-[#004D3A] text-white font-bold text-xs shadow-sm hover:shadow active:scale-98 transition-all"
          >
            <span>{t.viewSteps || 'View Steps'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs text-amber-900 font-bold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            <span>Unlocks {action.servicesUnlockedCount} schemes</span>
          </span>
        </div>
      </div>
    </div>
  );
};
