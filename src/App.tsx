import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { HeroCard } from './components/HeroCard';
import { ReadinessCard } from './components/ReadinessCard';
import { NextActionCard } from './components/NextActionCard';
import { DocumentDashboard } from './components/DocumentDashboard';
import { HowItWorks } from './components/HowItWorks';
import { RecommendedServices } from './components/RecommendedServices';
import { AskNagrivoxAssistant } from './components/AskNagrivoxAssistant';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { RenewStepsModal } from './components/RenewStepsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { VoiceInputModal } from './components/VoiceInputModal';
import { EvidenceMapView } from './components/EvidenceMapView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { ReadinessAnalysisView } from './components/ReadinessAnalysisView';
import { AdminDashboardView } from './components/AdminDashboardView';

import { 
  UserProfile, 
  DocumentItem, 
  ServiceScheme, 
  CitizenApplication, 
  NotificationItem, 
  ServiceEligibilityResult,
  DocumentType 
} from './types';
import { SupportedLanguage } from './locales/translations';
import { 
  DEMO_USER, 
  INITIAL_DOCUMENTS, 
  INITIAL_SERVICES, 
  INITIAL_APPLICATIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { EvidenceEngine } from './services/evidenceEngine';
import { EligibilityEngine } from './services/eligibilityEngine';
import { ReadinessEngine } from './services/readinessEngine';
import { ApiClient } from './services/apiClient';

export function App() {
  // Application State
  const [user, setUser] = useState<UserProfile>(DEMO_USER);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [services, setServices] = useState<ServiceScheme[]>(INITIAL_SERVICES);
  const [applications, setApplications] = useState<CitizenApplication[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Navigation & Localization
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Panels
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [preselectedUploadType, setPreselectedUploadType] = useState<DocumentType | undefined>(undefined);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [selectedServiceResult, setSelectedServiceResult] = useState<ServiceEligibilityResult | null>(null);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Synchronize state with backend on mount
  useEffect(() => {
    async function initData() {
      try {
        const [docs, apps, notifs] = await Promise.all([
          ApiClient.getDocuments(),
          ApiClient.getApplications(),
          ApiClient.getNotifications()
        ]);
        if (docs && docs.length > 0) setDocuments(docs);
        if (apps && apps.length > 0) setApplications(apps);
        if (notifs && notifs.length > 0) setNotifications(notifs);
      } catch (e) {
        console.warn('Initial sync fallback to local store:', e);
      }
    }
    initData();
  }, []);

  // Compute Evidence Profile dynamically
  const evidenceItems = useMemo(() => {
    return EvidenceEngine.buildEvidenceProfile(user, documents);
  }, [user, documents]);

  // Compute Eligibility Results for all schemes deterministically
  const eligibilityResults = useMemo(() => {
    return EligibilityEngine.evaluateAllServices(services, evidenceItems, documents);
  }, [services, evidenceItems, documents]);

  // Compute Overall Readiness & Minimum Proof Pack
  const readinessOverview = useMemo(() => {
    return ReadinessEngine.calculateOverview(documents, services, eligibilityResults);
  }, [documents, services, eligibilityResults]);

  // Compute Next Best Action
  const nextBestAction = useMemo(() => {
    return ReadinessEngine.generateNextBestAction(readinessOverview);
  }, [readinessOverview]);

  // Count unread notifications
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Handlers
  const handleUploadClick = (docType?: DocumentType) => {
    setPreselectedUploadType(docType);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments(prev => {
      const idx = prev.findIndex(d => d.type === newDoc.type);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newDoc;
        return updated;
      }
      return [...prev, newDoc];
    });
    // Refresh notifications
    ApiClient.getNotifications().then(n => setNotifications(n)).catch(() => {});
  };

  const handleRenewSuccess = () => {
    // Reload documents from API
    ApiClient.getDocuments().then(docs => {
      setDocuments(docs);
    }).catch(() => {
      // Fallback update
      setDocuments(prev => prev.map(d => {
        if (d.type === 'DOMICILE_CERTIFICATE') {
          return {
            ...d,
            status: 'VERIFIED',
            expiresAt: '2028-12-31',
            notes: 'Renewed successfully.'
          };
        }
        return d;
      }));
    });
    ApiClient.getNotifications().then(n => setNotifications(n)).catch(() => {});
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await ApiClient.deleteDocument(docId);
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'MISSING', extractedData: undefined } : d));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleApplyService = async (result: ServiceEligibilityResult) => {
    try {
      const newApp = await ApiClient.createApplication({
        serviceId: result.service.id,
        serviceName: result.service.name,
        serviceCategory: result.service.category,
        benefit: result.service.benefitAmount || result.service.benefit
      });
      setApplications(prev => [newApp, ...prev]);
      setSelectedServiceResult(null);
      setCurrentTab('tracker');
    } catch (e) {
      alert('Application draft created');
      setCurrentTab('tracker');
    }
  };

  const handleToggleService = (srvId: string) => {
    setServices(prev => prev.map(s => s.id === srvId ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-slate-800 flex">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        unreadCount={unreadNotificationsCount}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          user={user}
          lang={lang}
          onLanguageChange={setLang}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          unreadCount={unreadNotificationsCount}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onStartVoice={() => setVoiceModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTab={setCurrentTab}
        />

        {/* Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {currentTab === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Center Dashboard (Columns 1-8) */}
              <div className="lg:col-span-8 space-y-6">
                <HeroCard
                  onAskClick={() => setCurrentTab('chat')}
                  lang={lang}
                />

                <DocumentDashboard
                  documents={documents}
                  onUploadClick={handleUploadClick}
                  onViewDoc={(doc) => setViewingDoc(doc)}
                  onRenewDoc={() => setRenewModalOpen(true)}
                  lang={lang}
                />

                <HowItWorks
                  lang={lang}
                  onExploreServices={() => setCurrentTab('services')}
                />

                <RecommendedServices
                  results={eligibilityResults}
                  onSelectService={(res) => setSelectedServiceResult(res)}
                  lang={lang}
                  searchQuery={searchQuery}
                />
              </div>

              {/* Right Column (Columns 9-12): Readiness + Next Action + Assistant */}
              <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
                <ReadinessCard
                  overview={readinessOverview}
                  onViewAnalysis={() => setCurrentTab('readiness')}
                  lang={lang}
                />

                <NextActionCard
                  action={nextBestAction}
                  onViewSteps={() => setRenewModalOpen(true)}
                  lang={lang}
                />

                <AskNagrivoxAssistant
                  lang={lang}
                  onApplyAction={(act) => {
                    if (act === 'RENEW_DOMICILE') setRenewModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {currentTab === 'documents' && (
            <div className="space-y-6">
              <DocumentDashboard
                documents={documents}
                onUploadClick={handleUploadClick}
                onViewDoc={(doc) => setViewingDoc(doc)}
                onRenewDoc={() => setRenewModalOpen(true)}
                lang={lang}
              />
            </div>
          )}

          {currentTab === 'eligibility' && (
            <ReadinessAnalysisView
              overview={readinessOverview}
              documents={documents}
              onRenewClick={() => setRenewModalOpen(true)}
              onUploadClick={() => handleUploadClick()}
            />
          )}

          {currentTab === 'services' && (
            <RecommendedServices
              results={eligibilityResults}
              onSelectService={(res) => setSelectedServiceResult(res)}
              lang={lang}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'tracker' && (
            <ApplicationTrackerView
              applications={applications}
              onUploadMissing={() => handleUploadClick()}
            />
          )}

          {currentTab === 'evidence-map' && (
            <EvidenceMapView
              documents={documents}
              evidenceItems={evidenceItems}
              results={eligibilityResults}
              onSelectService={(res) => setSelectedServiceResult(res)}
            />
          )}

          {currentTab === 'chat' && (
            <div className="max-w-3xl mx-auto py-2">
              <AskNagrivoxAssistant
                lang={lang}
                onApplyAction={(act) => {
                  if (act === 'RENEW_DOMICILE') setRenewModalOpen(true);
                }}
              />
            </div>
          )}

          {currentTab === 'readiness' && (
            <ReadinessAnalysisView
              overview={readinessOverview}
              documents={documents}
              onRenewClick={() => setRenewModalOpen(true)}
              onUploadClick={() => handleUploadClick()}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboardView
              services={services}
              onToggleService={handleToggleService}
            />
          )}
        </main>
      </div>

      {/* 3. Global Modals & Drawers */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        preselectedType={preselectedUploadType}
        onUploadSuccess={handleUploadSuccess}
      />

      <DocumentViewerModal
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onRenew={() => {
          setViewingDoc(null);
          setRenewModalOpen(true);
        }}
        onDelete={handleDeleteDocument}
      />

      <ServiceDetailModal
        result={selectedServiceResult}
        onClose={() => setSelectedServiceResult(null)}
        onApply={handleApplyService}
      />

      <RenewStepsModal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        onRenewSuccess={handleRenewSuccess}
      />

      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onNotificationUpdate={() => {
          ApiClient.getNotifications().then(n => setNotifications(n)).catch(() => {});
        }}
        onActionClick={(actionLink) => {
          if (actionLink === 'SERVICE_DOMICILE') setRenewModalOpen(true);
          else if (actionLink === 'DOC_UPLOAD') handleUploadClick('CASTE_CERTIFICATE');
          else if (actionLink === 'READINESS_VIEW') setCurrentTab('readiness');
          else if (actionLink === 'NAV_ELIGIBILITY') setCurrentTab('eligibility');
          else if (actionLink === 'NAV_SERVICES') setCurrentTab('services');
        }}
      />

      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        lang={lang}
        onTranscript={(text) => {
          setSearchQuery(text);
          setCurrentTab('services');
        }}
      />
    </div>
  );
}

export default App;
