import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, Languages } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';

interface HeroCardProps {
  onAskClick: () => void;
  lang: SupportedLanguage;
}

export const HeroCard: React.FC<HeroCardProps> = ({ onAskClick, lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#004D3A] via-[#006B4F] to-[#0A7B5C] text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/10 border border-emerald-700/40">
      {/* Decorative background vectors */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-16 w-80 h-80 rounded-full bg-[#16A36A]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-3 sm:space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-100">
            <Languages className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.availableLanguagesBadge || 'Available in 10+ Indian Languages'}</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              NAGRIVOX
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base font-medium mt-1">
              AI-Powered Citizen Service Readiness Platform
            </p>
          </div>

          {/* Core USP quote */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 inline-block">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-50 italic">
              "Know what you have. Know what's missing. Know what to do next."
            </p>
          </div>

          {/* Actions */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              onClick={onAskClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#004D3A] font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 active:scale-98 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#006B4F]" />
              <span>{t.askNagrivox || 'Ask NAGRIVOX'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Evidence-to-Service Mapping</span>
            </div>
          </div>
        </div>

        {/* Visual Civic Illustration */}
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <div className="relative p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg max-w-[260px]">
            <div className="rounded-xl overflow-hidden aspect-4/3 bg-emerald-900/40 relative">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
                alt="Indian citizen empowerment"
                className="w-full h-full object-cover mix-blend-luminosity opacity-85 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004D3A]/90 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-bold text-white tracking-wide">
                  Empowering 140 Cr+ Citizens
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-100 font-medium px-1">
              <span>National Scheme Matrix</span>
              <span className="text-emerald-300 font-bold">100% Grounded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
