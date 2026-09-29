export type DocumentType = 
  | 'AADHAAR' 
  | 'INCOME_CERTIFICATE' 
  | 'DOMICILE_CERTIFICATE' 
  | 'MARKSHEET' 
  | 'CASTE_CERTIFICATE' 
  | 'RATION_CARD' 
  | 'PAN_CARD' 
  | 'VOTER_ID' 
  | 'DISABILITY_CERTIFICATE' 
  | 'LAND_RECORD';

export type DocumentStatus = 
  | 'UPLOADED' 
  | 'PROCESSING' 
  | 'VERIFIED' 
  | 'NEEDS_RENEWAL' 
  | 'EXPIRED' 
  | 'MISSING' 
  | 'REJECTED' 
  | 'MISMATCH_DETECTED';

export type UserRole = 'CITIZEN' | 'ADMIN' | 'OPERATOR';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  state: string;
  district: string;
  preferredLanguage: string;
  dob?: string;
  gender?: string;
  category?: string; // GENERAL, OBC, SC, ST, EWS
  education?: string;
  occupation?: string;
  annualIncome?: number;
  familySize?: number;
  isFarmer?: boolean;
  isStudent?: boolean;
  hasDisability?: boolean;
  avatarUrl?: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  type: DocumentType;
  title: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  status: DocumentStatus;
  uploadedAt?: string;
  issuedAt?: string;
  expiresAt?: string;
  confidenceScore?: number;
  extractedData?: Record<string, any>;
  maskedNumber?: string;
  issuer?: string;
  notes?: string;
  validationIssues?: string[];
}

export interface EvidenceItem {
  id: string;
  citizenId: string;
  key: string;
  label: string;
  value: string | number | boolean;
  displayValue: string;
  sourceDocumentId?: string;
  sourceDocumentType: DocumentType;
  confidence: number;
  extractedAt: string;
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'CONFLICT';
  validUntil?: string;
}

export interface ConsistencyCheckResult {
  field: string;
  label: string;
  hasMismatch: boolean;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  values: {
    documentType: DocumentType;
    documentTitle: string;
    value: string;
  }[];
  explanation?: string;
  suggestedAction?: string;
}

export type RequirementOperator = 
  | 'EQUALS' 
  | 'NOT_EQUALS' 
  | 'GREATER_THAN' 
  | 'LESS_THAN' 
  | 'GREATER_OR_EQUAL' 
  | 'LESS_OR_EQUAL' 
  | 'IN' 
  | 'CONTAINS' 
  | 'EXISTS' 
  | 'DATE_VALID' 
  | 'DOCUMENT_PRESENT';

export interface ServiceRequirement {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  evidenceKey: string;
  operator: RequirementOperator;
  expectedValue: any;
  required: boolean;
  weight: number;
  documentType?: DocumentType;
}

export type EligibilityStatus = 
  | 'LIKELY_ELIGIBLE' 
  | 'NOT_ELIGIBLE' 
  | 'NEEDS_MORE_INFORMATION' 
  | 'DOCUMENT_MISSING' 
  | 'DOCUMENT_EXPIRED' 
  | 'POTENTIAL_MISMATCH';

export interface ServiceScheme {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'Scholarships' | 'Pension' | 'Health' | 'Employment' | 'Certificates' | 'Housing' | 'Farmers' | 'Others';
  state: string; // "Central" or state name
  centralOrState: 'CENTRAL' | 'STATE';
  officialUrl: string;
  applicationUrl: string;
  benefit: string;
  benefitAmount?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  active: boolean;
  deadline?: string;
  requirements: ServiceRequirement[];
  requiredDocumentTypes: DocumentType[];
  prerequisites?: string[];
  keywords: string[];
  officialSourceName: string;
  officialSourceUrl: string;
  lastVerifiedAt: string;
  isDemoData: boolean;
}

export interface RequirementEvaluation {
  requirement: ServiceRequirement;
  satisfied: boolean;
  actualValue?: any;
  reason: string;
  missingDocument?: DocumentType;
}

export interface ServiceEligibilityResult {
  serviceId: string;
  service: ServiceScheme;
  status: EligibilityStatus;
  readinessPercentage: number;
  satisfiedRequirementsCount: number;
  totalRequirementsCount: number;
  satisfiedRequirements: RequirementEvaluation[];
  missingRequirements: RequirementEvaluation[];
  missingDocuments: DocumentType[];
  hasExpiredDocuments: boolean;
  expiredDocuments: DocumentType[];
  potentialIssues: string[];
  nextStepRecommendation: string;
}

export interface ReadinessOverview {
  overallReadiness: number;
  coreRequirementsSatisfied: number;
  coreRequirementsTotal: number;
  totalDocumentsCount: number;
  verifiedDocumentsCount: number;
  averageConfidence: number;
  potentialIssuesCount: number;
  highestImpactNextDocument?: {
    documentType: DocumentType;
    documentTitle: string;
    servicesUnlockedCount: number;
    unlockedServices: string[];
    actionDescription: string;
  };
}

export interface NextBestAction {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionType: 'RENEW_DOCUMENT' | 'UPLOAD_DOCUMENT' | 'RESOLVE_MISMATCH' | 'APPLY_SERVICE';
  targetDocumentType?: DocumentType;
  targetServiceId?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  servicesUnlockedCount: number;
  steps: string[];
}

export interface CitizenApplication {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  benefit: string;
  submittedDate: string;
  lastUpdated: string;
  status: 'DRAFT' | 'READY' | 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENT_REQUIRED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  applicationNumber: string;
  nextAction?: string;
  timeline: {
    title: string;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'EXPIRY' | 'MISSING_DOC' | 'MISMATCH' | 'ELIGIBILITY' | 'APPLICATION' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
  actionLabel?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: {
    title: string;
    url: string;
    source: string;
  }[];
  suggestedPrompts?: string[];
  actionLink?: {
    label: string;
    action: string;
  };
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  serviceId?: string;
  category: string;
  content: string;
  source: string;
  sourceUrl: string;
  lastVerified: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  category: string;
  details: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}
