# NAGRIVOX
### AI-Powered Citizen Service Readiness Platform
> *"Your Documents. Your Rights. Our Guidance."*
> **"Know what you have. Know what's missing. Know what to do next."**

---

## 1. Executive Summary & Vision

**NAGRIVOX** is an Indian civic-tech platform that fundamentally shifts how citizens access social welfare entitlements through **Evidence-to-Service Mapping**. 

Rather than expecting citizens to decipher convoluted bureaucratic guidelines across fragmented government portals, NAGRIVOX:
1. Securely analyzes the documents a citizen already possesses (Aadhaar, Income Certificates, Domicile, Marksheets, Caste Certificates).
2. Extracts verified demographic and socioeconomic evidence facts.
3. Maps extracted evidence deterministically to official scheme rules.
4. Detects document expiry (e.g. Domicile lapsed Aug 2025) and inconsistencies (e.g. "Sanjeet Kumar" vs "Sanjeet K.").
5. Dynamically calculates **Application Readiness**.
6. Identifies the **Minimum Proof Pack** ("What 1 missing document unlocks the highest number of schemes?").
7. Recommends tailored entitlements and provides grounded, multi-lingual guidance in 10+ Indian languages.

---

## 2. Key Features

- **Document Ingestion & OCR Pipeline**: Upload PDF, PNG, JPG, WEBP scans with automated OCR, metadata extraction, and masking of sensitive identifiers (Aadhaar `XXXX XXXX 4821`).
- **Evidence Profile**: Graph representation of age, income, academic marks, residence, caste category, and student status with confidence scoring.
- **Deterministic Rules Engine**: Non-hallucinatory eligibility evaluation supporting `EQUALS`, `LESS_OR_EQUAL`, `GREATER_OR_EQUAL`, `IN`, `DOCUMENT_PRESENT`, and `DATE_VALID`.
- **Readiness Meter**: Real-time circular percentage metric computed as `(satisfied_requirements / total_requirements) * 100`.
- **Minimum Proof Pack Engine**: Discovers that renewing the **Domicile Certificate** immediately unlocks **7 state and central schemes**!
- **Cross-Document Consistency Engine**: Politely flags demographic discrepancies across documents (e.g. name abbreviations) with severity ranking.
- **Ask NAGRIVOX AI Assistant**: Grounded Q&A powered by Google Gemini and verified official scheme rules with citation sources and Indian Web Speech voice synthesis/recognition.
- **Multilingual Support**: Dynamic i18n localization for 11 Indian languages (English, Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia).
- **Application Tracker**: Full lifecycle pipeline (`DRAFT` → `READY` → `SUBMITTED` → `DOCUMENT_REQUIRED` → `APPROVED`) with event milestone timelines.
- **Admin Dashboard**: System metrics, scheme catalog manager, document issue distributions, and live audit telemetry.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Speech API.
- **Full-Stack Application Server**: Node.js, Express, Vite middlewares (`server.ts`).
- **AI & RAG Engine**: Google GenAI SDK (`@google/genai` with `gemini-3.8-flash`), structured schema extraction, grounded official citations.
- **Production Backend**: Python 3.11, FastAPI, SQLAlchemy 2, Alembic, PostgreSQL with pgvector, Redis, Celery.
- **DevOps**: Docker, Docker Compose multi-container orchestration.

---

## 4. Demo Citizen Profile & Test Credentials

- **Citizen Name**: Sanjeet Kumar
- **Role**: Undergraduate Student (OBC Category, Bihar Resident)
- **Annual Income**: ₹1,80,000 (Verified via Revenue Department)
- **Academic Score**: Class 12th CBSE (84.2% Passed)
- **Pre-loaded Documents**:
  - `Aadhaar Card`: **VERIFIED** (Masked `XXXX XXXX 4821`)
  - `Income Certificate`: **VERIFIED** (`₹1,80,000`)
  - `Domicile Certificate`: **EXPIRED / NEEDS RENEWAL** (Expired on 10 Aug 2025)
  - `Marksheet`: **VERIFIED** ("Sanjeet K." - 84.2%)
  - `Caste Certificate`: **MISSING / NOT UPLOADED**
- **Readiness Score**: 67% (4 of 6 core requirements completed)
- **Next Best Action**: "Renew your Domicile Certificate to unlock 7 more services."

---

## 5. Quickstart & Local Setup

### Running with Node.js & Express (Instant Development Mode)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional Gemini key for real-time AI)
cp .env.example .env

# 3. Start full-stack dev server on port 3000
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Running with Docker Compose

```bash
docker compose up --build
```

Services launched:
- **Frontend / Full-stack**: `http://localhost:3000`
- **FastAPI Backend**: `http://localhost:8000/docs`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

---

## 6. REST API Reference (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health check and Gemini status |
| `POST` | `/api/v1/auth/login` | Authenticate citizen or admin |
| `GET` | `/api/v1/profile` | Retrieve citizen demographic profile |
| `GET` | `/api/v1/documents` | List uploaded citizen documents |
| `POST` | `/api/v1/documents/upload` | Multipart document upload with OCR & evidence extraction |
| `POST` | `/api/v1/documents/:id/renew` | Fast-track certificate renewal |
| `GET` | `/api/v1/services` | Retrieve government scheme catalog |
| `GET` | `/api/v1/applications` | Retrieve ongoing citizen applications |
| `POST` | `/api/v1/applications` | Create new scheme application |
| `POST` | `/api/v1/chat` | Grounded AI assistant Q&A with source citations |
| `GET` | `/api/v1/notifications` | Real-time notification center alerts |
| `GET` | `/api/v1/admin/stats` | Administrative analytics and issue metrics |

---

## 7. Security & Privacy

1. **Identity Masking**: Aadhaar and personal identifier numbers are masked automatically prior to client rendering (`XXXX XXXX 4821`).
2. **Deterministic Integrity**: Entitlement eligibility is never entrusted to generative hallucinations; rules are calculated deterministically.
3. **Role-Based Authorization**: Distinct roles for `CITIZEN`, `OPERATOR`, and `ADMIN`.
4. **Audit Logs**: Every extraction, consistency check, and eligibility recalculation writes an immutable audit record.
