import React from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceEligibilityResult } from '../types';

interface ServiceDetailModalProps {
  result: ServiceEligibilityResult | null;
  onClose: () => void;
  onApply: (result: ServiceEligibilityResult) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  result,
  onClose,
  onApply
}) => {
  if (!result) return null;

  const srv = result.service;
  const isEligible = result.status === 'LIKELY_ELIGIBLE';

  const handleApplyClick = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    onApply(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F7F0] text-[#006B4F]">
                {srv.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                {srv.state}
              </span>
              {srv.isDemoData && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Verified Model Data
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {srv.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {srv.description}
            </p>
          </div>

          {/* Benefit Card & Match Meter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80">
              <span className="text-xs font-semibold text-emerald-800">Entitlement Benefit</span>
              <p className="text-base sm:text-lg font-black text-[#006B4F] mt-1">
                {srv.benefit}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-600">Application Readiness</span>
                <span className="font-bold text-slate-900">{result.readinessPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-[#006B4F]'}`}
                  style={{ width: `${result.readinessPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                {result.satisfiedRequirementsCount} of {result.totalRequirementsCount} criteria satisfied
              </p>
            </div>
          </div>

          {/* Structured Requirements Checklist */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Official Eligibility Requirements</span>
              <span className="text-xs text-slate-400 font-normal">Deterministic Rule Evaluation</span>
            </h3>

            <div className="space-y-2">
              {result.satisfiedRequirements.map((evalItem) => (
                <div
                  key={evalItem.requirement.id}
                  className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{evalItem.requirement.name}</p>
                    <p className="text-emerald-800 text-[11px] mt-0.5">{evalItem.reason}</p>
                  </div>
                </div>
              ))}

              {result.missingRequirements.map((evalItem) => (
                <div
                  key={evalItem.requirement.id}
                  className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 text-xs"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{evalItem.requirement.name}</p>
                    <p className="text-amber-800 text-[11px] mt-0.5">{evalItem.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Verification Attribution */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Official Issuing Authority:</span>
              <span className="font-bold text-slate-800">{srv.officialSourceName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Last Verified Date:</span>
              <span className="font-semibold text-slate-700">{srv.lastVerifiedAt}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <a
              href={srv.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#006B4F] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official Government Portal</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Close
              </button>

              <button
                onClick={handleApplyClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#004D3A] text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Initialize Application</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
