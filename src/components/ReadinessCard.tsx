import React from 'react';
import { ArrowRight, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';
import { ReadinessOverview } from '../types';

interface ReadinessCardProps {
  overview: ReadinessOverview;
  onViewAnalysis: () => void;
  lang: SupportedLanguage;
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({
  overview,
  onViewAnalysis,
  lang
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const percentage = overview.overallReadiness;

  // SVG Circular progress constants
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t.yourReadiness || 'Your Readiness'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Dynamic evidence score
          </p>
        </div>
        <span className="p-2 rounded-xl bg-emerald-50 text-[#006B4F]">
          <ShieldCheck className="w-4 h-4" />
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 my-2">
        {/* Animated Circular Progress Gauge */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#006B4F"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {percentage}%
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Ready
            </span>
          </div>
        </div>

        {/* Breakdown Summary */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            <span className="text-[#006B4F] font-bold">{overview.coreRequirementsSatisfied} out of {overview.coreRequirementsTotal}</span> {t.requirementsCompleted || 'core requirements completed'}
          </p>

          <div className="space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Aadhaar & Income Verified</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>1 Expired • 1 Missing Document</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onViewAnalysis}
        className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#E8F7F0] text-slate-700 hover:text-[#006B4F] border border-slate-200/80 hover:border-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
      >
        <span>{t.viewDetailedAnalysis || 'View Detailed Analysis'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
