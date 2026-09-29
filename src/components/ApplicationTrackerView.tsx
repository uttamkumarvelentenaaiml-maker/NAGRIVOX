import React, { useState } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Calendar, 
  ChevronRight, 
  X,
  FileText
} from 'lucide-react';
import { CitizenApplication } from '../types';

interface ApplicationTrackerViewProps {
  applications: CitizenApplication[];
  onUploadMissing: (serviceId?: string) => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onUploadMissing
}) => {
  const [selectedApp, setSelectedApp] = useState<CitizenApplication | null>(null);

  const getStatusBadge = (status: CitizenApplication['status']) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'READY':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#006B4F] border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready to Submit</span>
          </span>
        );
      case 'DOCUMENT_REQUIRED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Document Required</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Under Review</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006B4F] text-xs font-bold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>National Service Tracking</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor real-time verification stages, officer notes, and next document actions.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <span className="text-slate-500">Active Applications:</span>
          <span className="ml-2 font-bold text-slate-900">{applications.length} Ongoing</span>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {app.applicationNumber}
                </span>
                {getStatusBadge(app.status)}
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {app.serviceName}
              </h3>

              <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-700">{app.serviceCategory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Benefit:</span>
                  <span className="font-bold text-[#006B4F]">{app.benefit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Submitted On:</span>
                  <span className="text-slate-600">
                    {new Date(app.submittedDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {app.nextAction && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Required Action:</span>
                  <span>{app.nextAction}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedApp(app)}
                className="text-xs font-bold text-[#006B4F] hover:text-[#004D3A] flex items-center gap-1"
              >
                <span>View Timeline & Events</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {app.status === 'DOCUMENT_REQUIRED' && (
                <button
                  onClick={() => onUploadMissing(app.serviceId)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#006B4F] text-white font-bold text-xs hover:bg-[#004D3A] transition-colors"
                >
                  Upload Documents
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Application Timeline Drawer/Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {selectedApp.applicationNumber}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedApp.serviceName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verification Audit History
                </p>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedApp.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      event.completed ? 'bg-[#006B4F] text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{event.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedApp.notes && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">Officer Notes:</span>
                  <span>{selectedApp.notes}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
