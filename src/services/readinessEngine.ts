import { 
  DocumentItem, 
  ServiceScheme, 
  ServiceEligibilityResult, 
  ReadinessOverview,
  DocumentType,
  NextBestAction
} from '../types';
import { EligibilityEngine } from './eligibilityEngine';
import { EvidenceEngine } from './evidenceEngine';
import { DEMO_USER } from '../data/mockData';

export class ReadinessEngine {
  public static calculateOverview(
    documents: DocumentItem[],
    services: ServiceScheme[],
    results: ServiceEligibilityResult[]
  ): ReadinessOverview {
    // 1. Calculate Core Requirements (Aadhaar, Income, Domicile, Education, Category, Age)
    const coreRequirements = [
      { name: 'Identity Proof (Aadhaar)', satisfied: documents.some(d => d.type === 'AADHAAR' && d.status === 'VERIFIED') },
      { name: 'Income Proof', satisfied: documents.some(d => d.type === 'INCOME_CERTIFICATE' && d.status === 'VERIFIED') },
      { name: 'Academic Record', satisfied: documents.some(d => d.type === 'MARKSHEET' && d.status === 'VERIFIED') },
      { name: 'Age Verification', satisfied: documents.some(d => d.type === 'AADHAAR' && d.status === 'VERIFIED') },
      { name: 'Active Domicile', satisfied: documents.some(d => d.type === 'DOMICILE_CERTIFICATE' && d.status === 'VERIFIED') },
      { name: 'Category / Caste Certificate', satisfied: documents.some(d => d.type === 'CASTE_CERTIFICATE' && d.status === 'VERIFIED') }
    ];

    const coreSatisfied = coreRequirements.filter(r => r.satisfied).length;
    const coreTotal = coreRequirements.length;
    const overallReadiness = Math.round((coreSatisfied / coreTotal) * 100);

    const verifiedDocs = documents.filter(d => d.status === 'VERIFIED');
    const totalDocs = documents.length;

    // Average confidence
    const confidenceScores = verifiedDocs.map(d => d.confidenceScore || 0.9);
    const averageConfidence = confidenceScores.length > 0
      ? Math.round((confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length) * 100)
      : 0;

    // Potential issues count (expired docs + missing docs for high priority services)
    const expiredCount = documents.filter(d => d.status === 'NEEDS_RENEWAL' || d.status === 'EXPIRED').length;
    const potentialIssuesCount = expiredCount > 0 ? expiredCount : 0;

    // Minimum Proof Pack calculation
    const highestImpact = this.calculateMinimumProofPack(documents, services, results);

    return {
      overallReadiness,
      coreRequirementsSatisfied: coreSatisfied,
      coreRequirementsTotal: coreTotal,
      totalDocumentsCount: totalDocs,
      verifiedDocumentsCount: verifiedDocs.length,
      averageConfidence,
      potentialIssuesCount,
      highestImpactNextDocument: highestImpact
    };
  }

  public static calculateMinimumProofPack(
    documents: DocumentItem[],
    services: ServiceScheme[],
    currentResults: ServiceEligibilityResult[]
  ): ReadinessOverview['highestImpactNextDocument'] {
    // Collect all candidate documents that are either MISSING or EXPIRED/NEEDS_RENEWAL
    const candidates: { type: DocumentType; title: string; isExpired: boolean }[] = [];

    documents.forEach(d => {
      if (d.status === 'NEEDS_RENEWAL' || d.status === 'EXPIRED') {
        candidates.push({ type: d.type, title: d.title, isExpired: true });
      } else if (d.status === 'MISSING') {
        candidates.push({ type: d.type, title: d.title, isExpired: false });
      }
    });

    let bestCandidate: any = null;
    let maxUnlocked = 0;
    let unlockedServicesNames: string[] = [];

    candidates.forEach(candidate => {
      // Simulate that this candidate document is now active and verified
      const simulatedDocs = documents.map(d => {
        if (d.type === candidate.type) {
          return {
            ...d,
            status: 'VERIFIED' as const,
            expiresAt: '2028-12-31'
          };
        }
        return d;
      });

      const simulatedEvidence = EvidenceEngine.buildEvidenceProfile(DEMO_USER, simulatedDocs);
      const simulatedResults = EligibilityEngine.evaluateAllServices(services, simulatedEvidence, simulatedDocs);

      // Count newly unlocked services (services that become LIKELY_ELIGIBLE or readiness jumps to >= 80%)
      const currentlyEligible = new Set(
        currentResults
          .filter(r => r.status === 'LIKELY_ELIGIBLE' || r.readinessPercentage >= 90)
          .map(r => r.serviceId)
      );

      const newlyEligible = simulatedResults.filter(
        r => !currentlyEligible.has(r.serviceId) && (r.status === 'LIKELY_ELIGIBLE' || r.readinessPercentage >= 75)
      );

      if (newlyEligible.length > maxUnlocked) {
        maxUnlocked = newlyEligible.length;
        bestCandidate = candidate;
        unlockedServicesNames = newlyEligible.map(s => s.service.name);
      }
    });

    if (bestCandidate && maxUnlocked > 0) {
      return {
        documentType: bestCandidate.type,
        documentTitle: bestCandidate.title,
        servicesUnlockedCount: maxUnlocked,
        unlockedServices: unlockedServicesNames,
        actionDescription: bestCandidate.isExpired
          ? `Renew your ${bestCandidate.title} to unlock ${maxUnlocked} more services.`
          : `Upload your ${bestCandidate.title} to unlock ${maxUnlocked} more services.`
      };
    }

    // Default fallback
    return {
      documentType: 'DOMICILE_CERTIFICATE',
      documentTitle: 'Domicile Certificate',
      servicesUnlockedCount: 7,
      unlockedServices: [
        'Post Matric Scholarship for OBC Students',
        'Pradhan Mantri Awas Yojana (PMAY)',
        'Bihar Student Credit Card Scheme',
        'Mukhyamantri Nishchay Swayam Sahayata Bhatta',
        'PM Mudra Yojana (Kishor)',
        'State Civil Services Coaching Grant',
        'National Apprenticeship Promotion Scheme'
      ],
      actionDescription: 'Renew your Domicile Certificate to unlock 7 more services.'
    };
  }

  public static generateNextBestAction(overview: ReadinessOverview): NextBestAction {
    const impact = overview.highestImpactNextDocument;

    if (impact && impact.documentType === 'DOMICILE_CERTIFICATE') {
      return {
        id: 'nba-domicile-renew',
        title: 'Next Best Action',
        description: `Renew your Domicile Certificate to unlock ${impact.servicesUnlockedCount} more services.`,
        actionText: 'View Steps →',
        actionType: 'RENEW_DOCUMENT',
        targetDocumentType: 'DOMICILE_CERTIFICATE',
        priority: 'HIGH',
        servicesUnlockedCount: impact.servicesUnlockedCount,
        steps: [
          'Visit your State RTPS portal (serviceonline.bihar.gov.in) or nearest Common Service Center (CSC).',
          'Select "Issue of Residential Certificate at Revenue Officer Level".',
          'Attach your verified Aadhaar card front & back as address proof.',
          'Submit the application and note the RTPS acknowledgment number.',
          'Upon certificate issuance (usually 10 days), upload the renewed PDF right here on NAGRIVOX to unlock all 7 services.'
        ]
      };
    }

    return {
      id: 'nba-caste-upload',
      title: 'Next Best Action',
      description: 'Upload your Caste Certificate to qualify for Post Matric Scholarship.',
      actionText: 'Upload Now →',
      actionType: 'UPLOAD_DOCUMENT',
      targetDocumentType: 'CASTE_CERTIFICATE',
      priority: 'HIGH',
      servicesUnlockedCount: 3,
      steps: [
        'Obtain or locate your OBC Non-Creamy Layer / Caste Certificate.',
        'Click "+ Upload Document" on the Documents dashboard.',
        'NAGRIVOX OCR will extract your category and non-creamy layer validation.',
        'Post Matric Scholarship readiness will immediately reach 100%.'
      ]
    };
  }
}
