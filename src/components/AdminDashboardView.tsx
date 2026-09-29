import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileCheck, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Clock,
  Search,
  Plus
} from 'lucide-react';
import { ServiceScheme, AuditLog } from '../types';
import { ApiClient } from '../services/apiClient';

interface AdminDashboardViewProps {
  services: ServiceScheme[];
  onToggleService: (serviceId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  services,
  onToggleService
}) => {
  const [stats, setStats] = useState<any>({
    totalCitizens: 12450,
    documentsProcessed: 48920,
    totalServices: 42,
    activeApplications: 8430,
    averageReadiness: 72,
    mostRecommendedServices: [
      { name: 'Post Matric Scholarship', count: 3210 },
      { name: 'Ayushman Bharat PM-JAY', count: 2840 },
      { name: 'PM Awas Yojana', count: 1950 },
      { name: 'Bihar Student Credit Card', count: 1420 }
    ],
    mostCommonMissingDocs: [
      { document: 'Caste Certificate (OBC/SC/ST)', count: 2420 },
      { document: 'Income Certificate', count: 1840 },
      { document: 'Domicile Certificate (Expired)', count: 1530 }
    ]
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsData, logsData] = await Promise.all([
          ApiClient.getAdminStats(),
          ApiClient.getAuditLogs()
        ]);
        if (statsData) setStats(statsData);
        if (logsData) setAuditLogs(logsData);
      } catch (err) {
        console.warn(err);
      }
    }
    loadAdminData();
  }, []);

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006B4F] text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Operator Portal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            NAGRIVOX Administrative Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Service catalog configuration, eligibility rule health, and live audit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Rules Engine 100% Online
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Citizens</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.totalCitizens.toLocaleString()}
          </p>
          <span className="text-[11px] font-semibold text-emerald-600">+12% this month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Documents Processed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#006B4F]">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.documentsProcessed.toLocaleString()}
          </p>
          <span className="text-[11px] font-semibold text-emerald-600">98.4% OCR Confidence</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Active Schemes</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {services.length} Schemes
          </p>
          <span className="text-[11px] font-semibold text-slate-400">Central & State Matched</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Average Readiness</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats.averageReadiness}%
          </p>
          <span className="text-[11px] font-semibold text-amber-700">Across All Beneficiaries</span>
        </div>
      </div>

      {/* Analytics Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Most Recommended Services */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">
            Most Recommended Citizen Schemes
          </h3>
          <div className="space-y-2.5">
            {stats.mostRecommendedServices.map((srv: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs">
                <span className="font-semibold text-slate-800">{srv.name}</span>
                <span className="font-bold text-[#006B4F]">{srv.count.toLocaleString()} matches</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Common Missing Documents */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">
            Most Common Document Bottlenecks
          </h3>
          <div className="space-y-2.5">
            {stats.mostCommonMissingDocs.map((doc: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs">
                <span className="font-semibold text-amber-950">{doc.document}</span>
                <span className="font-bold text-amber-700">{doc.count.toLocaleString()} citizens affected</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheme Catalog Manager */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Government Scheme Catalog & Rule Config
            </h2>
            <p className="text-xs text-slate-500">
              Manage eligibility requirements, benefit formulas, and official URLs
            </p>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter schemes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#006B4F]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Scheme Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Jurisdiction</th>
                <th className="py-3 px-3">Benefit</th>
                <th className="py-3 px-3">Requirements</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-bold text-slate-900 max-w-xs truncate">
                    {srv.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{srv.category}</td>
                  <td className="py-3 px-3 text-slate-500">{srv.state}</td>
                  <td className="py-3 px-3 font-semibold text-[#006B4F]">{srv.benefitAmount || srv.benefit}</td>
                  <td className="py-3 px-3 text-slate-600">{srv.requirements.length} Rules</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      srv.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {srv.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onToggleService(srv.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-[#006B4F]"
                    >
                      {srv.active ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Audit Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">
          Live System & AI Audit Logs
        </h3>
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                    {log.category}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
