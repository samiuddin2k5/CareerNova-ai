import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, X, ShieldCheck } from 'lucide-react';
import { CandidateProfile } from '../types';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: CandidateProfile) => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (inputMode === 'file') {
        if (!file) {
          setErrorMsg('Please select a PDF or DOCX file to upload.');
          setIsProcessing(false);
          return;
        }

        const formData = new FormData();
        formData.append('resumeFile', file);

        const res = await fetch('/api/resume/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to analyze resume');
        }

        onProfileUpdated(data.profile);
        onClose();
      } else {
        if (!rawText.trim() || rawText.trim().length < 50) {
          setErrorMsg('Please paste full resume text content (at least 50 characters).');
          setIsProcessing(false);
          return;
        }

        const res = await fetch('/api/resume/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: rawText, fileName: 'pasted_resume.txt' })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to parse resume text');
        }

        onProfileUpdated(data.profile);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during resume analysis.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Upload Genuine Candidate Resume</h3>
              <p className="text-xs text-slate-400">PDF, DOCX, or direct raw text parsed with zero hallucination</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 my-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setInputMode('file')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              inputMode === 'file' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload PDF / DOCX File
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              inputMode === 'text' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Raw Resume Text
          </button>
        </div>

        {/* Upload Zone */}
        {inputMode === 'file' ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-500/10 scale-[0.99]' 
                : file 
                  ? 'border-emerald-500/50 bg-emerald-950/20' 
                  : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.docx,.doc,.txt" 
              className="hidden" 
              onChange={handleFileChange} 
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-100">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB • Ready for extraction</p>
                <span className="mt-3 text-[11px] text-emerald-400 underline">Click to change file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Drag and drop your PDF or DOCX resume here
                </p>
                <p className="text-xs text-slate-400 mt-1">or click to browse from your device</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PyMuPDF & python-docx compatible parsing</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your plain text resume here (including Education, Experience, Skills, and Projects)..."
              rows={8}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Anti-hallucination banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Anti-Hallucination Guarantee:</strong> CareerPilot AI only extracts and enhances your genuine verified skills, companies, and achievements. It will never fabricate unpossessed technologies.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || (inputMode === 'file' && !file) || (inputMode === 'text' && !rawText.trim())}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Resume with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parse & Update Profile</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
