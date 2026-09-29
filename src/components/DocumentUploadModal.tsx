import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { DocumentType } from '../types';
import { ApiClient } from '../services/apiClient';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedType?: DocumentType;
  onUploadSuccess: (newDoc: any) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  preselectedType,
  onUploadSuccess
}) => {
  const [docType, setDocType] = useState<DocumentType>(preselectedType || 'CASTE_CERTIFICATE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const steps = [
    'Uploading document securely...',
    'Preprocessing & enhancing scan resolution...',
    'Performing OCR & text extraction...',
    'Extracting structured citizen evidence...',
    'Running consistency & fraud prevention checks...',
    'Matching against 12+ government schemes...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage('File size must be under 15MB');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage('File size must be under 15MB');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleStartUpload = async () => {
    setUploading(true);
    setErrorMessage('');

    // Advance progress stages for realistic micro-interaction
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise(r => setTimeout(r, 650));
    }

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('documentType', docType);
      formData.append('title', docType.replace(/_/g, ' '));

      const newDoc = await ApiClient.uploadDocument(formData);
      onUploadSuccess(newDoc);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        {!uploading && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#006B4F]" />
              <span>Upload Document</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Secure OCR extraction with automated masking of sensitive IDs
            </p>
          </div>

          {!uploading ? (
            <div className="space-y-4">
              {/* Document Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006B4F]/20 focus:border-[#006B4F]"
                >
                  <option value="CASTE_CERTIFICATE">Caste Certificate (OBC / SC / ST)</option>
                  <option value="DOMICILE_CERTIFICATE">Domicile / Residence Certificate</option>
                  <option value="INCOME_CERTIFICATE">Income Certificate</option>
                  <option value="MARKSHEET">Marksheet / Educational Certificate</option>
                  <option value="AADHAAR">Aadhaar Card (UIDAI)</option>
                  <option value="RATION_CARD">Ration Card (NFSA / State PDS)</option>
                  <option value="PAN_CARD">PAN Card</option>
                  <option value="DISABILITY_CERTIFICATE">Disability Certificate (UDID)</option>
                </select>
              </div>

              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors
                  ${isDragging ? 'border-[#006B4F] bg-emerald-50/50' : 'border-slate-300 hover:border-[#006B4F] bg-slate-50/50'}
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-[#E8F7F0] text-[#006B4F] mx-auto flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to process
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supported formats: PDF, PNG, JPG, JPEG, WEBP (Max 15MB)
                    </p>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Security Privacy Notice */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-[#006B4F] flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Privacy First:</strong> Your documents are encrypted and evaluated locally against official scheme rules. Sensitive identity numbers are masked automatically.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartUpload}
                  className="px-5 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#004D3A] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedFile ? 'Process & Extract' : 'Simulate Sample Upload'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Uploading & Processing State */
            <div className="py-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F7F0] text-[#006B4F] mx-auto flex items-center justify-center animate-bounce">
                <Cpu className="w-8 h-8 text-[#006B4F]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {steps[currentStepIndex]}
                </h3>
                <p className="text-xs text-slate-500">
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden max-w-sm mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-[#006B4F] to-[#16A36A] rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
