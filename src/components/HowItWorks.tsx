import React from 'react';
import { UploadCloud, Cpu, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';

interface HowItWorksProps {
  lang: SupportedLanguage;
  onExploreServices: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang, onExploreServices }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const steps = [
    {
      step: '1',
      title: t.step1Title || 'Upload Documents',
      desc: t.step1Desc || 'Aadhaar, certificates, marksheets etc.',
      icon: UploadCloud,
      color: 'bg-emerald-50 text-[#006B4F] border-emerald-200'
    },
    {
      step: '2',
      title: t.step2Title || 'We Analyze',
      desc: t.step2Desc || 'Extract information and verify',
      icon: Cpu,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      step: '3',
      title: t.step3Title || 'Find Matching Services',
      desc: t.step3Desc || 'Check eligibility and missing items',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      step: '4',
      title: t.step4Title || 'Get Next Steps',
      desc: t.step4Desc || 'Application guide with documents and links',
      icon: Compass,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t.howItWorksTitle || 'How It Works?'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Evidence-to-service matching in four transparent steps
          </p>
        </div>

        <button
          onClick={onExploreServices}
          className="text-xs font-bold text-[#006B4F] hover:text-[#004D3A] flex items-center gap-1 hover:underline"
        >
          <span>Explore All 12 Schemes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="relative flex flex-col p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-[#E8F7F0]/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm ${item.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-black text-slate-400">
                  0{item.step}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>

              {/* Connecting arrow for larger screens */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
