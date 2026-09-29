import { DocumentItem, UserProfile, EvidenceItem } from '../types';

export class EvidenceEngine {
  public static buildEvidenceProfile(user: UserProfile, documents: DocumentItem[]): EvidenceItem[] {
    const items: EvidenceItem[] = [];
    const now = new Date().toISOString();

    // 1. Identity & Demographic Evidence
    const aadhaarDoc = documents.find(d => d.type === 'AADHAAR' && d.status === 'VERIFIED');
    if (aadhaarDoc && aadhaarDoc.extractedData) {
      items.push({
        id: 'ev-name',
        citizenId: user.id,
        key: 'fullName',
        label: 'Full Name',
        value: aadhaarDoc.extractedData.name || user.name,
        displayValue: aadhaarDoc.extractedData.name || user.name,
        sourceDocumentId: aadhaarDoc.id,
        sourceDocumentType: 'AADHAAR',
        confidence: aadhaarDoc.confidenceScore || 0.95,
        extractedAt: aadhaarDoc.uploadedAt || now,
        status: 'VERIFIED'
      });

      items.push({
        id: 'ev-aadhaar',
        citizenId: user.id,
        key: 'aadhaarPresent',
        label: 'Aadhaar Identification',
        value: true,
        displayValue: aadhaarDoc.maskedNumber || 'XXXX XXXX 4821',
        sourceDocumentId: aadhaarDoc.id,
        sourceDocumentType: 'AADHAAR',
        confidence: aadhaarDoc.confidenceScore || 0.96,
        extractedAt: aadhaarDoc.uploadedAt || now,
        status: 'VERIFIED'
      });

      if (aadhaarDoc.extractedData.dob) {
        const dobStr = aadhaarDoc.extractedData.dob;
        const dob = new Date(dobStr);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs);
        const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

        items.push({
          id: 'ev-dob',
          citizenId: user.id,
          key: 'dob',
          label: 'Date of Birth',
          value: dobStr,
          displayValue: dobStr,
          sourceDocumentId: aadhaarDoc.id,
          sourceDocumentType: 'AADHAAR',
          confidence: 0.98,
          extractedAt: aadhaarDoc.uploadedAt || now,
          status: 'VERIFIED'
        });

        items.push({
          id: 'ev-age',
          citizenId: user.id,
          key: 'age',
          label: 'Age',
          value: calculatedAge,
          displayValue: `${calculatedAge} Years`,
          sourceDocumentId: aadhaarDoc.id,
          sourceDocumentType: 'AADHAAR',
          confidence: 0.98,
          extractedAt: aadhaarDoc.uploadedAt || now,
          status: 'VERIFIED'
        });
      }
    } else {
      // Fallback from profile
      items.push({
        id: 'ev-name-profile',
        citizenId: user.id,
        key: 'fullName',
        label: 'Full Name',
        value: user.name,
        displayValue: user.name,
        sourceDocumentType: 'AADHAAR',
        confidence: 0.85,
        extractedAt: now,
        status: 'NEEDS_REVIEW'
      });
      items.push({
        id: 'ev-aadhaar-missing',
        citizenId: user.id,
        key: 'aadhaarPresent',
        label: 'Aadhaar Identification',
        value: false,
        displayValue: 'Not Provided',
        sourceDocumentType: 'AADHAAR',
        confidence: 0,
        extractedAt: now,
        status: 'CONFLICT'
      });
      items.push({
        id: 'ev-age-profile',
        citizenId: user.id,
        key: 'age',
        label: 'Age',
        value: 22,
        displayValue: '22 Years',
        sourceDocumentType: 'AADHAAR',
        confidence: 0.8,
        extractedAt: now,
        status: 'NEEDS_REVIEW'
      });
    }

    // 2. Financial / Income Evidence
    const incomeDoc = documents.find(d => d.type === 'INCOME_CERTIFICATE' && d.status === 'VERIFIED');
    if (incomeDoc && incomeDoc.extractedData) {
      const incomeVal = incomeDoc.extractedData.annualIncome || user.annualIncome || 180000;
      items.push({
        id: 'ev-income',
        citizenId: user.id,
        key: 'annualIncome',
        label: 'Annual Family Income',
        value: incomeVal,
        displayValue: `₹${Number(incomeVal).toLocaleString('en-IN')}`,
        sourceDocumentId: incomeDoc.id,
        sourceDocumentType: 'INCOME_CERTIFICATE',
        confidence: incomeDoc.confidenceScore || 0.94,
        extractedAt: incomeDoc.uploadedAt || now,
        status: 'VERIFIED',
        validUntil: incomeDoc.expiresAt
      });
    } else {
      items.push({
        id: 'ev-income-self',
        citizenId: user.id,
        key: 'annualIncome',
        label: 'Annual Family Income',
        value: user.annualIncome || 180000,
        displayValue: `₹${(user.annualIncome || 180000).toLocaleString('en-IN')} (Self-declared)`,
        sourceDocumentType: 'INCOME_CERTIFICATE',
        confidence: 0.75,
        extractedAt: now,
        status: 'NEEDS_REVIEW'
      });
    }

    // 3. Residential / Domicile Evidence
    const domicileDoc = documents.find(d => d.type === 'DOMICILE_CERTIFICATE');
    const isDomicileValid = domicileDoc ? (domicileDoc.status === 'VERIFIED' && (!domicileDoc.expiresAt || new Date(domicileDoc.expiresAt) > new Date())) : false;
    items.push({
      id: 'ev-domicile',
      citizenId: user.id,
      key: 'domicileValid',
      label: 'State Domicile Status',
      value: isDomicileValid,
      displayValue: isDomicileValid ? 'Valid Bihar Domicile' : (domicileDoc?.status === 'NEEDS_RENEWAL' || domicileDoc?.status === 'EXPIRED' ? 'Expired (Needs Renewal)' : 'Missing'),
      sourceDocumentId: domicileDoc?.id,
      sourceDocumentType: 'DOMICILE_CERTIFICATE',
      confidence: domicileDoc ? (domicileDoc.confidenceScore || 0.92) : 0,
      extractedAt: domicileDoc?.uploadedAt || now,
      status: isDomicileValid ? 'VERIFIED' : 'CONFLICT',
      validUntil: domicileDoc?.expiresAt
    });

    // 4. Academic Evidence
    const marksheetDoc = documents.find(d => d.type === 'MARKSHEET' && d.status === 'VERIFIED');
    if (marksheetDoc && marksheetDoc.extractedData) {
      items.push({
        id: 'ev-education',
        citizenId: user.id,
        key: 'educationLevel',
        label: 'Highest Qualification',
        value: 'Class 12th Passed',
        displayValue: 'Class 12th Passed (CBSE)',
        sourceDocumentId: marksheetDoc.id,
        sourceDocumentType: 'MARKSHEET',
        confidence: marksheetDoc.confidenceScore || 0.95,
        extractedAt: marksheetDoc.uploadedAt || now,
        status: 'VERIFIED'
      });

      items.push({
        id: 'ev-marks',
        citizenId: user.id,
        key: 'marksPercentage',
        label: '12th Aggregate Marks',
        value: marksheetDoc.extractedData.percentage || 84.2,
        displayValue: `${marksheetDoc.extractedData.percentage || 84.2}%`,
        sourceDocumentId: marksheetDoc.id,
        sourceDocumentType: 'MARKSHEET',
        confidence: marksheetDoc.confidenceScore || 0.95,
        extractedAt: marksheetDoc.uploadedAt || now,
        status: 'VERIFIED'
      });
    } else {
      items.push({
        id: 'ev-education-profile',
        citizenId: user.id,
        key: 'educationLevel',
        label: 'Highest Qualification',
        value: user.education || 'Class 12th Passed',
        displayValue: user.education || 'Class 12th Passed',
        sourceDocumentType: 'MARKSHEET',
        confidence: 0.8,
        extractedAt: now,
        status: 'NEEDS_REVIEW'
      });
      items.push({
        id: 'ev-marks-profile',
        citizenId: user.id,
        key: 'marksPercentage',
        label: 'Academic Percentage',
        value: 80,
        displayValue: '80%',
        sourceDocumentType: 'MARKSHEET',
        confidence: 0.75,
        extractedAt: now,
        status: 'NEEDS_REVIEW'
      });
    }

    // 5. Category / Caste Evidence
    const casteDoc = documents.find(d => d.type === 'CASTE_CERTIFICATE' && d.status === 'VERIFIED');
    items.push({
      id: 'ev-category',
      citizenId: user.id,
      key: 'category',
      label: 'Social Category',
      value: casteDoc ? (casteDoc.extractedData?.category || user.category || 'OBC') : (user.category || 'OBC'),
      displayValue: casteDoc ? `${casteDoc.extractedData?.category || user.category} (Verified)` : `${user.category || 'OBC'} (Unverified / Doc Missing)`,
      sourceDocumentId: casteDoc?.id,
      sourceDocumentType: 'CASTE_CERTIFICATE',
      confidence: casteDoc ? (casteDoc.confidenceScore || 0.95) : 0.6,
      extractedAt: casteDoc?.uploadedAt || now,
      status: casteDoc ? 'VERIFIED' : 'NEEDS_REVIEW'
    });

    // 6. Student & Farmer Status
    items.push({
      id: 'ev-student',
      citizenId: user.id,
      key: 'isStudent',
      label: 'Student Status',
      value: user.isStudent ?? true,
      displayValue: user.isStudent ? 'Enrolled Student' : 'Not a Student',
      sourceDocumentType: 'MARKSHEET',
      confidence: 0.9,
      extractedAt: now,
      status: 'VERIFIED'
    });

    items.push({
      id: 'ev-farmer',
      citizenId: user.id,
      key: 'isFarmer',
      label: 'Farmer Status',
      value: user.isFarmer ?? false,
      displayValue: user.isFarmer ? 'Registered Farmer' : 'Non-Farmer',
      sourceDocumentType: 'LAND_RECORD',
      confidence: 0.9,
      extractedAt: now,
      status: 'VERIFIED'
    });

    return items;
  }
}
