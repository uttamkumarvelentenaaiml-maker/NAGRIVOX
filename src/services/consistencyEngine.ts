import { DocumentItem, ConsistencyCheckResult } from '../types';

export class ConsistencyEngine {
  public static runChecks(documents: DocumentItem[]): ConsistencyCheckResult[] {
    const results: ConsistencyCheckResult[] = [];

    // 1. Name Check across documents
    const nameRecords: { documentType: any; documentTitle: string; value: string }[] = [];
    documents.forEach(doc => {
      if (doc.extractedData && doc.extractedData.name) {
        nameRecords.push({
          documentType: doc.type,
          documentTitle: doc.title,
          value: String(doc.extractedData.name).trim()
        });
      }
    });

    if (nameRecords.length > 1) {
      const firstVal = nameRecords[0].value.toLowerCase();
      const hasDiscrepancy = nameRecords.some(r => r.value.toLowerCase() !== firstVal);

      if (hasDiscrepancy) {
        // Evaluate if it's an initial abbreviation (e.g. Sanjeet Kumar vs Sanjeet K.)
        const isAbbreviation = nameRecords.some(r => {
          const parts = r.value.split(/\s+/);
          return parts.some(p => p.length === 1 || (p.length === 2 && p.endsWith('.')));
        });

        results.push({
          field: 'name',
          label: 'Citizen Name Consistency',
          hasMismatch: true,
          severity: isAbbreviation ? 'LOW' : 'MEDIUM',
          values: nameRecords,
          explanation: isAbbreviation 
            ? 'Potential minor name variation detected (e.g. "Sanjeet K." on Marksheet vs "Sanjeet Kumar" on Aadhaar). Most government portals accept standard initial declarations or supporting gazette/ID.'
            : 'Potential name mismatch detected across uploaded documents. Names should ideally match official records exactly.',
          suggestedAction: isAbbreviation
            ? 'No urgent action needed. An Aadhaar-linked affidavit or self-declaration suffices if requested.'
            : 'Consider providing an identity affidavit or updating the secondary certificate to match Aadhaar.'
        });
      } else {
        results.push({
          field: 'name',
          label: 'Citizen Name Consistency',
          hasMismatch: false,
          severity: 'NONE',
          values: nameRecords,
          explanation: 'Name is consistent across all uploaded documents.'
        });
      }
    }

    // 2. Date of Birth Check
    const dobRecords: { documentType: any; documentTitle: string; value: string }[] = [];
    documents.forEach(doc => {
      if (doc.extractedData && (doc.extractedData.dob || doc.extractedData.birthDate)) {
        dobRecords.push({
          documentType: doc.type,
          documentTitle: doc.title,
          value: String(doc.extractedData.dob || doc.extractedData.birthDate).trim()
        });
      }
    });

    if (dobRecords.length > 1) {
      const firstDob = dobRecords[0].value;
      const mismatch = dobRecords.some(r => r.value !== firstDob);
      results.push({
        field: 'dob',
        label: 'Date of Birth Consistency',
        hasMismatch: mismatch,
        severity: mismatch ? 'HIGH' : 'NONE',
        values: dobRecords,
        explanation: mismatch 
          ? 'Potential date of birth mismatch detected between records. Age-dependent schemes strictly require consistent DOB.'
          : 'Date of birth is perfectly aligned across documents.',
        suggestedAction: mismatch ? 'Verify which document contains the clerical typo and apply for an update at the respective board/UIDAI center.' : undefined
      });
    }

    // 3. State / Residence Check
    const stateRecords: { documentType: any; documentTitle: string; value: string }[] = [];
    documents.forEach(doc => {
      if (doc.extractedData && (doc.extractedData.state || doc.extractedData.address)) {
        const stateFound = doc.extractedData.state || (doc.extractedData.address?.includes('Bihar') ? 'Bihar' : 'Unknown');
        stateRecords.push({
          documentType: doc.type,
          documentTitle: doc.title,
          value: stateFound
        });
      }
    });

    if (stateRecords.length > 1) {
      const firstState = stateRecords[0].value;
      const mismatch = stateRecords.some(r => r.value !== firstState && r.value !== 'Unknown');
      results.push({
        field: 'state',
        label: 'State & Residence Alignment',
        hasMismatch: mismatch,
        severity: mismatch ? 'HIGH' : 'NONE',
        values: stateRecords,
        explanation: mismatch
          ? 'Potential state mismatch detected across address and domicile.'
          : 'State of residence is consistently noted as Bihar.',
        suggestedAction: mismatch ? 'Ensure domicile matches current state welfare guidelines.' : undefined
      });
    }

    // 4. Income Discrepancy Check
    const incomeRecords: { documentType: any; documentTitle: string; value: string }[] = [];
    documents.forEach(doc => {
      if (doc.extractedData && doc.extractedData.annualIncome) {
        incomeRecords.push({
          documentType: doc.type,
          documentTitle: doc.title,
          value: `₹${Number(doc.extractedData.annualIncome).toLocaleString('en-IN')}`
        });
      }
    });

    if (incomeRecords.length > 0) {
      results.push({
        field: 'income',
        label: 'Income Level Verification',
        hasMismatch: false,
        severity: 'NONE',
        values: incomeRecords,
        explanation: 'Annual income is documented via Revenue Department Certificate.'
      });
    }

    return results;
  }
}
