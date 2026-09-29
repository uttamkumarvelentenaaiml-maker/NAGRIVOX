import { 
  ServiceScheme, 
  EvidenceItem, 
  DocumentItem, 
  ServiceEligibilityResult, 
  RequirementEvaluation,
  EligibilityStatus,
  DocumentType
} from '../types';

export class EligibilityEngine {
  public static evaluateService(
    service: ServiceScheme,
    evidenceItems: EvidenceItem[],
    documents: DocumentItem[]
  ): ServiceEligibilityResult {
    const evidenceMap = new Map<string, EvidenceItem>();
    evidenceItems.forEach(item => evidenceMap.set(item.key, item));

    const satisfiedRequirements: RequirementEvaluation[] = [];
    const missingRequirements: RequirementEvaluation[] = [];
    const missingDocuments: DocumentType[] = [];
    const expiredDocuments: DocumentType[] = [];
    const potentialIssues: string[] = [];

    let totalWeight = 0;
    let earnedWeight = 0;

    // Check required documents presence and expiry
    service.requiredDocumentTypes.forEach(docType => {
      const doc = documents.find(d => d.type === docType);
      if (!doc || doc.status === 'MISSING') {
        if (!missingDocuments.includes(docType)) {
          missingDocuments.push(docType);
        }
      } else if (doc.status === 'NEEDS_RENEWAL' || doc.status === 'EXPIRED') {
        if (!expiredDocuments.includes(docType)) {
          expiredDocuments.push(docType);
        }
      }
    });

    // Evaluate each requirement
    service.requirements.forEach(req => {
      totalWeight += req.weight;
      const evidence = evidenceMap.get(req.evidenceKey);
      const doc = req.documentType ? documents.find(d => d.type === req.documentType) : undefined;

      let satisfied = false;
      let reason = '';
      const actualValue = evidence?.value;

      if (!evidence || evidence.value === undefined || evidence.value === null) {
        satisfied = false;
        reason = `Evidence for "${req.name}" is missing or unverified.`;
      } else {
        switch (req.operator) {
          case 'EQUALS':
            satisfied = evidence.value === req.expectedValue;
            reason = satisfied 
              ? `${req.name} verified (${evidence.displayValue})`
              : `Expected ${req.expectedValue}, found ${evidence.displayValue}`;
            break;

          case 'NOT_EQUALS':
            satisfied = evidence.value !== req.expectedValue;
            reason = satisfied ? `${req.name} criterion met` : `Condition not satisfied`;
            break;

          case 'GREATER_OR_EQUAL':
            satisfied = Number(actualValue) >= Number(req.expectedValue);
            reason = satisfied
              ? `${req.name} met (${actualValue} >= ${req.expectedValue})`
              : `${req.name} insufficient (${actualValue} < ${req.expectedValue})`;
            break;

          case 'LESS_OR_EQUAL':
            satisfied = Number(actualValue) <= Number(req.expectedValue);
            reason = satisfied
              ? `${req.name} within limit (${evidence.displayValue} <= ₹${Number(req.expectedValue).toLocaleString('en-IN')})`
              : `${req.name} exceeds threshold (${actualValue} > ${req.expectedValue})`;
            break;

          case 'GREATER_THAN':
            satisfied = Number(actualValue) > Number(req.expectedValue);
            reason = satisfied ? `${req.name} satisfied` : `${req.name} threshold not reached`;
            break;

          case 'LESS_THAN':
            satisfied = Number(actualValue) < Number(req.expectedValue);
            reason = satisfied ? `${req.name} satisfied` : `${req.name} limit exceeded`;
            break;

          case 'IN':
            if (Array.isArray(req.expectedValue)) {
              satisfied = req.expectedValue.includes(actualValue);
              reason = satisfied 
                ? `${req.name} qualifies under approved categories (${actualValue})`
                : `${req.name} does not match required categories [${req.expectedValue.join(', ')}]`;
            }
            break;

          case 'CONTAINS':
            satisfied = String(actualValue).toLowerCase().includes(String(req.expectedValue).toLowerCase());
            reason = satisfied ? `${req.name} validated` : `Record does not contain required keyword`;
            break;

          case 'EXISTS':
          case 'DOCUMENT_PRESENT':
            satisfied = Boolean(actualValue);
            reason = satisfied ? `${req.name} is present` : `Document is missing`;
            break;

          case 'DATE_VALID':
            satisfied = doc ? doc.status !== 'EXPIRED' && doc.status !== 'NEEDS_RENEWAL' : false;
            reason = satisfied ? 'Document is active and within validity period' : 'Document has expired or requires renewal';
            break;

          default:
            satisfied = Boolean(actualValue);
            reason = satisfied ? 'Condition met' : 'Condition not met';
        }
      }

      // If requirement relies on a document that is expired, flag it
      if (doc && (doc.status === 'NEEDS_RENEWAL' || doc.status === 'EXPIRED')) {
        satisfied = false;
        reason = `${req.name}: Associated document (${doc.title}) has expired. Renewal needed.`;
      }

      // If document is missing
      if (req.documentType && (!doc || doc.status === 'MISSING')) {
        satisfied = false;
        reason = `${req.name}: Requires document "${req.documentType.replace(/_/g, ' ')}" which is not uploaded.`;
      }

      const evaluation: RequirementEvaluation = {
        requirement: req,
        satisfied,
        actualValue,
        reason,
        missingDocument: req.documentType && (!doc || doc.status === 'MISSING') ? req.documentType : undefined
      };

      if (satisfied) {
        satisfiedRequirements.push(evaluation);
        earnedWeight += req.weight;
      } else {
        missingRequirements.push(evaluation);
        if (doc && (doc.status === 'NEEDS_RENEWAL' || doc.status === 'EXPIRED')) {
          potentialIssues.push(`${doc.title} expired`);
        } else if (req.documentType && (!doc || doc.status === 'MISSING')) {
          potentialIssues.push(`Missing ${req.documentType.replace(/_/g, ' ')}`);
        }
      }
    });

    const readinessPercentage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

    // Determine overall eligibility status
    let status: EligibilityStatus = 'LIKELY_ELIGIBLE';
    let nextStepRecommendation = 'All core criteria satisfied. You are ready to apply!';

    if (expiredDocuments.length > 0) {
      status = 'DOCUMENT_EXPIRED';
      nextStepRecommendation = `Renew your ${expiredDocuments[0].replace(/_/g, ' ').toLowerCase()} to restore eligibility.`;
    } else if (missingDocuments.length > 0) {
      if (readinessPercentage >= 60) {
        status = 'DOCUMENT_MISSING';
        nextStepRecommendation = `Upload ${missingDocuments[0].replace(/_/g, ' ').toLowerCase()} to complete your application.`;
      } else {
        status = 'NEEDS_MORE_INFORMATION';
        nextStepRecommendation = `Requires ${missingDocuments.length} more documents to establish eligibility.`;
      }
    } else if (readinessPercentage < 50) {
      status = 'NOT_ELIGIBLE';
      nextStepRecommendation = 'Your current profile criteria does not meet this scheme\'s prerequisites.';
    }

    return {
      serviceId: service.id,
      service,
      status,
      readinessPercentage,
      satisfiedRequirementsCount: satisfiedRequirements.length,
      totalRequirementsCount: service.requirements.length,
      satisfiedRequirements,
      missingRequirements,
      missingDocuments,
      hasExpiredDocuments: expiredDocuments.length > 0,
      expiredDocuments,
      potentialIssues,
      nextStepRecommendation
    };
  }

  public static evaluateAllServices(
    services: ServiceScheme[],
    evidenceItems: EvidenceItem[],
    documents: DocumentItem[]
  ): ServiceEligibilityResult[] {
    return services.map(srv => this.evaluateService(srv, evidenceItems, documents));
  }
}
