import React, { useState } from 'react';
import { 
  Network, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Database,
  GraduationCap,
  HeartPulse,
  Home,
  Briefcase
} from 'lucide-react';
import { DocumentItem, EvidenceItem, ServiceEligibilityResult } from '../types';

interface EvidenceMapViewProps {
  documents: DocumentItem[];
  evidenceItems: EvidenceItem[];
  results: ServiceEligibilityResult[];
  onSelectService: (res: ServiceEligibilityResult) => void;
}

export const EvidenceMapView: React.FC<EvidenceMapViewProps> = ({
  documents,
  evidenceItems,
  results,
  onSelectService
}) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Group mappings: Document -> Evidence -> Satisfied Service Requirements
  const mappings = [
    {
      docTitle: 'Aadhaar Card',
      docType: 'AADHAAR',
      status: 'VERIFIED',
      masked: 'XXXX XXXX 4821',
      facts: [
        { label: 'Citizen Name', val: 'Sanjeet Kumar', conf: '96%' },
        { label: 'Calculated Age', val: '22 Years (14 May 2003)', conf: '98%' },
        { label: 'Biometric Status', val: 'Active KYC Linked', conf: '99%' }
      ],
      requirementsSatisfied: [
        'Identity & Bio-KYC Requirement',
        'Age between 18-28 Years',
        'Direct Benefit Transfer (DBT) Seeding'
      ],
      services: ['Ayushman Bharat PM-JAY', 'National Apprenticeship Scheme (NAPS)', 'PM Vishwakarma']
    },
    {
      docTitle: 'Income Certificate',
      docType: 'INCOME_CERTIFICATE',
      status: 'VERIFIED',
      masked: 'BR-INC-XXXX89',
      facts: [
        { label: 'Annual Income', val: '₹1,80,000', conf: '94%' },
        { label: 'Issuing Body', val: 'Patna Sadar Revenue Dept', conf: '95%' }
      ],
      requirementsSatisfied: [
        'Income Ceiling <= ₹2,50,000 (Post Matric)',
        'Low-Income Household Tier (Ayushman Bharat)',
        'EWS Housing Threshold <= ₹3,00,000 (PMAY)'
      ],
      services: ['Post Matric Scholarship', 'Ayushman Bharat PM-JAY', 'PM Awas Yojana']
    },
    {
      docTitle: 'Class 12th Marksheet',
      docType: 'MARKSHEET',
      status: 'VERIFIED',
      masked: 'CBSE-XII-XXXX94',
      facts: [
        { label: 'Academic Percentage', val: '84.2% Aggregate', conf: '95%' },
        { label: 'Qualification Level', val: 'Intermediate (10+2 Passed)', conf: '98%' }
      ],
      requirementsSatisfied: [
        'Minimum 50% in Intermediate',
        'Eligibility for Higher Technical Education Loan',
        'Apprenticeship Training Qualification'
      ],
      services: ['Post Matric Scholarship', 'Bihar Student Credit Card Scheme', 'NAPS Apprenticeship']
    },
    {
      docTitle: 'Domicile Certificate',
      docType: 'DOMICILE_CERTIFICATE',
      status: 'NEEDS_RENEWAL',
      masked: 'DOM-PAT-XXXX12',
      facts: [
        { label: 'State Residence', val: 'Bihar (Expired 10 Aug 2025)', conf: '92%' }
      ],
      requirementsSatisfied: [
        'State Residence Requirement (BLOCKED UNTIL RENEWAL)'
      ],
      services: ['Post Matric Scholarship', 'Bihar Student Credit Card Scheme', 'PMAY', 'Mukhyamantri Bhatta (7 Schemes Locked)']
    },
    {
      docTitle: 'Caste Certificate',
      docType: 'CASTE_CERTIFICATE',
      status: 'MISSING',
      facts: [
        { label: 'OBC Category Proof', val: 'Not Uploaded Yet', conf: '0%' }
      ],
      requirementsSatisfied: [
        'OBC Non-Creamy Layer Reservation (Pending Upload)'
      ],
      services: ['Post Matric Scholarship for OBC']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006B4F] text-xs font-bold mb-2">
              <Network className="w-3.5 h-3.5" />
              <span>Evidence-to-Service Graph</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Citizen Evidence Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              NAGRIVOX translates raw citizen documents into verified evidence facts, maps them to official service requirements, and illuminates unlocked welfare entitlements.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500">Active Mapped Relations:</span>
            <p className="font-bold text-[#006B4F] text-sm">5 Documents → 14 Facts → 12 Schemes</p>
          </div>
        </div>
      </div>

      {/* Graph Visual Pipelines */}
      <div className="space-y-4">
        {mappings.map((mapItem, idx) => {
          const isExpired = mapItem.status === 'NEEDS_RENEWAL';
          const isMissing = mapItem.status === 'MISSING';
          const isVerified = mapItem.status === 'VERIFIED';

          return (
            <div
              key={idx}
              className={`
                rounded-3xl p-5 sm:p-6 border transition-all
                ${isExpired 
                  ? 'bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 border-amber-300' 
                  : isMissing
                    ? 'bg-slate-50/70 border-dashed border-slate-300'
                    : 'bg-white border-slate-200/80 shadow-xs'}
              `}
            >
              {/* Row: Doc -> Facts -> Requirement -> Schemes */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                {/* 1. Document Node */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isVerified ? 'bg-emerald-100 text-emerald-800' : isExpired ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {mapItem.status}
                    </span>
                    <FileText className="w-4 h-4 text-[#006B4F]" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{mapItem.docTitle}</h3>
                  {mapItem.masked && <p className="text-[11px] font-mono text-slate-400 mt-0.5">{mapItem.masked}</p>}
                </div>

                {/* 2. Extracted Evidence Facts */}
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Extracted Facts
                  </span>
                  {mapItem.facts.map((f, i) => (
                    <div key={i} className="text-xs flex items-center justify-between">
                      <span className="text-slate-600 font-medium">{f.label}:</span>
                      <span className="font-bold text-slate-900">{f.val}</span>
                    </div>
                  ))}
                </div>

                {/* 3. Official Requirements Satisfied */}
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">
                    Mapped Requirements
                  </span>
                  {mapItem.requirementsSatisfied.map((r, i) => (
                    <div key={i} className="text-xs text-slate-700 font-medium flex items-start gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                        isVerified ? 'text-emerald-600' : 'text-amber-500'
                      }`} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* 4. Target Schemes Unlocked */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Beneficiary Schemes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mapItem.services.map((s, i) => (
                      <span
                        key={i}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                          isVerified 
                            ? 'bg-emerald-50 text-[#006B4F] border-emerald-200' 
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
