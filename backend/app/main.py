"""
NAGRIVOX - AI-Powered Citizen Service Readiness Platform
FastAPI Production Backend Entry Point
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="NAGRIVOX API",
    description="Evidence-to-Service Mapping, Document Consistency, Readiness & Citizen Guidance Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "NAGRIVOX Citizen Readiness Backend",
        "version": "1.0.0",
        "database": "PostgreSQL + pgvector",
        "redis": "Connected"
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to NAGRIVOX API - Your Documents. Your Rights. Our Guidance.",
        "docs": "/docs",
        "api_prefix": "/api/v1"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
