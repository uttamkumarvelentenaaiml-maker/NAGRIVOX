import { 
  UserProfile, 
  DocumentItem, 
  ServiceScheme, 
  CitizenApplication, 
  NotificationItem, 
  KnowledgeDoc,
  AuditLog
} from '../types';

export const DEMO_USER: UserProfile = {
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

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    userId: 'citizen-demo-01',
    type: 'AADHAAR',
    title: 'Aadhaar Card',
    fileName: 'aadhaar_sanjeet_kumar.pdf',
    fileSize: '1.4 MB',
    fileUrl: '/docs/sample_aadhaar.pdf',
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
    fileUrl: '/docs/sample_income.pdf',
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
    fileUrl: '/docs/sample_domicile.pdf',
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
    fileUrl: '/docs/sample_marksheet.pdf',
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

export const INITIAL_SERVICES: ServiceScheme[] = [
  {
    id: 'srv-01',
    name: 'Post Matric Scholarship for OBC Students',
    shortDescription: 'Financial assistance for post-secondary education for OBC candidates',
    description: 'Post Matric Scholarships scheme provides financial support to Other Backward Classes students studying at post-secondary or post-matriculation stages to enable them to complete their education.',
    category: 'Scholarships',
    state: 'Central & State',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://scholarships.gov.in',
    applicationUrl: 'https://scholarships.gov.in/post-matric-obc',
    benefit: 'Up to ₹20,000 / year + Tuition Fee Waiver',
    benefitAmount: '₹20,000/yr',
    priority: 'HIGH',
    active: true,
    deadline: '2026-11-30',
    isDemoData: true,
    officialSourceName: 'National Scholarship Portal (NSP), Ministry of Social Justice & Empowerment',
    officialSourceUrl: 'https://scholarships.gov.in',
    lastVerifiedAt: '2026-09-15',
    keywords: ['scholarship', 'student', 'obc', 'education', 'college', 'tuition', 'fee waiver'],
    prerequisites: ['Valid Admission in Recognized Institution', 'Active Bank Account linked with Aadhaar'],
    requiredDocumentTypes: ['AADHAAR', 'INCOME_CERTIFICATE', 'MARKSHEET', 'CASTE_CERTIFICATE', 'DOMICILE_CERTIFICATE'],
    requirements: [
      {
        id: 'req-01-1',
        serviceId: 'srv-01',
        name: 'Student Status',
        description: 'Candidate must be actively enrolled in a recognized college/institution',
        evidenceKey: 'isStudent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 20
      },
      {
        id: 'req-01-2',
        serviceId: 'srv-01',
        name: 'Income Ceiling',
        description: 'Annual family income must be under ₹2,50,000 per annum',
        evidenceKey: 'annualIncome',
        operator: 'LESS_OR_EQUAL',
        expectedValue: 250000,
        required: true,
        weight: 25,
        documentType: 'INCOME_CERTIFICATE'
      },
      {
        id: 'req-01-3',
        serviceId: 'srv-01',
        name: 'Social Category (OBC/SC/ST)',
        description: 'Must belong to Other Backward Classes (OBC), SC or ST category',
        evidenceKey: 'category',
        operator: 'IN',
        expectedValue: ['OBC', 'SC', 'ST'],
        required: true,
        weight: 25,
        documentType: 'CASTE_CERTIFICATE'
      },
      {
        id: 'req-01-4',
        serviceId: 'srv-01',
        name: 'Minimum Academic Qualification',
        description: 'Minimum 50% aggregate in 12th standard',
        evidenceKey: 'marksPercentage',
        operator: 'GREATER_OR_EQUAL',
        expectedValue: 50,
        required: true,
        weight: 15,
        documentType: 'MARKSHEET'
      },
      {
        id: 'req-01-5',
        serviceId: 'srv-01',
        name: 'State Domicile Validity',
        description: 'Must possess a valid active domicile certificate of residence',
        evidenceKey: 'domicileValid',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 15,
        documentType: 'DOMICILE_CERTIFICATE'
      }
    ]
  },
  {
    id: 'srv-02',
    name: 'Pradhan Mantri Awas Yojana (PMAY-G / U)',
    shortDescription: 'Housing grant assistance for pucca house construction',
    description: 'PMAY aims to provide affordable housing with basic amenities including water, sanitation, and electricity to eligible rural and urban households without a pucca house.',
    category: 'Housing',
    state: 'Central',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://pmaymis.gov.in',
    applicationUrl: 'https://pmaymis.gov.in/apply',
    benefit: 'Direct subsidy grant of up to ₹1,20,000 - ₹2,50,000',
    benefitAmount: '₹1,50,000',
    priority: 'HIGH',
    active: true,
    isDemoData: true,
    officialSourceName: 'Ministry of Housing and Urban Affairs (MoHUA)',
    officialSourceUrl: 'https://pmaymis.gov.in',
    lastVerifiedAt: '2026-09-10',
    keywords: ['housing', 'awas', 'house', 'construction', 'pmay', 'shelter', 'subsidy'],
    requiredDocumentTypes: ['AADHAAR', 'INCOME_CERTIFICATE', 'DOMICILE_CERTIFICATE'],
    requirements: [
      {
        id: 'req-02-1',
        serviceId: 'srv-02',
        name: 'Aadhaar Identification',
        description: 'Valid Aadhaar identification with matching bio-demographics',
        evidenceKey: 'aadhaarPresent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 30,
        documentType: 'AADHAAR'
      },
      {
        id: 'req-02-2',
        serviceId: 'srv-02',
        name: 'Income Eligibility (EWS/LIG)',
        description: 'Annual family income under ₹3,00,000 (EWS) or ₹6,00,000 (LIG)',
        evidenceKey: 'annualIncome',
        operator: 'LESS_OR_EQUAL',
        expectedValue: 300000,
        required: true,
        weight: 35,
        documentType: 'INCOME_CERTIFICATE'
      },
      {
        id: 'req-02-3',
        serviceId: 'srv-02',
        name: 'Active Domicile',
        description: 'Must show permanent residency proof in target state/district',
        evidenceKey: 'domicileValid',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 35,
        documentType: 'DOMICILE_CERTIFICATE'
      }
    ]
  },
  {
    id: 'srv-03',
    name: 'Ayushman Bharat PM-JAY',
    shortDescription: 'Cashless healthcare coverage of ₹5 Lakhs per family per year',
    description: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana is the worlds largest health assurance scheme providing a health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',
    category: 'Health',
    state: 'Central',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://pmjay.gov.in',
    applicationUrl: 'https://setu.pmjay.gov.in/setu/',
    benefit: 'Cashless health insurance coverage up to ₹5,00,000 per family per year',
    benefitAmount: '₹5,00,000/yr',
    priority: 'HIGH',
    active: true,
    isDemoData: true,
    officialSourceName: 'National Health Authority (NHA)',
    officialSourceUrl: 'https://pmjay.gov.in',
    lastVerifiedAt: '2026-09-18',
    keywords: ['health', 'hospital', 'insurance', 'medical', 'ayushman', 'pmjay', 'treatment'],
    requiredDocumentTypes: ['AADHAAR', 'INCOME_CERTIFICATE'],
    requirements: [
      {
        id: 'req-03-1',
        serviceId: 'srv-03',
        name: 'Identity Verification',
        description: 'Aadhaar card with verified demographic record',
        evidenceKey: 'aadhaarPresent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      },
      {
        id: 'req-03-2',
        serviceId: 'srv-03',
        name: 'Socio-Economic Criterion',
        description: 'Household income qualifies under low-income threshold (<= ₹2,00,000)',
        evidenceKey: 'annualIncome',
        operator: 'LESS_OR_EQUAL',
        expectedValue: 250000,
        required: true,
        weight: 50,
        documentType: 'INCOME_CERTIFICATE'
      }
    ]
  },
  {
    id: 'srv-04',
    name: 'PM-Kisan Samman Nidhi',
    shortDescription: 'Income support of ₹6,000 per year for farmer families',
    description: 'PM-KISAN is a central sector scheme with 100% funding from Government of India providing income support of ₹6,000/- per year in three equal installments to all landholding farmer families.',
    category: 'Farmers',
    state: 'Central',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://pmkisan.gov.in',
    applicationUrl: 'https://pmkisan.gov.in/RegistrationFormNew.aspx',
    benefit: 'Direct Benefit Transfer (DBT) of ₹6,000 per year in 3 installments',
    benefitAmount: '₹6,000/yr',
    priority: 'MEDIUM',
    active: true,
    isDemoData: true,
    officialSourceName: 'Department of Agriculture and Farmers Welfare',
    officialSourceUrl: 'https://pmkisan.gov.in',
    lastVerifiedAt: '2026-09-12',
    keywords: ['farmer', 'kisan', 'agriculture', 'dbt', 'land', 'crop', 'support'],
    requiredDocumentTypes: ['AADHAAR', 'LAND_RECORD'],
    requirements: [
      {
        id: 'req-04-1',
        serviceId: 'srv-04',
        name: 'Farmer Land Ownership Status',
        description: 'Applicant must be an agricultural landowner',
        evidenceKey: 'isFarmer',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 50,
        documentType: 'LAND_RECORD'
      },
      {
        id: 'req-04-2',
        serviceId: 'srv-04',
        name: 'Aadhaar Seeded Account',
        description: 'Valid Aadhaar connected to bank account for DBT',
        evidenceKey: 'aadhaarPresent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      }
    ]
  },
  {
    id: 'srv-05',
    name: 'National Apprenticeship Promotion Scheme (NAPS)',
    shortDescription: 'Stipend support and skill training for educated youth',
    description: 'NAPS promotes apprenticeship training and incentivizes employers to engage apprentices, offering practical on-the-job industrial skills and monthly stipends.',
    category: 'Employment',
    state: 'Central',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://apprenticeshipindia.gov.in',
    applicationUrl: 'https://apprenticeshipindia.gov.in/candidate-registration',
    benefit: 'Monthly stipend of ₹8,000 - ₹12,000 + Govt Certification',
    benefitAmount: '₹10,000/mo',
    priority: 'HIGH',
    active: true,
    isDemoData: true,
    officialSourceName: 'Ministry of Skill Development & Entrepreneurship',
    officialSourceUrl: 'https://apprenticeshipindia.gov.in',
    lastVerifiedAt: '2026-09-08',
    keywords: ['job', 'internship', 'training', 'apprentice', 'youth', 'stipend', 'skill'],
    requiredDocumentTypes: ['AADHAAR', 'MARKSHEET'],
    requirements: [
      {
        id: 'req-05-1',
        serviceId: 'srv-05',
        name: 'Age Criterion',
        description: 'Candidate must be between 18 and 28 years old',
        evidenceKey: 'age',
        operator: 'GREATER_OR_EQUAL',
        expectedValue: 18,
        required: true,
        weight: 40,
        documentType: 'AADHAAR'
      },
      {
        id: 'req-05-2',
        serviceId: 'srv-05',
        name: 'Educational Qualification',
        description: 'Must have passed 10th or 12th standard or ITI',
        evidenceKey: 'educationLevel',
        operator: 'IN',
        expectedValue: ['10th', '12th', 'ITI', 'Class 12th Passed', 'Undergraduate'],
        required: true,
        weight: 60,
        documentType: 'MARKSHEET'
      }
    ]
  },
  {
    id: 'srv-06',
    name: 'Bihar Student Credit Card Scheme (MNSSBY)',
    shortDescription: 'Education loan up to ₹4 Lakhs at 1% interest for higher studies',
    description: 'Under Bihar Vikas Mission (7 Nishchay), the Student Credit Card scheme provides education loans up to ₹4 Lakhs for general/professional higher studies with simple interest as low as 1%.',
    category: 'Scholarships',
    state: 'Bihar',
    centralOrState: 'STATE',
    officialUrl: 'https://www.7nishchay-yousha.bihar.gov.in',
    applicationUrl: 'https://www.7nishchay-yousha.bihar.gov.in/addMembAction',
    benefit: 'Low-interest education loan up to ₹4,00,000',
    benefitAmount: '₹4,00,000',
    priority: 'HIGH',
    active: true,
    isDemoData: true,
    officialSourceName: 'Bihar Vikas Mission & Education Department',
    officialSourceUrl: 'https://www.7nishchay-yousha.bihar.gov.in',
    lastVerifiedAt: '2026-09-20',
    keywords: ['loan', 'credit card', 'bihar', 'higher education', 'college loan', '7 nishchay'],
    requiredDocumentTypes: ['AADHAAR', 'MARKSHEET', 'DOMICILE_CERTIFICATE', 'INCOME_CERTIFICATE'],
    requirements: [
      {
        id: 'req-06-1',
        serviceId: 'srv-06',
        name: 'Bihar Domicile (Permanent Resident)',
        description: 'Must have a valid Bihar state domicile certificate',
        evidenceKey: 'domicileValid',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 40,
        documentType: 'DOMICILE_CERTIFICATE'
      },
      {
        id: 'req-06-2',
        serviceId: 'srv-06',
        name: '12th Standard Passed',
        description: 'Candidate must have cleared intermediate (10+2) board exams',
        evidenceKey: 'educationLevel',
        operator: 'IN',
        expectedValue: ['Class 12th Passed', 'Undergraduate'],
        required: true,
        weight: 35,
        documentType: 'MARKSHEET'
      },
      {
        id: 'req-06-3',
        serviceId: 'srv-06',
        name: 'Age Requirement',
        description: 'Age must not exceed 25 years at application time',
        evidenceKey: 'age',
        operator: 'LESS_OR_EQUAL',
        expectedValue: 25,
        required: true,
        weight: 25,
        documentType: 'AADHAAR'
      }
    ]
  },
  {
    id: 'srv-07',
    name: 'Atal Pension Yojana (APY)',
    shortDescription: 'Guaranteed pension of ₹1,000 to ₹5,000 per month after 60 years',
    description: 'Atal Pension Yojana is a periodic pension scheme targeted at unorganized sector workers, with guaranteed monthly payouts post 60 years based on monthly contribution.',
    category: 'Pension',
    state: 'Central',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://www.pfrda.org.in',
    applicationUrl: 'https://enps.nsdl.com/eNPS/ApySubRegistration.html',
    benefit: 'Guaranteed pension ₹1,000 to ₹5,000/month after age 60',
    benefitAmount: '₹5,000/mo',
    priority: 'MEDIUM',
    active: true,
    isDemoData: true,
    officialSourceName: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    officialSourceUrl: 'https://www.pfrda.org.in',
    lastVerifiedAt: '2026-09-01',
    keywords: ['pension', 'apy', 'retirement', 'savings', 'senior', 'social security'],
    requiredDocumentTypes: ['AADHAAR'],
    requirements: [
      {
        id: 'req-07-1',
        serviceId: 'srv-07',
        name: 'Entry Age Between 18 and 40',
        description: 'Applicant must be an Indian citizen aged between 18 and 40 years',
        evidenceKey: 'age',
        operator: 'GREATER_OR_EQUAL',
        expectedValue: 18,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      },
      {
        id: 'req-07-2',
        serviceId: 'srv-07',
        name: 'Maximum Entry Age Cap',
        description: 'Applicant age must not exceed 40 years',
        evidenceKey: 'age',
        operator: 'LESS_OR_EQUAL',
        expectedValue: 40,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      }
    ]
  },
  {
    id: 'srv-08',
    name: 'Pradhan Mantri Mudra Yojana (Shishu/Kishor)',
    shortDescription: 'Collateral-free micro loans up to ₹50,000 - ₹5,00,000 for small businesses',
    description: 'MUDRA loans provide collateral-free business funding to micro-enterprises and non-corporate small business units in manufacturing, trading, and services.',
    category: 'Employment',
    state: 'Central',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://www.mudra.org.in',
    applicationUrl: 'https://www.udyamimitra.in',
    benefit: 'Collateral-free loan up to ₹5,00,000 for self-employment',
    benefitAmount: '₹5,00,000',
    priority: 'MEDIUM',
    active: true,
    isDemoData: true,
    officialSourceName: 'Micro Units Development & Refinance Agency (MUDRA)',
    officialSourceUrl: 'https://www.mudra.org.in',
    lastVerifiedAt: '2026-09-05',
    keywords: ['mudra', 'loan', 'business', 'startup', 'shop', 'self employed', 'credit'],
    requiredDocumentTypes: ['AADHAAR', 'DOMICILE_CERTIFICATE'],
    requirements: [
      {
        id: 'req-08-1',
        serviceId: 'srv-08',
        name: 'Identity & Address Confirmation',
        description: 'Valid Aadhaar for KYC compliance',
        evidenceKey: 'aadhaarPresent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      },
      {
        id: 'req-08-2',
        serviceId: 'srv-08',
        name: 'Local Business/Residence Verification',
        description: 'Active domicile or residence proof in operational district',
        evidenceKey: 'domicileValid',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 50,
        documentType: 'DOMICILE_CERTIFICATE'
      }
    ]
  },
  {
    id: 'srv-09',
    name: 'Mukhyamantri Nishchay Swayam Sahayata Bhatta Yojana',
    shortDescription: 'Unemployment allowance of ₹1,000/month for 2 years for educated youth',
    description: 'Provides financial allowance of ₹1,000 per month for up to 2 years to unemployed youth aged 20-25 who are actively seeking employment or competitive exam preparations.',
    category: 'Employment',
    state: 'Bihar',
    centralOrState: 'STATE',
    officialUrl: 'https://www.7nishchay-yousha.bihar.gov.in',
    applicationUrl: 'https://www.7nishchay-yousha.bihar.gov.in/addMembAction',
    benefit: 'Monthly allowance of ₹1,000 for 24 months (Total ₹24,000)',
    benefitAmount: '₹1,000/mo',
    priority: 'MEDIUM',
    active: true,
    isDemoData: true,
    officialSourceName: 'Department of Planning & Development, Govt. of Bihar',
    officialSourceUrl: 'https://www.7nishchay-yousha.bihar.gov.in',
    lastVerifiedAt: '2026-09-11',
    keywords: ['bhatta', 'allowance', 'unemployed', 'youth', 'bihar', 'stipend'],
    requiredDocumentTypes: ['AADHAAR', 'MARKSHEET', 'DOMICILE_CERTIFICATE'],
    requirements: [
      {
        id: 'req-09-1',
        serviceId: 'srv-09',
        name: 'Bihar Domicile Status',
        description: 'Active domicile of Bihar state',
        evidenceKey: 'domicileValid',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 40,
        documentType: 'DOMICILE_CERTIFICATE'
      },
      {
        id: 'req-09-2',
        serviceId: 'srv-09',
        name: '12th Pass Qualification',
        description: 'Passed intermediate examination from recognized board in Bihar',
        evidenceKey: 'educationLevel',
        operator: 'IN',
        expectedValue: ['Class 12th Passed', 'Undergraduate'],
        required: true,
        weight: 35,
        documentType: 'MARKSHEET'
      },
      {
        id: 'req-09-3',
        serviceId: 'srv-09',
        name: 'Age Criteria (20-25 years)',
        description: 'Applicant must be in age group 20 to 25',
        evidenceKey: 'age',
        operator: 'GREATER_OR_EQUAL',
        expectedValue: 20,
        required: true,
        weight: 25,
        documentType: 'AADHAAR'
      }
    ]
  },
  {
    id: 'srv-10',
    name: 'Domicile Certificate (Online RTPS Service)',
    shortDescription: 'Official certificate certifying residential status in state',
    description: 'Right to Public Services (RTPS) online issuance of Domicile/Residential Certificate required for all state competitive exams, reservations, and welfare entitlements.',
    category: 'Certificates',
    state: 'State Portal',
    centralOrState: 'STATE',
    officialUrl: 'https://serviceonline.bihar.gov.in',
    applicationUrl: 'https://serviceonline.bihar.gov.in/service/residential-certificate',
    benefit: 'Official Legal Proof of Residence (Unlocks 7+ services)',
    benefitAmount: 'Validity 3 Yrs',
    priority: 'HIGH',
    active: true,
    isDemoData: true,
    officialSourceName: 'RTPS Bihar / State Service Delivery Portal',
    officialSourceUrl: 'https://serviceonline.bihar.gov.in',
    lastVerifiedAt: '2026-09-22',
    keywords: ['domicile', 'residence', 'certificate', 'rtps', 'niwas praman patra', 'address'],
    requiredDocumentTypes: ['AADHAAR'],
    requirements: [
      {
        id: 'req-10-1',
        serviceId: 'srv-10',
        name: 'Identity Verification via Aadhaar',
        description: 'Aadhaar document showing photo and local address',
        evidenceKey: 'aadhaarPresent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 100,
        documentType: 'AADHAAR'
      }
    ]
  },
  {
    id: 'srv-11',
    name: 'Caste Certificate (RTPS Bihar / State Portal)',
    shortDescription: 'Official OBC Non-Creamy Layer / SC / ST caste certificate',
    description: 'Issuance of community/caste certificate for availing constitutional reservations and category scholarships in educational admissions and public recruitment.',
    category: 'Certificates',
    state: 'State Portal',
    centralOrState: 'STATE',
    officialUrl: 'https://serviceonline.bihar.gov.in',
    applicationUrl: 'https://serviceonline.bihar.gov.in/service/caste-certificate',
    benefit: 'Official Category Reservation & Scholarship Eligibility',
    benefitAmount: 'Lifetime Validity',
    priority: 'HIGH',
    active: true,
    isDemoData: true,
    officialSourceName: 'General Administration Dept, State Government',
    officialSourceUrl: 'https://serviceonline.bihar.gov.in',
    lastVerifiedAt: '2026-09-22',
    keywords: ['caste', 'obc', 'sc', 'st', 'jati praman patra', 'reservation'],
    requiredDocumentTypes: ['AADHAAR', 'INCOME_CERTIFICATE'],
    requirements: [
      {
        id: 'req-11-1',
        serviceId: 'srv-11',
        name: 'Aadhaar Identification',
        description: 'Valid Aadhaar for applicant demographic records',
        evidenceKey: 'aadhaarPresent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      },
      {
        id: 'req-11-2',
        serviceId: 'srv-11',
        name: 'Income Record for Non-Creamy Layer',
        description: 'Income proof required to verify non-creamy layer criteria (< 8 Lakhs)',
        evidenceKey: 'annualIncome',
        operator: 'LESS_OR_EQUAL',
        expectedValue: 800000,
        required: true,
        weight: 50,
        documentType: 'INCOME_CERTIFICATE'
      }
    ]
  },
  {
    id: 'srv-12',
    name: 'PM Vishwakarma Scheme',
    shortDescription: 'Collateral-free enterprise credit & toolkits for traditional artisans',
    description: 'PM Vishwakarma provides recognition, skill training, toolkits incentive of ₹15,000 and enterprise collateral-free credit support up to ₹3,00,000 at concessional interest rate of 5%.',
    category: 'Employment',
    state: 'Central',
    centralOrState: 'CENTRAL',
    officialUrl: 'https://pmvishwakarma.gov.in',
    applicationUrl: 'https://pmvishwakarma.gov.in/Home/HowToRegister',
    benefit: '₹15,000 modern toolkit grant + low-interest loan up to ₹3,00,000',
    benefitAmount: '₹3,15,000',
    priority: 'MEDIUM',
    active: true,
    isDemoData: true,
    officialSourceName: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    officialSourceUrl: 'https://pmvishwakarma.gov.in',
    lastVerifiedAt: '2026-09-14',
    keywords: ['vishwakarma', 'artisan', 'craftsman', 'toolkit', 'msme', 'loan'],
    requiredDocumentTypes: ['AADHAAR'],
    requirements: [
      {
        id: 'req-12-1',
        serviceId: 'srv-12',
        name: 'Minimum Age 18 Years',
        description: 'Artisan must be 18 years of age or older',
        evidenceKey: 'age',
        operator: 'GREATER_OR_EQUAL',
        expectedValue: 18,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      },
      {
        id: 'req-12-2',
        serviceId: 'srv-12',
        name: 'Aadhaar Biometric KYC',
        description: 'Biometric verification linked with mobile Aadhaar',
        evidenceKey: 'aadhaarPresent',
        operator: 'EQUALS',
        expectedValue: true,
        required: true,
        weight: 50,
        documentType: 'AADHAAR'
      }
    ]
  }
];

export const INITIAL_APPLICATIONS: CitizenApplication[] = [
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

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
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

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'k-01',
    title: 'Post Matric Scholarship Rules & Required Documents',
    category: 'Scholarships',
    serviceId: 'srv-01',
    content: 'Post Matric Scholarship eligibility requires: 1. Student must belong to OBC/SC/ST category. 2. Family annual income must not exceed ₹2,50,000 per annum verified by Revenue Authority Income Certificate. 3. Active enrollment in recognized post-matric course. 4. Valid domicile certificate of the home state. 5. Bank account seeded with Aadhaar for DBT transfer.',
    source: 'National Scholarship Portal Guidelines 2025-26',
    sourceUrl: 'https://scholarships.gov.in/guidelines',
    lastVerified: '2026-09-01'
  },
  {
    id: 'k-02',
    title: 'How to Renew or Apply for Domicile Certificate Online',
    category: 'Certificates',
    serviceId: 'srv-10',
    content: 'Citizens can apply for a Residential/Domicile Certificate through the state RTPS portal (serviceonline.gov.in). Required documents: 1. Aadhaar Card (front and back with address). 2. Self-declaration form. 3. Passport size photograph. Processing time is usually 10 to 14 working days. The digital certificate carries a QR code and valid digital signature.',
    source: 'Public Service Delivery (RTPS) Citizen Charter',
    sourceUrl: 'https://serviceonline.bihar.gov.in',
    lastVerified: '2026-09-10'
  },
  {
    id: 'k-03',
    title: 'Ayushman Bharat PM-JAY Eligibility Criteria',
    category: 'Health',
    serviceId: 'srv-03',
    content: 'Ayushman Bharat covers rural and urban families based on SECC criteria and low income status. Entitles up to ₹5 lakh per family per year for secondary and tertiary hospitalization. No cap on family size. Pre-existing conditions are covered from day one at empanelled public and private hospitals across India.',
    source: 'National Health Authority Policy Doc',
    sourceUrl: 'https://pmjay.gov.in/about/pmjay',
    lastVerified: '2026-09-15'
  },
  {
    id: 'k-04',
    title: 'Bihar Student Credit Card Scheme (MNSSBY) Terms',
    category: 'Scholarships',
    serviceId: 'srv-06',
    content: 'Provides up to ₹4,00,000 education loan for 12th pass students pursuing higher technical, vocational, or general degrees. Interest rate is 1% for female, transgender, and disabled students, and 4% simple interest for male students. Repayment starts 1 year after course completion or after getting employment.',
    source: 'Bihar Vikas Mission Portal',
    sourceUrl: 'https://www.7nishchay-yousha.bihar.gov.in',
    lastVerified: '2026-08-25'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2025-02-18T14:02:11Z',
    userId: 'citizen-demo-01',
    action: 'ELIGIBILITY_RECALCULATION',
    category: 'RULES_ENGINE',
    details: 'Recalculated 12 schemes. 4 Likely Eligible, 3 Missing Document, 1 Expired Document.',
    status: 'SUCCESS'
  },
  {
    id: 'log-02',
    timestamp: '2025-02-18T13:45:00Z',
    userId: 'citizen-demo-01',
    action: 'CONSISTENCY_CHECK',
    category: 'AI_AUDIT',
    details: 'Name comparison across Aadhaar and Marksheet: matched "Sanjeet Kumar" vs "Sanjeet K." (Low severity).',
    status: 'SUCCESS'
  },
  {
    id: 'log-03',
    timestamp: '2025-02-15T09:12:44Z',
    userId: 'citizen-demo-01',
    action: 'DOCUMENT_EXPIRY_FLAG',
    category: 'EXPIRY_ENGINE',
    details: 'Domicile Certificate (doc-03) flagged EXPIRED (Lapsed 2025-08-10).',
    status: 'WARNING'
  }
];
