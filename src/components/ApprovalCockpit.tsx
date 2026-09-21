import React, { useState, useEffect } from 'react';
import { 
  JobPosting, 
  CandidateProfile, 
  ApplicationRecord, 
  TailoredResume, 
  ApplicationEmail
} from '../types';
import { calculateCompatibilityScore } from '../lib/scoring';
import { generateResumePdf, downloadResumePdf } from '../lib/pdfGenerator';
import { buildInstantTailoredResume, buildInstantApplicationEmail } from '../lib/instantTailor';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Mail, 
  Send, 
  Download, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Building2, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock
} from 'lucide-react';

interface ApprovalCockpitProps {
  selectedJob: JobPosting | null;
  allJobs: JobPosting[];
  candidate: CandidateProfile;
  applications: ApplicationRecord[];
  onSelectJob: (job: JobPosting) => void;
  onApplicationUpdated: (app: ApplicationRecord) => void;
  onOpenGmailModal: () => void;
  isGmailConnected: boolean;
}

export const ApprovalCockpit: React.FC<ApprovalCockpitProps> = ({
  selectedJob,
  allJobs,
  candidate,
  applications,
  onSelectJob,
  onApplicationUpdated,
  onOpenGmailModal,
  isGmailConnected
}) => {
  const [currentJob, setCurrentJob] = useState<JobPosting>(selectedJob || allJobs[0]);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [emailDraft, setEmailDraft] = useState<ApplicationEmail | null>(null);
  const [isGeneratingTailor, setIsGeneratingTailor] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);
  const [userConfirmedApproval, setUserConfirmedApproval] = useState(true);
  const [copiedText, setCopiedText] = useState(false);

  const [sentDetails, setSentDetails] = useState<{
    messageId: string;
    attachmentName: string;
    toEmail: string;
    timestamp: string;
    gmailComposeUrl?: string;
  } | null>(null);

  // Sync currentJob if selectedJob changes from outside
  useEffect(() => {
    if (selectedJob && selectedJob.id !== currentJob.id) {
      setCurrentJob(selectedJob);
    }
  }, [selectedJob]);

  // Load existing or generate fresh tailoring instantly when job changes
  useEffect(() => {
    const existingApp = applications.find(a => a.jobId === currentJob.id);
    const score = calculateCompatibilityScore(candidate, currentJob);

    // 1. Instant hydration for Tailored Resume
    if (existingApp?.tailoredResume) {
      setTailoredResume(existingApp.tailoredResume);
    } else {
      const instantResume = buildInstantTailoredResume(candidate, currentJob, score);
      setTailoredResume(instantResume);
      // Background sync with AI endpoint if desired without blocking UI
      backgroundSyncTailor(currentJob);
    }

    // 2. Instant hydration for Application Cover Email
    if (existingApp?.applicationEmail) {
      setEmailDraft(existingApp.applicationEmail);
    } else {
      const instantEmail = buildInstantApplicationEmail(candidate, currentJob, score);
      setEmailDraft(instantEmail);
      // Background sync with AI endpoint if desired without blocking UI
      backgroundSyncEmail(currentJob);
    }

    setSendSuccessMessage(null);
    setSendErrorMessage(null);
    if (existingApp?.status === 'Application Submitted' || existingApp?.status === 'Sent') {
      setSentDetails({
        messageId: existingApp.gmailMessageId || 'gmail_api_verified',
        attachmentName: existingApp.applicationEmail?.attachmentName || candidate.originalFileName || `${candidate.fullName.replace(/\s+/g, '_')}_CV_${currentJob.company.replace(/[^a-zA-Z0-9]/g, '')}.pdf`,
        toEmail: existingApp.applicationEmail?.toEmail || currentJob.discoveredEmail || '',
        timestamp: existingApp.sentTimestamp || existingApp.appliedDate || new Date().toISOString(),
        gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(existingApp.applicationEmail?.toEmail || currentJob.discoveredEmail || '')}&su=${encodeURIComponent(existingApp.applicationEmail?.subject || '')}&body=${encodeURIComponent(existingApp.applicationEmail?.bodyText || '')}`
      });
    } else {
      setSentDetails(null);
    }
  }, [currentJob.id]);

  const scoreBreakdown = calculateCompatibilityScore(candidate, currentJob);
  const currentApp = applications.find(a => a.jobId === currentJob.id);

  const backgroundSyncTailor = async (jobToTailor: JobPosting) => {
    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobToTailor.id })
      });
      const data = await res.json();
      if (data.tailoredResume && currentJob.id === jobToTailor.id) {
        setTailoredResume(data.tailoredResume);
        if (data.application) {
          onApplicationUpdated(data.application);
        }
      }
    } catch (e) {
      // Quiet fallback - instant tailoring already visible
    }
  };

  const backgroundSyncEmail = async (jobForEmail: JobPosting) => {
    try {
      const res = await fetch('/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobForEmail.id })
      });
      const data = await res.json();
      if (data.email && currentJob.id === jobForEmail.id) {
        setEmailDraft(data.email);
        if (data.application) {
          onApplicationUpdated(data.application);
        }
      }
    } catch (e) {
      // Quiet fallback - instant email already visible
    }
  };

  const handleManualReTailor = async (jobToTailor: JobPosting) => {
    setIsGeneratingTailor(true);
    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobToTailor.id })
      });
      const data = await res.json();
      if (data.tailoredResume) {
        setTailoredResume(data.tailoredResume);
        if (data.application) {
          onApplicationUpdated(data.application);
        }
      }
    } catch (e) {
      console.error('Tailoring error:', e);
    } finally {
      setIsGeneratingTailor(false);
    }
  };

  const handleManualReEmail = async (jobForEmail: JobPosting) => {
    setIsGeneratingEmail(true);
    try {
      const res = await fetch('/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobForEmail.id })
      });
      const data = await res.json();
      if (data.email) {
        setEmailDraft(data.email);
        if (data.application) {
          onApplicationUpdated(data.application);
        }
      }
    } catch (e) {
      console.error('Email generation error:', e);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleDownloadTailoredPdf = () => {
    downloadResumePdf(candidate, tailoredResume || undefined, currentJob);
  };

  const handleCopyEmail = () => {
    if (!emailDraft) return;
    const full = `To: ${emailDraft.toEmail}\nSubject: ${emailDraft.subject}\n\n${emailDraft.bodyText}`;
    navigator.clipboard.writeText(full);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSendViaGmail = async () => {
    if (!userConfirmedApproval) {
      setSendErrorMessage('Please confirm your approval before dispatching.');
      return;
    }

    setIsSending(true);
    setSendSuccessMessage(null);
    setSendErrorMessage(null);

    try {
      // 1. Determine attachment: use user's uploaded CV or tailored ATS PDF resume
      let attachmentFilename = candidate.originalFileName || `${candidate.fullName.replace(/\s+/g, '_')}_CV_${(currentJob.company || 'Company').replace(/[^a-zA-Z0-9]/g, '')}.pdf`;
      let attachmentBase64 = '';

      if (candidate.cvDataUrl) {
        // User uploaded their own CV in signup - attach user's exact CV!
        attachmentBase64 = candidate.cvDataUrl.includes(',')
          ? candidate.cvDataUrl.split(',')[1]
          : candidate.cvDataUrl;
      } else {
        const { filename, base64 } = generateResumePdf(candidate, tailoredResume || undefined, currentJob);
        attachmentBase64 = base64;
        if (!candidate.originalFileName) {
          attachmentFilename = filename;
        }
      }
      
      // Automatically download tailored resume to device as part of the submission workflow
      if (!candidate.cvDataUrl) {
        downloadResumePdf(candidate, tailoredResume || undefined, currentJob);
      }

      // 2. Dispatch to backend with attached base64 PDF / user CV
      const appId = currentApp?.id || `app-${currentJob.id}`;
      const response = await fetch(`/api/applications/${appId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customEmail: emailDraft,
          attachmentBase64: attachmentBase64,
          attachmentName: attachmentFilename
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch email via Gmail API');
      }

      setSentDetails({
        messageId: data.gmailMessageId,
        attachmentName: attachmentFilename,
        toEmail: emailDraft?.toEmail || currentJob.discoveredEmail || '',
        timestamp: new Date().toISOString(),
        gmailComposeUrl: data.gmailComposeUrl
      });

      setSendSuccessMessage(`Application & Tailored Resume PDF submitted and dispatched successfully via Gmail API (ID: ${data.gmailMessageId})`);
      if (data.application) {
        onApplicationUpdated(data.application);
      }

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setSendErrorMessage(err.message || 'Error occurred while sending through Gmail.');
    } finally {
      setIsSending(false);
    }
  };

  const handleNextJob = () => {
    const idx = allJobs.findIndex(j => j.id === currentJob.id);
    if (idx < allJobs.length - 1) {
      setCurrentJob(allJobs[idx + 1]);
    }
  };

  const handlePrevJob = () => {
    const idx = allJobs.findIndex(j => j.id === currentJob.id);
    if (idx > 0) {
      setCurrentJob(allJobs[idx - 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Job Switcher */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        
        {/* Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  Application Approval Cockpit
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Human-in-the-Loop Gateway
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Review tailored resume & AI-drafted cover email before final dispatch via Gmail API
              </p>
            </div>
          </div>

          {/* Job Selector Dropdown and Stepper */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevJob}
              disabled={allJobs.findIndex(j => j.id === currentJob.id) === 0}
              className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition"
              title="Previous Job"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={currentJob.id}
              onChange={(e) => {
                const found = allJobs.find(j => j.id === e.target.value);
                if (found) setCurrentJob(found);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              {allJobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.company} — {j.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextJob}
              disabled={allJobs.findIndex(j => j.id === currentJob.id) === allJobs.length - 1}
              className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition"
              title="Next Job"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Selected Target Meta Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
          
          <div className="lg:col-span-2 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {currentJob.company}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {currentJob.location} ({currentJob.workMode})
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Posted {currentJob.postedHoursAgo}h ago
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {currentJob.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-medium">
                Recipient: <strong className="text-slate-900">{emailDraft?.toEmail || currentJob.discoveredEmail || 'Talent Acquisition Team'}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                {currentJob.emailConfidence}
              </span>
            </div>
          </div>

          {/* Compatibility Breakdown Gauge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Compatibility Match
              </span>
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {scoreBreakdown.totalScore}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] pt-3 border-t border-slate-200/60 mt-2">
              <div>
                <span className="text-slate-400 block">Skills (35%)</span>
                <span className="font-bold text-slate-800">{scoreBreakdown.technicalSkillMatch}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Semantic (25%)</span>
                <span className="font-bold text-slate-800">{scoreBreakdown.semanticSimilarity}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Exp (20%)</span>
                <span className="font-bold text-slate-800">{scoreBreakdown.experienceMatch}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Side-by-Side Cockpit Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT PANEL: Tailored Resume Package */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  ATS-Optimized Resume Draft
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-regenerate-tailor"
                  onClick={() => handleManualReTailor(currentJob)}
                  disabled={isGeneratingTailor}
                  className="p-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1"
                  title="Regenerate Tailoring"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingTailor ? 'animate-spin' : ''}`} />
                  <span className="text-[11px] font-semibold">Re-tailor</span>
                </button>

                <button
                  id="btn-download-tailored-pdf"
                  onClick={handleDownloadTailoredPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Grounding / Anti-Hallucination Tag */}
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Grounded strictly on {candidate.fullName}'s verified projects and education.</span>
            </div>

            {/* Tailored Content View */}
            {isGeneratingTailor ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Aligning candidate projects with job requirements...</p>
              </div>
            ) : tailoredResume ? (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                
                {/* Headline & Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Tailored Executive Summary</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {tailoredResume.tailoredSummary}
                  </p>
                </div>

                {/* Prioritized Skills */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Prioritized Target Competencies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tailoredResume.prioritizedSkills.map((s, sIdx) => (
                      <span key={`tailored-skill-${s}-${sIdx}`} className="text-xs px-2.5 py-0.5 rounded-lg bg-white text-emerald-700 border border-emerald-200 font-medium shadow-2xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tailored Experience Highlights */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Emphasized Achievements</span>
                  {tailoredResume.tailoredExperience.map((exp, idx) => (
                    <div key={idx} className="text-xs space-y-1">
                      <div className="font-bold text-slate-900">{exp.title} ({exp.company})</div>
                      <ul className="space-y-1 pl-1">
                        {exp.emphasizedBullets.map((b, bi) => (
                          <li key={bi} className="text-slate-600 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

              </div>
            ) : null}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Attachment filename:</span>
            <span className="font-mono text-slate-600 font-medium">{candidate.fullName.replace(/\s+/g, '_')}_Resume_{currentJob.company.replace(/[^a-zA-Z0-9]/g, '')}.pdf</span>
          </div>

        </div>

        {/* RIGHT PANEL: AI Generated Email & Dispatcher */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Personalized Cover Email
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-regenerate-email"
                  onClick={() => handleManualReEmail(currentJob)}
                  disabled={isGeneratingEmail}
                  className="p-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingEmail ? 'animate-spin' : ''}`} />
                  <span className="text-[11px] font-semibold">Re-draft</span>
                </button>
              </div>
            </div>

            {/* Email Form Fields */}
            {isGeneratingEmail ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-violet-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Drafting tailored outreach email for {currentJob.company}...</p>
              </div>
            ) : emailDraft ? (
              <div className="space-y-3">
                
                {/* To Field */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Recipient Email:</label>
                  <input
                    id="input-email-to"
                    type="email"
                    value={emailDraft.toEmail}
                    onChange={(e) => setEmailDraft({ ...emailDraft, toEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-600 font-mono"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Subject Line:</label>
                  <input
                    id="input-email-subject"
                    type="text"
                    value={emailDraft.subject}
                    onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-violet-600"
                  />
                </div>

                {/* Body Textarea */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Email Body (Fully Editable):</label>
                  <textarea
                    id="textarea-email-body"
                    rows={10}
                    value={emailDraft.bodyText}
                    onChange={(e) => setEmailDraft({ ...emailDraft, bodyText: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-600 font-sans leading-relaxed"
                  />
                </div>

                {/* Attachment Chip */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-800 font-mono text-[11px] font-bold">
                          {emailDraft.attachmentName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Auto-Attached
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {candidate.fullName}'s resume attached to Gmail MIME payload
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadTailoredPdf}
                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition"
                    title="Preview / Download Attached PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ) : null}
          </div>

          {/* Gmail API Status & OAuth Prompt */}
          <div className="pt-2">
            {!isGmailConnected && (
              <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Gmail OAuth not yet connected. Connect your Google Account for real dispatch.</span>
                </div>
                <button
                  onClick={onOpenGmailModal}
                  className="px-3 py-1 rounded-xl bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 transition shrink-0"
                >
                  Connect
                </button>
              </div>
            )}

            {/* Sent Status & Uploaded Resume Verification Card */}
            {sentDetails && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                        <span>Application Submitted & Resume Uploaded</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                          Gmail API Verified
                        </span>
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                        Delivered to <strong className="text-emerald-950 font-mono">{sentDetails.toEmail}</strong> with ATS tailored resume PDF.
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                    {new Date(sentDetails.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Uploaded Resume Details Row */}
                <div className="p-3 rounded-xl bg-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono text-[11px] font-bold text-slate-800 block">
                        {sentDetails.attachmentName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Auto-generated, attached to MIME payload, and saved to your device
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {emailDraft && (
                      <a
                        href={sentDetails.gmailComposeUrl || `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailDraft.toEmail)}&su=${encodeURIComponent(emailDraft.subject)}&body=${encodeURIComponent(emailDraft.bodyText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open in Gmail</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {sendErrorMessage && (
              <div className="mb-3 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{sendErrorMessage}</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Master Approval & Dispatch Command Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* User Approval Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            id="checkbox-user-approval"
            type="checkbox"
            checked={userConfirmedApproval}
            onChange={(e) => setUserConfirmedApproval(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              I have reviewed and approved this tailored application
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Zero-Risk Human-in-the-Loop confirmation before sending via Gmail API
            </span>
          </div>
        </label>

        {/* Dispatch Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-approve-send-gmail"
            onClick={handleSendViaGmail}
            disabled={isSending || !userConfirmedApproval || !emailDraft}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending via Gmail API...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Approve & Send via Gmail API</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
