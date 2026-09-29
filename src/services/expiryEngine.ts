import { DocumentItem } from '../types';

export class ExpiryEngine {
  public static evaluateDocumentExpiry(doc: DocumentItem): {
    status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
    daysRemaining?: number;
    statusText: string;
  } {
    if (!doc.expiresAt) {
      return {
        status: 'ACTIVE',
        statusText: 'No Expiry (Lifetime)'
      };
    }

    const expiryDate = new Date(doc.expiresAt);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'EXPIRED',
        daysRemaining: diffDays,
        statusText: `Expired on ${expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
      };
    } else if (diffDays <= 60) {
      return {
        status: 'EXPIRING_SOON',
        daysRemaining: diffDays,
        statusText: `Expiring Soon in ${diffDays} days`
      };
    } else {
      return {
        status: 'ACTIVE',
        daysRemaining: diffDays,
        statusText: `Valid until ${expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
      };
    }
  }

  public static syncDocumentStatuses(documents: DocumentItem[]): DocumentItem[] {
    return documents.map(doc => {
      if (doc.status === 'MISSING') return doc;
      const expiry = this.evaluateDocumentExpiry(doc);
      if (expiry.status === 'EXPIRED') {
        return {
          ...doc,
          status: 'NEEDS_RENEWAL',
          notes: doc.notes || expiry.statusText
        };
      }
      return doc;
    });
  }
}
