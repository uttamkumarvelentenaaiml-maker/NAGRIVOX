import { 
  UserProfile, 
  DocumentItem, 
  CitizenApplication, 
  NotificationItem, 
  AuditLog
} from '../types';

export class ApiClient {
  private static baseUrl = '/api/v1';

  public static async getProfile(): Promise<UserProfile> {
    try {
      const res = await fetch(`${this.baseUrl}/profile`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, falling back:', e);
    }
    const { DEMO_USER } = await import('../data/mockData');
    return DEMO_USER;
  }

  public static async getDocuments(): Promise<DocumentItem[]> {
    try {
      const res = await fetch(`${this.baseUrl}/documents`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, falling back:', e);
    }
    const { INITIAL_DOCUMENTS } = await import('../data/mockData');
    return INITIAL_DOCUMENTS;
  }

  public static async uploadDocument(formData: FormData): Promise<DocumentItem> {
    const res = await fetch(`${this.baseUrl}/documents/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      throw new Error('Failed to upload document');
    }
    return await res.json();
  }

  public static async renewDocument(docId: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/documents/${docId}/renew`, {
      method: 'POST'
    });
    if (!res.ok) {
      throw new Error('Failed to renew document');
    }
    return await res.json();
  }

  public static async deleteDocument(docId: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/documents/${docId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Failed to delete document');
    }
    return await res.json();
  }

  public static async getApplications(): Promise<CitizenApplication[]> {
    try {
      const res = await fetch(`${this.baseUrl}/applications`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, falling back:', e);
    }
    const { INITIAL_APPLICATIONS } = await import('../data/mockData');
    return INITIAL_APPLICATIONS;
  }

  public static async createApplication(payload: Partial<CitizenApplication>): Promise<CitizenApplication> {
    const res = await fetch(`${this.baseUrl}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('Failed to create application');
    }
    return await res.json();
  }

  public static async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${this.baseUrl}/notifications`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, falling back:', e);
    }
    const { INITIAL_NOTIFICATIONS } = await import('../data/mockData');
    return INITIAL_NOTIFICATIONS;
  }

  public static async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/notifications/${id}/read`, { method: 'PATCH' });
    } catch (e) {
      console.warn(e);
    }
  }

  public static async markAllNotificationsRead(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/notifications/mark-all-read`, { method: 'POST' });
    } catch (e) {
      console.warn(e);
    }
  }

  public static async sendChatMessage(message: string, language: string = 'en'): Promise<{ reply: string; citations?: any[] }> {
    const res = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language })
    });
    if (!res.ok) {
      throw new Error('Chat service temporarily unavailable');
    }
    return await res.json();
  }

  public static async getAdminStats(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/admin/stats`);
    if (res.ok) return await res.json();
    return {
      totalCitizens: 12450,
      documentsProcessed: 48920,
      totalServices: 42,
      activeApplications: 8430,
      averageReadiness: 72
    };
  }

  public static async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${this.baseUrl}/admin/audit-logs`);
    if (res.ok) return await res.json();
    const { INITIAL_AUDIT_LOGS } = await import('../data/mockData');
    return INITIAL_AUDIT_LOGS;
  }
}
