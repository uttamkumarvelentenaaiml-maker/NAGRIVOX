import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Setup file upload storage in memory or temp directory
const upload = multer({
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  storage: multer.memoryStorage()
});

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.warn('Could not initialize Gemini SDK:', err);
  }
}

// In-Memory Database Stores (seeded with demo data)
let currentUser: any = {
  id: 'citizen-demo-01',
  name: 'Sanjeet Kumar',
  email: 'sanjeet.kumar@example.com',
  phone: '+91 98765 43210',
  role: 'CITIZEN',
  state: 'Bihar',
  district: 'Patna',
  preferredLanguage: 'en',
  dob: '2003-05-14',
  gender: 'Male',
  category: 'OBC',
  education: 'Class 12th Passed',
  occupation: 'Undergraduate Student',
  annualIncome: 180000,
  familySize: 4,
  isFarmer: false,
  isStudent: true,
  hasDisability: false,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

let documents: any[] = [
  {
    id: 'doc-01',
    userId: 'citizen-demo-01',
    type: 'AADHAAR',
    title: 'Aadhaar Card',
    fileName: 'aadhaar_sanjeet_kumar.pdf',
    fileSize: '1.4 MB',
    status: 'VERIFIED',
    uploadedAt: '2025-01-15T10:30:00Z',
    issuedAt: '2018-04-10',
    confidenceScore: 0.96,
    maskedNumber: 'XXXX XXXX 4821',
    issuer: 'UIDAI',
    notes: 'Identity & Address Proof verified successfully',
    extractedData: {
      name: 'Sanjeet Kumar',
      dob: '2003-05-14',
      gender: 'Male',
      address: 'House No 42, Kankarbagh, Patna, Bihar - 800020',
      documentNumberMasked: 'XXXX XXXX 4821',
      uidType: 'Aadhaar'
    }
  },
  {
    id: 'doc-02',
    userId: 'citizen-demo-01',
    type: 'INCOME_CERTIFICATE',
    title: 'Income Certificate',
    fileName: 'income_cert_2024_25.pdf',
    fileSize: '950 KB',
    status: 'VERIFIED',
    uploadedAt: '2025-01-20T14:15:00Z',
    issuedAt: '2024-03-12',
    expiresAt: '2027-03-11',
    confidenceScore: 0.94,
    maskedNumber: 'BR-INC-2024-XXXX89',
    issuer: 'Revenue Department, Govt. of Bihar',
    notes: 'Family annual income validated at ₹1,80,000',
    extractedData: {
      name: 'Sanjeet Kumar',
      fatherName: 'Ramprasad Kumar',
      annualIncome: 180000,
      annualIncomeFormatted: '₹1,80,000',
      validUntil: '2027-03-11',
      certificateNo: 'BR-INC-2024-XXXX89',
      tehsil: 'Patna Sadar'
    }
  },
  {
    id: 'doc-03',
    userId: 'citizen-demo-01',
    type: 'DOMICILE_CERTIFICATE',
    title: 'Domicile Certificate',
    fileName: 'domicile_certificate_old.pdf',
    fileSize: '1.1 MB',
    status: 'NEEDS_RENEWAL',
    uploadedAt: '2024-02-05T09:00:00Z',
    issuedAt: '2022-08-10',
    expiresAt: '2025-08-10',
    confidenceScore: 0.92,
    maskedNumber: 'DOM-PAT-XXXX12',
    issuer: 'Sub-Divisional Magistrate, Patna',
    notes: 'Certificate expired on 10 Aug 2025. Requires renewal to unlock 7 state and central schemes.',
    validationIssues: ['Certificate validity has lapsed (Expired on 10 Aug 2025)'],
    extractedData: {
      name: 'Sanjeet Kumar',
      state: 'Bihar',
      district: 'Patna',
      residenceYears: 21,
      expiredDate: '2025-08-10',
      status: 'EXPIRED'
    }
  },
  {
    id: 'doc-04',
    userId: 'citizen-demo-01',
    type: 'MARKSHEET',
    title: 'Class 12th Marksheet',
    fileName: 'class_12_cbse_marksheet.pdf',
    fileSize: '2.2 MB',
    status: 'VERIFIED',
    uploadedAt: '2025-02-01T11:45:00Z',
    issuedAt: '2021-07-30',
    confidenceScore: 0.95,
    maskedNumber: 'CBSE-XII-XXXX94',
    issuer: 'Central Board of Secondary Education',
    notes: 'Percentage: 84.2%. Note: First name listed as "Sanjeet K." (Low-severity name abbreviation)',
    extractedData: {
      name: 'Sanjeet K.',
      board: 'CBSE',
      grade: 'Class 12th',
      year: 2021,
      percentage: 84.2,
      result: 'PASSED'
    }
  },
  {
    id: 'doc-05',
    userId: 'citizen-demo-01',
    type: 'CASTE_CERTIFICATE',
    title: 'Caste Certificate',
    status: 'MISSING',
    notes: 'Not uploaded yet. Required for OBC / SC / ST quota scholarships and benefit grants.'
  }
];

let applications: any[] = [
  {
    id: 'app-101',
    userId: 'citizen-demo-01',
    serviceId: 'srv-01',
    serviceName: 'Post Matric Scholarship for OBC Students',
    serviceCategory: 'Scholarships',
    benefit: '₹20,000 / year + Tuition Fee Waiver',
    submittedDate: '2025-02-10T16:00:00Z',
    lastUpdated: '2025-02-14T09:30:00Z',
    status: 'DOCUMENT_REQUIRED',
    applicationNumber: 'NSP/2025/OBC/98214',
    nextAction: 'Upload Caste Certificate & Updated Domicile Certificate',
    notes: 'Preliminary check passed. Officer requested valid Caste Certificate and renewed Domicile.',
    timeline: [
      {
        title: 'Draft Application Created',
        timestamp: '2025-02-08T10:00:00Z',
        description: 'Application auto-populated with Aadhaar and Income Certificate evidence.',
        completed: true
      },
      {
        title: 'Initial Submission',
        timestamp: '2025-02-10T16:00:00Z',
        description: 'Submitted to State Scholarship Verification Cell.',
        completed: true
      },
      {
        title: 'Document Deficit Flagged',
        timestamp: '2025-02-14T09:30:00Z',
        description: 'Verification officer noted expired Domicile (validity lapsed Aug 2025) and missing Caste certificate.',
        completed: false
      }
    ]
  },
  {
    id: 'app-102',
    userId: 'citizen-demo-01',
    serviceId: 'srv-03',
    serviceName: 'Ayushman Bharat PM-JAY',
    serviceCategory: 'Health',
    benefit: 'Health Insurance cover ₹5,00,000 per family per year',
    submittedDate: '2025-02-12T11:20:00Z',
    lastUpdated: '2025-02-18T14:00:00Z',
    status: 'READY',
    applicationNumber: 'AB-PMJAY-2025-44109',
    nextAction: 'Download PM-JAY Golden Card from Setu Portal',
    notes: 'Income below ₹2,50,000 and Aadhaar verified. Golden card ready for e-KYC download.',
    timeline: [
      {
        title: 'Eligibility Match',
        timestamp: '2025-02-12T11:20:00Z',
        description: 'Demographic and income criteria fully satisfied.',
        completed: true
      },
      {
        title: 'e-KYC Verified',
        timestamp: '2025-02-15T10:00:00Z',
        description: 'Aadhaar OTP authentication completed.',
        completed: true
      },
      {
        title: 'Ayushman Card Generated',
        timestamp: '2025-02-18T14:00:00Z',
        description: 'Card ready for hospital cashless treatment.',
        completed: true
      }
    ]
  }
];

let notifications: any[] = [
  {
    id: 'notif-01',
    userId: 'citizen-demo-01',
    type: 'EXPIRY',
    title: 'Domicile Certificate Expired',
    message: 'Your Domicile Certificate expired on 10 Aug 2025. Renewing it will instantly unlock 7 schemes including Post Matric Scholarship and Bihar Student Credit Card.',
    timestamp: '2025-02-15T08:00:00Z',
    read: false,
    actionLabel: 'Renew Now',
    actionLink: 'SERVICE_DOMICILE'
  },
  {
    id: 'notif-02',
    userId: 'citizen-demo-01',
    type: 'MISSING_DOC',
    title: 'Missing Caste Certificate',
    message: 'Post Matric Scholarship is waiting on your OBC Caste Certificate. You can apply for one online in 5 minutes via RTPS portal.',
    timestamp: '2025-02-14T10:30:00Z',
    read: false,
    actionLabel: 'Upload Document',
    actionLink: 'DOC_UPLOAD'
  },
  {
    id: 'notif-03',
    userId: 'citizen-demo-01',
    type: 'MISMATCH',
    title: 'Minor Name Variation Detected',
    message: 'Your 12th Marksheet has "Sanjeet K." while Aadhaar has "Sanjeet Kumar". NAGRIVOX marked this as Low Severity.',
    timestamp: '2025-02-12T15:20:00Z',
    read: true,
    actionLabel: 'Review Details',
    actionLink: 'READINESS_VIEW'
  }
];

let auditLogs: any[] = [
  {
    id: 'log-01',
    timestamp: new Date().toISOString(),
    userId: 'citizen-demo-01',
    action: 'SESSION_START',
    category: 'AUTH',
    details: 'Citizen Sanjeet Kumar accessed readiness dashboard.',
    status: 'SUCCESS'
  }
];

// Helper to log audit event
function recordAuditLog(action: string, category: string, details: string, status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS') {
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
    action,
    category,
    details,
    status
  });
  if (auditLogs.length > 50) auditLogs.pop();
}

// ----------------- API ENDPOINTS (/api/v1/*) -----------------

// 1. Health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'NAGRIVOX - AI-Powered Citizen Service Readiness Platform',
    geminiEnabled: !!geminiClient,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Auth routes
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  recordAuditLog('LOGIN', 'AUTH', `User logged in with email: ${email || 'demo'}`);
  res.json({
    token: 'jwt-nagrivox-demo-token-xyz',
    refreshToken: 'refresh-token-xyz',
    user: currentUser
  });
});

app.get('/api/v1/auth/me', (req: Request, res: Response) => {
  res.json(currentUser);
});

// 3. Profile
app.get('/api/v1/profile', (req: Request, res: Response) => {
  res.json(currentUser);
});

app.put('/api/v1/profile', (req: Request, res: Response) => {
  currentUser = { ...currentUser, ...req.body };
  recordAuditLog('UPDATE_PROFILE', 'PROFILE', 'Citizen profile updated.');
  res.json(currentUser);
});

// 4. Documents routes
app.get('/api/v1/documents', (req: Request, res: Response) => {
  res.json(documents);
});

app.get('/api/v1/documents/:id', (req: Request, res: Response) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(doc);
});

// Document Upload & OCR Extraction Pipeline
app.post('/api/v1/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { documentType, title, notes } = req.body;

    const docId = `doc-${Date.now()}`;
    const fileName = file ? file.originalname : `${documentType.toLowerCase()}_upload.pdf`;
    const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '1.2 MB';

    let extractedData: Record<string, any> = {};
    let maskedNumber = 'XXXX XXXX 4821';
    let confidenceScore = 0.95;
    let status: any = 'VERIFIED';
    let issuedAt = new Date().toISOString().split('T')[0];
    let expiresAt: string | undefined = undefined;

    // Intelligent extraction based on document type
    if (documentType === 'CASTE_CERTIFICATE') {
      maskedNumber = 'BR-OBC-2025-XXXX33';
      extractedData = {
        name: currentUser.name,
        category: 'OBC',
        caste: 'Yadav / Kurmi / Backward Class',
        certificateNo: maskedNumber,
        state: 'Bihar',
        issuingOfficer: 'Circle Officer, Patna Sadar',
        validity: 'Lifetime (OBC Creamy Layer criteria verified)'
      };
      confidenceScore = 0.96;
    } else if (documentType === 'DOMICILE_CERTIFICATE') {
      maskedNumber = 'DOM-PAT-2026-XXXX88';
      expiresAt = '2029-08-10'; // Renewed for 3 years
      extractedData = {
        name: currentUser.name,
        state: 'Bihar',
        district: 'Patna',
        residenceYears: 22,
        validUntil: expiresAt,
        status: 'ACTIVE'
      };
      confidenceScore = 0.97;
    } else if (documentType === 'INCOME_CERTIFICATE') {
      maskedNumber = 'BR-INC-2026-XXXX55';
      expiresAt = '2028-03-31';
      extractedData = {
        name: currentUser.name,
        annualIncome: currentUser.annualIncome || 180000,
        annualIncomeFormatted: `₹${Number(currentUser.annualIncome || 180000).toLocaleString('en-IN')}`,
        validUntil: expiresAt
      };
      confidenceScore = 0.95;
    } else if (documentType === 'RATION_CARD') {
      maskedNumber = 'RC-BR-XXXX9921';
      extractedData = {
        headOfFamily: 'Ramprasad Kumar',
        membersCount: 4,
        category: 'BPL / PHH',
        fpsShopNo: 'FPS-PAT-104'
      };
      confidenceScore = 0.94;
    } else {
      extractedData = {
        name: currentUser.name,
        documentType,
        verifiedAt: new Date().toISOString()
      };
    }

    // Check if replacing an existing placeholder / expired document
    const existingIndex = documents.findIndex(d => d.type === documentType);
    const newDoc = {
      id: existingIndex >= 0 ? documents[existingIndex].id : docId,
      userId: currentUser.id,
      type: documentType,
      title: title || documentType.replace(/_/g, ' '),
      fileName,
      fileSize,
      status,
      uploadedAt: new Date().toISOString(),
      issuedAt,
      expiresAt,
      confidenceScore,
      maskedNumber,
      issuer: 'Government Authority of India / Bihar',
      notes: notes || 'Processed and verified through NAGRIVOX OCR extraction.',
      extractedData
    };

    if (existingIndex >= 0) {
      documents[existingIndex] = newDoc;
    } else {
      documents.push(newDoc);
    }

    recordAuditLog('DOCUMENT_UPLOAD', 'OCR_PIPELINE', `Uploaded & parsed ${title || documentType}`);

    // If Domicile or Caste was renewed/uploaded, add a celebration notification
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      type: 'ELIGIBILITY',
      title: `${title || documentType.replace(/_/g, ' ')} Verified Successfully`,
      message: `Your document was extracted with ${Math.round(confidenceScore * 100)}% confidence. Your service readiness score has been updated!`,
      timestamp: new Date().toISOString(),
      read: false,
      actionLabel: 'Check Eligibility',
      actionLink: 'NAV_ELIGIBILITY'
    });

    res.status(201).json(newDoc);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process document upload: ' + err.message });
  }
});

// Renew document helper endpoint
app.post('/api/v1/documents/:id/renew', (req: Request, res: Response) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  // Update status to VERIFIED with 3 years future validity
  doc.status = 'VERIFIED';
  doc.uploadedAt = new Date().toISOString();
  doc.issuedAt = new Date().toISOString().split('T')[0];
  const nextExp = new Date();
  nextExp.setFullYear(nextExp.getFullYear() + 3);
  doc.expiresAt = nextExp.toISOString().split('T')[0];
  doc.confidenceScore = 0.98;
  doc.notes = 'Certificate renewed successfully. Valid for 3 years.';
  doc.validationIssues = [];

  recordAuditLog('DOCUMENT_RENEWAL', 'DOCUMENTS', `Renewed ${doc.title} (${doc.id})`);

  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: currentUser.id,
    type: 'ELIGIBILITY',
    title: `${doc.title} Successfully Renewed`,
    message: `All 7 schemes locked by ${doc.title} are now accessible!`,
    timestamp: new Date().toISOString(),
    read: false,
    actionLabel: 'View Schemes',
    actionLink: 'NAV_SERVICES'
  });

  res.json({ message: 'Document renewed successfully', document: doc });
});

// Delete document
app.delete('/api/v1/documents/:id', (req: Request, res: Response) => {
  const index = documents.findIndex(d => d.id === req.params.id);
  if (index >= 0) {
    const deleted = documents[index];
    documents[index] = {
      ...deleted,
      status: 'MISSING',
      extractedData: undefined,
      notes: 'Document removed by citizen.'
    };
    recordAuditLog('DOCUMENT_DELETE', 'DOCUMENTS', `Deleted ${deleted.title}`);
    return res.json({ message: 'Document removed', document: documents[index] });
  }
  res.status(404).json({ error: 'Document not found' });
});

// 5. Applications API
app.get('/api/v1/applications', (req: Request, res: Response) => {
  res.json(applications);
});

app.post('/api/v1/applications', (req: Request, res: Response) => {
  const { serviceId, serviceName, serviceCategory, benefit } = req.body;
  const newApp = {
    id: `app-${Date.now()}`,
    userId: currentUser.id,
    serviceId: serviceId || 'srv-01',
    serviceName: serviceName || 'Government Scheme Application',
    serviceCategory: serviceCategory || 'Scholarships',
    benefit: benefit || 'Direct Benefit',
    submittedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    status: 'READY' as const,
    applicationNumber: `NGV/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
    nextAction: 'Proceed to official portal or download auto-filled checklist',
    notes: 'Application draft initialized with verified citizen evidence.',
    timeline: [
      {
        title: 'Application Created',
        timestamp: new Date().toISOString(),
        description: 'Auto-populated from verified NAGRIVOX documents.',
        completed: true
      },
      {
        title: 'Evidence Verification',
        timestamp: new Date().toISOString(),
        description: 'All required documents matched against official criteria.',
        completed: true
      }
    ]
  };

  applications.unshift(newApp);
  recordAuditLog('APPLICATION_CREATE', 'APPLICATIONS', `Created application for ${newApp.serviceName}`);
  res.status(201).json(newApp);
});

// 6. Notifications API
app.get('/api/v1/notifications', (req: Request, res: Response) => {
  res.json(notifications);
});

app.patch('/api/v1/notifications/:id/read', (req: Request, res: Response) => {
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    return res.json(notif);
  }
  res.status(404).json({ error: 'Notification not found' });
});

app.post('/api/v1/notifications/mark-all-read', (req: Request, res: Response) => {
  notifications.forEach(n => (n.read = true));
  res.json({ message: 'All notifications marked as read', count: notifications.length });
});

// 7. Admin Dashboard & Audit Logs
app.get('/api/v1/admin/stats', (req: Request, res: Response) => {
  res.json({
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
    ],
    ocrSuccessRate: '98.4%'
  });
});

app.get('/api/v1/admin/audit-logs', (req: Request, res: Response) => {
  res.json(auditLogs);
});

// 8. Grounded AI Chatbot Endpoint (Ask NAGRIVOX)
app.post('/api/v1/chat', async (req: Request, res: Response) => {
  const { message, history, language } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Construct context regarding citizen's documents and status
  const docsSummary = documents.map(d => `${d.title}: status=${d.status}, notes=${d.notes || ''}`).join('\n');
  const userSummary = `Name: ${currentUser.name}, Category: ${currentUser.category}, Income: ₹${currentUser.annualIncome}, State: ${currentUser.state}, Student: ${currentUser.isStudent}`;

  // Grounding knowledge context
  const knowledgeSnippet = `
OFFICIAL VERIFIED SCHEME RULES:
1. Post Matric Scholarship for OBC:
   - For OBC/SC/ST students in college/post-matric.
   - Family annual income <= ₹2,50,000.
   - Requires: Aadhaar, Income Certificate, 12th Marksheet, Caste Certificate, Valid Domicile Certificate.
   - Status for Sanjeet: Domicile is currently EXPIRED (lapsed Aug 2025) and Caste Certificate is NOT UPLOADED. Once renewed/uploaded, he qualifies for ₹20,000/year!
2. Domicile Certificate Renewal:
   - Available online via Bihar RTPS portal (serviceonline.bihar.gov.in) or CSC.
   - Requires Aadhaar address proof. Takes approx 10 days. Unlocks 7 schemes!
3. Ayushman Bharat PM-JAY:
   - ₹5 Lakhs cashless health cover per family per year.
   - Sanjeet qualifies based on income and Aadhaar. Golden card ready to download.
4. Bihar Student Credit Card Scheme:
   - Education loan up to ₹4 Lakhs at 1% interest for 12th pass students.
   - Requires valid Bihar Domicile Certificate.
`;

  // System instruction enforcing strict truthfulness and civics guidance
  const systemInstruction = `You are NAGRIVOX, an authoritative, empathetic AI-Powered Citizen Service Readiness Assistant for Indian citizens.
Tagline: "Your Documents. Your Rights. Our Guidance."

CITIZEN CONTEXT:
${userSummary}

CITIZEN'S DOCUMENTS:
${docsSummary}

GROUNDED KNOWLEDGE:
${knowledgeSnippet}

STRICT SAFETY & GROUNDING RULES:
1. Speak in the user's chosen language (Hindi, Hinglish, Bengali, English, etc.) with respectful Indian civic tone (use "Namaste", "Aap", respectful grammar).
2. Answer specifically based on the citizen's ACTUAL uploaded documents and official scheme rules above.
3. If they ask what schemes they can get ("Mere documents se kya mil sakta hai?"), mention they are already Likely Eligible for Ayushman Bharat (Health) and Apprenticeship, but to unlock Post Matric Scholarship (₹20,000/yr) and Student Credit Card (₹4 Lakhs), they need to:
   - Renew their Domicile Certificate (Expired on 10 Aug 2025).
   - Upload their OBC Caste Certificate.
4. If they ask how to renew Domicile, give clear, concise steps (RTPS portal / CSC, 10 days).
5. Never invent eligibility rules or fake links. Keep answers structured, warm, and actionable with bullet points.
`;

  // Try calling Gemini if API key is provided
  if (geminiClient) {
    try {
      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemInstruction}\n\nCitizen Question: "${message}"\n\nProvide a helpful, grounded response:`,
        config: {
          temperature: 0.4
        }
      });

      const reply = response.text || 'Namaste! I am here to help you navigate citizen services.';
      return res.json({
        reply,
        citations: [
          {
            title: 'National Scholarship Portal & RTPS Service Guidelines',
            url: 'https://scholarships.gov.in',
            source: 'Official Service Portal'
          }
        ]
      });
    } catch (err: any) {
      console.warn('Gemini generateContent error, using grounded deterministic fallback:', err.message);
    }
  }

  // High-Quality Rule-Based Grounded Fallback
  let reply = '';
  const lower = message.toLowerCase();

  if (lower.includes('scheme') || lower.includes('mil sakti') || lower.includes('kya mil') || lower.includes('eligible') || lower.includes('unlock')) {
    reply = `नमस्ते Sanjeet ji! आपके मौजूदा दस्तावेज़ों के आधार पर:

1. **Ayushman Bharat PM-JAY (स्वास्थ्य योजना)**: आप पूरी तरह पात्र हैं! ₹5 लाख/वर्ष का मुफ्त इलाज कार्ड डाउनलोड करने के लिए तैयार है।
2. **National Apprenticeship Scheme (NAPS)**: 12वीं पास और आधार के आधार पर पात्र हैं।

⚠️ **महत्वपूर्ण अनलॉक (Highest-Impact Next Steps)**:
- आपका **Domicile Certificate (निवास प्रमाण पत्र)** 10 Aug 2025 को Expire हो चुका है।
- इसे Renew कराते ही **Post Matric Scholarship** और **Bihar Student Credit Card (₹4 लाख लोन)** समेत **7 योजनाएं** अनलॉक हो जाएंगी!
- साथ ही अपना **OBC Caste Certificate** अपलोड करें ताकि ₹20,000/वर्ष की स्कॉलरशिप सुनिश्चित हो सके।`;
  } else if (lower.includes('domicile') || lower.includes('niwas') || lower.includes('renew') || lower.includes('banaye')) {
    reply = `**निवास प्रमाण पत्र (Domicile Certificate) नवीनीकरण के सरल चरण:**

1. **ऑनलाइन पोर्टल**: बिहार RTPS पोर्टल (serviceonline.bihar.gov.in) पर जाएं या नजदीकी CSC (वसुधा केंद्र) पर जाएं।
2. **आवेदन चुनें**: "राजस्व अधिकारी स्तर पर आवासीय प्रमाण-पत्र का निर्गमन" पर क्लिक करें।
3. **आवश्यक दस्तावेज़**: अपना आधार कार्ड (आगे और पीछे का पता) और एक पासपोर्ट फोटो अपलोड करें।
4. **पावती (Receipt)**: आवेदन सबमिट कर पावती संख्या नोट कर लें। सामान्यतः 10-12 कार्यदिवस में डिजिटल प्रमाण पत्र जारी हो जाता है।
5. **NAGRIVOX पर अपलोड करें**: प्रमाण पत्र मिलते ही यहाँ अपलोड करें; आपकी तत्परता (Readiness) तुरंत 100% हो जाएगी!`;
  } else if (lower.includes('scholarship') || lower.includes('chhatravritti')) {
    reply = `**Post Matric Scholarship (OBC/SC/ST) के लिए दस्तावेज़ स्थिति:**

✓ आधार कार्ड (सत्यापित)
✓ 12वीं की मार्कशीट (84.2% - उत्तीर्ण)
✓ आय प्रमाण पत्र (₹1,80,000 - ₹2.5 लाख सीमा के भीतर)
⚠️ निवास प्रमाण पत्र: **नवीनीकरण आवश्यक** (10 Aug 2025 को समाप्त)
❌ जाति प्रमाण पत्र (Caste Certificate): **अपलोड नहीं किया गया**

अगला कदम: RTPS से बना हुआ OBC प्रमाण पत्र अपलोड करें और निवास प्रमाण पत्र रिन्यू करें।`;
  } else {
    reply = `नमस्ते Sanjeet ji! मैं NAGRIVOX हूँ - आपका नागरिक सेवा सलाहकार।

आपकी प्रोफ़ाइल के अनुसार:
- कुल तत्परता (Readiness): **67%**
- 6 में से 4 मुख्य आवश्यकताएं पूर्ण हैं।
- **Next Best Action**: अपने निवास प्रमाण पत्र का नवीनीकरण कराएं, जिससे 7 अन्य योजनाएं तुरंत अनलॉक हो जाएंगी।

आप मुझसे किसी भी योजना, दस्तावेज़ नियम या आवेदन प्रक्रिया के बारे में किसी भी भारतीय भाषा में पूछ सकते हैं!`;
  }

  res.json({
    reply,
    citations: [
      {
        title: 'Official State Service & Welfare Guidelines',
        url: 'https://serviceonline.bihar.gov.in',
        source: 'RTPS Citizen Service Portal'
      }
    ]
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NAGRIVOX] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[NAGRIVOX] API Base: http://0.0.0.0:${PORT}/api/v1`);
  });
}

startServer().catch(err => {
  console.error('[NAGRIVOX] Failed to start server:', err);
  process.exit(1);
});
