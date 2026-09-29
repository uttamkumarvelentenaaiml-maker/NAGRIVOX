import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  FileCheck, 
  Sparkles, 
  Building, 
  Calendar 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApiClient } from '../services/apiClient';

interface RenewStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenewSuccess: () => void;
}

export const RenewStepsModal: React.FC<RenewStepsModalProps> = ({
  isOpen,
  onClose,
  onRenewSuccess
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateRenew = async () => {
    setLoading(true);
    try {
      await ApiClient.renewDocument('doc-03');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onRenewSuccess();
      onClose();
    } catch (e) {
      alert('Renewal failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      num: '1',
      title: 'Visit State RTPS Online Portal',
      desc: 'Access Bihar RTPS portal (serviceonline.bihar.gov.in) or your local Common Service Center (CSC / Vasudha Kendra).'
    },
    {
      num: '2',
      title: 'Select Residential Certificate Service',
      desc: 'Click on "Issue of Residential Certificate at Revenue Officer (RO) Level" under General Administration Department.'
    },
    {
      num: '3',
      title: 'Attach Aadhaar Address Proof',
      desc: 'Upload clear scans of your Aadhaar card (front & back) and a passport size photograph with self-declaration.'
    },
    {
      num: '4',
      title: 'Receive Acknowledgment (RTPS Receipt)',
      desc: 'Note your RTPS reference tracking number. Standard service delivery timeline is 10 to 12 working days.'
    },
    {
      num: '5',
      title: 'Download & Upload Digitally Signed PDF',
      desc: 'Download the certificate with QR authentication and upload it back to NAGRIVOX to instantly unlock 7 schemes.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <RefreshCw className="w-3 h-3 text-amber-600 animate-spin-slow" />
              <span>Next Best Action Guide</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Domicile Certificate Renewal
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Expired on 10 Aug 2025. Restoring this unlocks 7 state & central schemes.
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((st) => (
              <div key={st.num} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span className="w-6 h-6 rounded-full bg-[#006B4F] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {st.num}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">{st.title}</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Official Link */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-emerald-950">Official State Portal</p>
              <p className="text-[11px] text-emerald-800">serviceonline.bihar.gov.in</p>
            </div>
            <a
              href="https://serviceonline.bihar.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white text-[#006B4F] font-bold text-xs border border-emerald-300 flex items-center gap-1.5 shadow-2xs hover:bg-emerald-50"
            >
              <span>Open RTPS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={handleSimulateRenew}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#004D3A] text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{loading ? 'Renewing...' : 'Simulate Instant Renewal'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
