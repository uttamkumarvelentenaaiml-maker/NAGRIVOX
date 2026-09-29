import React from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  RefreshCw, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { DocumentItem, DocumentType } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';

interface DocumentDashboardProps {
  documents: DocumentItem[];
  onUploadClick: (docType?: DocumentType) => void;
  onViewDoc: (doc: DocumentItem) => void;
  onRenewDoc: (doc: DocumentItem) => void;
  lang: SupportedLanguage;
}

export const DocumentDashboard: React.FC<DocumentDashboardProps> = ({
  documents,
  onUploadClick,
  onViewDoc,
  onRenewDoc,
  lang
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const getStatusBadge = (doc: DocumentItem) => {
    switch (doc.status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t.statusVerified || 'Verified'}</span>
          </span>
        );
      case 'NEEDS_RENEWAL':
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{t.statusNeedsRenewal || 'Needs Renewal'}</span>
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <AlertTriangle className="w-3 h-3 text-slate-400" />
            <span>{t.statusMissing || 'Not Uploaded'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
            <span>{doc.status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Upload Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t.uploadDocumentsTitle || 'Upload Your Documents'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t.uploadDocumentsSubtitle || 'We securely analyze your documents to find matching services'}
          </p>
        </div>

        <button
          onClick={() => onUploadClick()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006B4F] hover:bg-[#004D3A] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.uploadDocumentBtn || '+ Upload Document'}</span>
        </button>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        {documents.map((doc) => {
          const isExpired = doc.status === 'NEEDS_RENEWAL' || doc.status === 'EXPIRED';
          const isMissing = doc.status === 'MISSING';
          const isVerified = doc.status === 'VERIFIED';

          return (
            <div
              key={doc.id}
              className={`
                rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between relative group
                ${isExpired 
                  ? 'bg-gradient-to-b from-amber-50/40 to-white border-amber-300 shadow-xs ring-1 ring-amber-300/60' 
                  : isMissing
                    ? 'bg-slate-50/60 border-dashed border-slate-300 hover:border-[#006B4F]'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-md'}
              `}
            >
              {/* Card Top: Icon & Status */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${isExpired 
                      ? 'bg-amber-100 text-amber-700' 
                      : isMissing 
                        ? 'bg-slate-200/70 text-slate-500' 
                        : 'bg-[#E8F7F0] text-[#006B4F]'}
                  `}>
                    <FileText className="w-5 h-5" />
                  </div>
                  {getStatusBadge(doc)}
                </div>

                {/* Title & Document Number */}
                <h3 className="font-bold text-sm text-slate-900 tracking-tight leading-snug">
                  {doc.title}
                </h3>

                {doc.maskedNumber && (
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {doc.maskedNumber}
                  </p>
                )}

                {/* Status-specific notes / expiry */}
                <div className="mt-2.5 text-xs">
                  {isExpired && (
                    <div className="p-2 rounded-lg bg-amber-100/70 border border-amber-200/80 text-amber-900 space-y-0.5">
                      <p className="font-bold text-[11px]">Expired on 10 Aug 2025</p>
                      <p className="text-[10px] text-amber-800 leading-tight">7 services locked until renewal</p>
                    </div>
                  )}

                  {isMissing && (
                    <p className="text-slate-500 text-[11px] italic">
                      Required for OBC Category Scholarships & Quotas
                    </p>
                  )}

                  {isVerified && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Confidence</span>
                      <span className="font-bold text-emerald-700">
                        {Math.round((doc.confidenceScore || 0.95) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-4 pt-2 border-t border-slate-100">
                {isExpired && (
                  <button
                    onClick={() => onRenewDoc(doc)}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Renew / Steps</span>
                  </button>
                )}

                {isMissing && (
                  <button
                    onClick={() => onUploadClick(doc.type)}
                    className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-[#E8F7F0] text-[#006B4F] border border-slate-300 hover:border-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Now</span>
                  </button>
                )}

                {isVerified && (
                  <button
                    onClick={() => onViewDoc(doc)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Evidence</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
