import React from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Hash, 
  Building2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onRenew?: (doc: DocumentItem) => void;
  onDelete?: (docId: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
  onRenew,
  onDelete
}) => {
  if (!document) return null;

  const isExpired = document.status === 'NEEDS_RENEWAL' || document.status === 'EXPIRED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isExpired ? 'bg-amber-100 text-amber-700' : 'bg-[#E8F7F0] text-[#006B4F]'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {document.title}
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  document.status === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : isExpired
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  {document.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {document.fileName || `${document.type.toLowerCase()}.pdf`} • {document.fileSize || '1.2 MB'}
              </p>
            </div>
          </div>

          {/* Key Identification Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Masked Number</span>
              <p className="text-xs font-mono font-bold text-slate-800">
                {document.maskedNumber || 'XXXX XXXX 4821'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">OCR Confidence</span>
              <p className="text-xs font-bold text-emerald-700">
                {Math.round((document.confidenceScore || 0.95) * 100)}% Verified
              </p>
            </div>
          </div>

          {/* Extracted Facts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Extracted Facts & Attributes
            </h3>
            <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100 text-xs">
              {document.extractedData && Object.entries(document.extractedData).map(([key, val]) => (
                <div key={key} className="px-3.5 py-2.5 flex items-center justify-between bg-white hover:bg-slate-50/50">
                  <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-bold text-slate-800 text-right">{String(val)}</span>
                </div>
              ))}
              {(!document.extractedData || Object.keys(document.extractedData).length === 0) && (
                <div className="p-4 text-center text-slate-400 italic">
                  No extracted facts available
                </div>
              )}
            </div>
          </div>

          {/* Notes or Validation Issues */}
          {document.notes && (
            <div className={`p-3 rounded-2xl text-xs ${
              isExpired ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-slate-50 text-slate-600 border border-slate-100'
            }`}>
              <p className="font-semibold mb-0.5">Verification Notes:</p>
              <p className="leading-relaxed">{document.notes}</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(`Remove ${document.title}?`)) {
                    onDelete(document.id);
                    onClose();
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {isExpired && onRenew && (
                <button
                  onClick={() => {
                    onRenew(document);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renew Certificate</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
