import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, Integer, Float, DateTime, ForeignKey, Text, Enum, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="CITIZEN", nullable=False) # CITIZEN, ADMIN, OPERATOR
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("CitizenProfile", back_populates="user", uselist=False)
    documents = relationship("Document", back_populates="user")
    applications = relationship("Application", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class CitizenProfile(Base):
    __tablename__ = "citizen_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    state = Column(String(100), default="Bihar")
    district = Column(String(100), default="Patna")
    preferred_language = Column(String(10), default="en")
    dob = Column(String(50), nullable=True)
    gender = Column(String(50), nullable=True)
    category = Column(String(50), default="OBC") # GENERAL, OBC, SC, ST, EWS
    education = Column(String(100), default="Class 12th Passed")
    occupation = Column(String(100), default="Student")
    annual_income = Column(Float, default=180000.0)
    family_size = Column(Integer, default=4)
    is_farmer = Column(Boolean, default=false)
    is_student = Column(Boolean, default=true)
    has_disability = Column(Boolean, default=false)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")
    evidence_items = relationship("EvidenceItem", back_populates="citizen_profile")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(100), nullable=False) # AADHAAR, INCOME_CERTIFICATE, DOMICILE_CERTIFICATE, MARKSHEET, CASTE_CERTIFICATE
    title = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=True)
    file_url = Column(String(1000), nullable=True)
    status = Column(String(50), default="UPLOADED") # UPLOADED, PROCESSING, VERIFIED, NEEDS_RENEWAL, EXPIRED, MISSING
    issued_at = Column(String(50), nullable=True)
    expires_at = Column(String(50), nullable=True)
    confidence_score = Column(Float, default=0.95)
    masked_number = Column(String(100), nullable=True)
    issuer = Column(String(255), nullable=True)
    extracted_data = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="documents")

class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("citizen_profiles.id", ondelete="CASCADE"), nullable=False)
    key = Column(String(100), nullable=False, index=True)
    label = Column(String(255), nullable=False)
    value_raw = Column(Text, nullable=False)
    display_value = Column(String(255), nullable=False)
    source_document_id = Column(String, nullable=True)
    source_document_type = Column(String(100), nullable=False)
    confidence = Column(Float, default=0.95)
    status = Column(String(50), default="VERIFIED") # VERIFIED, NEEDS_REVIEW, CONFLICT
    valid_until = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    citizen_profile = relationship("CitizenProfile", back_populates="evidence_items")

class ServiceScheme(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    short_description = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    state = Column(String(100), default="Central")
    central_or_state = Column(String(50), default="CENTRAL")
    official_url = Column(String(1000), nullable=False)
    application_url = Column(String(1000), nullable=False)
    benefit = Column(String(500), nullable=False)
    benefit_amount = Column(String(100), nullable=True)
    priority = Column(String(50), default="MEDIUM")
    active = Column(Boolean, default=True)
    is_demo_data = Column(Boolean, default=True)
    official_source_name = Column(String(255), nullable=False)
    last_verified_at = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    requirements = relationship("ServiceRequirement", back_populates="service")

class ServiceRequirement(Base):
    __tablename__ = "service_requirements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    service_id = Column(String, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    evidence_key = Column(String(100), nullable=False)
    operator = Column(String(50), nullable=False) # EQUALS, LESS_OR_EQUAL, GREATER_OR_EQUAL, IN, DOCUMENT_PRESENT
    expected_value = Column(JSON, nullable=False)
    required = Column(Boolean, default=True)
    weight = Column(Integer, default=20)
    document_type = Column(String(100), nullable=True)

    service = relationship("ServiceScheme", back_populates="requirements")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(String, ForeignKey("services.id"), nullable=False)
    service_name = Column(String(255), nullable=False)
    service_category = Column(String(100), nullable=False)
    benefit = Column(String(255), nullable=False)
    application_number = Column(String(100), unique=True, nullable=False)
    status = Column(String(50), default="READY") # DRAFT, READY, SUBMITTED, UNDER_REVIEW, DOCUMENT_REQUIRED, APPROVED
    next_action = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    timeline_events = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False) # EXPIRY, MISSING_DOC, MISMATCH, ELIGIBILITY
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    action_label = Column(String(100), nullable=True)
    action_link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    action = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    status = Column(String(50), default="SUCCESS")
    timestamp = Column(DateTime, default=datetime.utcnow)
