import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Download, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Eye, 
  Copy, 
  Clock, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { CandidateProfile, JobPosting, ApplicationRecord } from '../types';
import { generateResumePdf } from '../lib/pdfGenerator';

interface AIResumeVersionsViewProps {
  candidate: CandidateProfile;
  jobs: JobPosting[];
  applications: ApplicationRecord[];
  onSelectJobForApproval: (job: JobPosting) => void;
  onOpenUploadModal: () => void;
}

export const AIResumeVersionsView: React.FC<AIResumeVersionsViewProps> = ({
  candidate,
  jobs,
  applications,
  onSelectJobForApproval,
  onOpenUploadModal
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [activeVersionJob, setActiveVersionJob] = useState<JobPosting | null>(jobs[0] || null);

  const companies = ['All', ...Array.from(new Set(jobs.map(j => j.company)))];

  const filteredJobs = selectedCompany === 'All' 
    ? jobs 
    : jobs.filter(j => j.company === selectedCompany);

  const handleDownload = (job: JobPosting) => {
    const { dataUrl, filename } = generateResumePdf(candidate, undefined, job);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anti-Hallucination ATS Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI-Tailored Resume Versions
          </h1>
          <p className="text-xs sm:text-sm text-violet-100 font-medium mt-2 leading-relaxed">
            Every application package includes an automated, truth-grounded resume tailored to the exact requirements, tech stack, and keywords of target employers like Systems Limited, 10Pearls, Folio3, and Devsinc.
          </p>
        </div>
      </div>

      {/* Main Grid: Left version selector, right live resume preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: List of Tailored Versions */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Generated Versions ({filteredJobs.length})
            </h2>

            {/* Company filter */}
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700"
            >
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredJobs.map((job) => {
              const isSelected = activeVersionJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setActiveVersionJob(job)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-50/80 border-violet-300 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {job.company}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ATS Verified
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700 truncate">
                    {job.title}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100/80 text-[11px]">
                    <span className="text-slate-400 font-mono">
                      v2.4 • {job.requiredSkills.length} Keywords Aligned
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(job);
                      }}
                      className="text-violet-700 hover:text-violet-900 font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right column: Interactive Resume Preview Document */}
        <div className="lg:col-span-7">
          {activeVersionJob ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              
              {/* Top Document Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      Target: {activeVersionJob.company}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                      {activeVersionJob.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    File payload: {candidate.fullName.replace(/\s+/g, '_')}_Resume_{activeVersionJob.company.replace(/\s+/g, '')}.pdf
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(activeVersionJob)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => onSelectJobForApproval(activeVersionJob)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition flex items-center gap-1.5 active:scale-95"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open in Cockpit</span>
                  </button>
                </div>
              </div>

              {/* Resume Document Layout (Simulated ATS Document) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 font-sans space-y-6 text-slate-800">
                
                {/* Header info */}
                <div className="text-center pb-4 border-b border-slate-200">
                  <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                    {candidate.fullName}
                  </h2>
                  <p className="text-xs font-bold text-violet-700 mt-0.5">
                    {activeVersionJob.title} • Software Engineer
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    {candidate.email} | {candidate.phone} | {candidate.location}
                  </p>
                </div>

                {/* Professional Summary tailored */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Professional Summary
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700">
                    Results-driven Software Engineer with extensive experience in modern web architecture (React.js, Next.js, TypeScript, Node.js) and applied Artificial Intelligence (Agentic AI, n8n, LLM RAG pipelines). Award-winning developer with 1st and 2nd position accolades in AI emergency dispatch and computer vision systems. Proven ability to build performant, mission-critical systems aligned directly with {activeVersionJob.company}'s engineering objectives.
                  </p>
                </div>

                {/* Technical Skills tailored */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Prioritized Technical Skills
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">Languages & Frameworks: </span>
                      <span className="text-slate-700">React.js, Next.js, TypeScript, JavaScript, Python, Node.js, Express.js</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">AI & Workflow Automation: </span>
                      <span className="text-slate-700">Agentic AI, n8n Automation, Generative AI, RAG, PyTorch, LangChain</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Databases & Cloud: </span>
                      <span className="text-slate-700">MongoDB, PostgreSQL, MySQL, Docker, AWS EC2, Git, REST APIs</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Design & UI: </span>
                      <span className="text-slate-700">Tailwind CSS, Figma, Responsive Web Design</span>
                    </div>
                  </div>
                </div>

                {/* Key Projects tailored */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Featured Engineering Projects
                  </h3>

                  {candidate.projects.slice(0, 2).map((p, i) => (
                    <div key={p.id} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        <span className="text-[11px] font-mono text-violet-700">{p.techStack.join(', ')}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{p.description}</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-700">
                        {p.highlights.map((h, idx) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Education
                  </h3>
                  {candidate.education.map((e) => (
                    <div key={e.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{e.degree}</span>
                        <span className="text-slate-600"> — {e.institution} ({e.location})</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-700">{e.gradeOrGpa || e.year}</span>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500">
              Select a tailored version on the left to preview.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
