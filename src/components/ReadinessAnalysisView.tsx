import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  Clock, 
  Info,
  ArrowRight
} from 'lucide-react';
import { ReadinessOverview, DocumentItem } from '../types';
import { ConsistencyEngine } from '../services/consistencyEngine';

interface ReadinessAnalysisViewProps {
  overview: ReadinessOverview;
  documents: DocumentItem[];
  onRenewClick: () => void;
  onUploadClick: () => void;
}

export const ReadinessAnalysisView: React.FC<ReadinessAnalysisViewProps> = ({
  overview,
  documents,
  onRenewClick,
  onUploadClick
}) => {
  const consistencyResults = ConsistencyEngine.runChecks(documents);

  const coreBreakdown = [
    { title: 'Identity & Age Proof', status: 'COMPLETED', doc: 'Aadhaar Card', val: '22 Years / Verified', ok: true },
    { title: 'Income Certification', status: 'COMPLETED', doc: 'Income Certificate', val: '₹1,80,000 / Valid', ok: true },
    { title: 'Academic Evidence', status: 'COMPLETED', doc: '12th Marksheet', val: '84.2% Aggregate', ok: true },
    { title: 'Student Enrollment Status', status: 'COMPLETED', doc: 'Undergraduate', val: 'Active Enrolled', ok: true },
    { title: 'State Domicile Status', status: 'EXPIRED', doc: 'Domicile Certificate', val: 'Expired on 10 Aug 2025', ok: false },
    { title: 'Social Category Proof', status: 'MISSING', doc: 'Caste Certificate', val: 'Not Uploaded Yet', ok: false }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006B4F] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Diagnostic Readiness Audit</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Application Readiness Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              NAGRIVOX computes deterministic compliance against Indian welfare schemes by validating documents, cross-referencing demographic consistency, and tracking certificate lifecycles.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60">
            <div className="text-center">
              <span className="text-3xl font-black text-[#006B4F]">{overview.overallReadiness}%</span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Overall Readiness</p>
            </div>
            <div className="h-10 w-px bg-emerald-200" />
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-slate-800">{overview.coreRequirementsSatisfied} of {overview.coreRequirementsTotal} Core Criteria</p>
              <p className="text-emerald-700 font-semibold">{overview.averageConfidence}% OCR Confidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimum Proof Pack ("What Can I Unlock?") */}
      <div className="bg-gradient-to-br from-amber-500 via-[#006B4F] to-[#004D3A] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-amber-200">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Minimum Proof Pack • Highest-Impact Action</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Renew your Domicile Certificate to unlock 7 more services
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Our graph engine analyzed all pending schemes and discovered that the <strong>Domicile Certificate</strong> is the single bottleneck holding back 7 distinct entitlements, including Post Matric Scholarship and the Bihar Student Credit Card (₹4 Lakhs).
            </p>
          </div>

          <button
            onClick={onRenewClick}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-[#004D3A] font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4 text-[#006B4F]" />
            <span>Renew Domicile Certificate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Core Requirements Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Core Requirements Status (4 / 6 Completed)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {coreBreakdown.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition-all ${
                item.ok 
                  ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950' 
                  : 'bg-amber-50/40 border-amber-200/80 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.ok ? 'bg-emerald-200/60 text-emerald-900' : 'bg-amber-200/70 text-amber-900'
                }`}>
                  {item.status}
                </span>
                {item.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">{item.doc}</p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Document Consistency Engine Report */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Cross-Document Consistency Audit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated comparison of demographic identifiers across all uploaded documents
            </p>
          </div>
          <span className="p-2 rounded-xl bg-slate-100 text-slate-600">
            <Info className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-3">
          {consistencyResults.map((check, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                check.hasMismatch
                  ? check.severity === 'LOW'
                    ? 'bg-blue-50/40 border-blue-200 text-blue-950'
                    : 'bg-amber-50/40 border-amber-200 text-amber-950'
                  : 'bg-slate-50/70 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900">
                  {check.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  check.hasMismatch
                    ? check.severity === 'LOW'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {check.hasMismatch ? `Potential Mismatch (${check.severity} Severity)` : 'Consistent'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs mb-2">
                {check.values.map((v, i) => (
                  <span key={i} className="p-1.5 rounded-lg bg-white border border-slate-200/70 text-slate-700">
                    <strong>{v.documentTitle}:</strong> {v.value}
                  </span>
                ))}
              </div>

              {check.explanation && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {check.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
