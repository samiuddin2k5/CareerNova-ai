import React, { useState } from 'react';
import { 
  CandidateProfile
} from '../types';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FolderGit2, 
  Cpu, 
  Database, 
  Layers, 
  Terminal, 
  MapPin, 
  Mail, 
  Phone,
  Upload
} from 'lucide-react';
import { downloadResumePdf } from '../lib/pdfGenerator';

interface ResumeProfileViewProps {
  profile: CandidateProfile;
  onUpdateProfile: (profile: CandidateProfile) => void;
  onOpenUploadModal: () => void;
}

export const ResumeProfileView: React.FC<ResumeProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenUploadModal
}) => {
  const handleDownloadOriginalPdf = () => {
    downloadResumePdf(profile);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-xs shrink-0">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Master Record
                </span>
              </div>

              <p className="text-sm font-semibold text-emerald-700 mt-1">
                {profile.title}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  ⚡ {profile.yearsOfExperience} Years Track Record
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-reupload-resume"
              onClick={onOpenUploadModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Update Resume</span>
            </button>

            <button
              id="btn-download-pdf"
              onClick={handleDownloadOriginalPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ATS PDF</span>
            </button>
          </div>

        </div>

        {/* Target Roles Banner */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">Targeted Roles:</span>
            <div className="flex gap-1.5 flex-wrap">
              {profile.targetRoles.map(role => (
                <span key={role} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-semibold text-[11px]">
                  {role}
                </span>
              ))}
            </div>
          </div>
          <span className="text-slate-400 text-xs">
            Source File: <span className="text-slate-700 font-mono font-medium">{profile.originalFileName || `${(profile.fullName || 'Candidate').replace(/\s+/g, '_')}_CV.pdf`}</span>
          </span>
        </div>

      </div>

      {/* Summary Box */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Candidate Executive Summary
          </h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-normal">
          {profile.summary}
        </p>
      </div>

      {/* Skills Matrix Grid */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            Verified Technical Skills Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Directly parsed and verified against Karachi & Pakistan remote tech market benchmarks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          
          {/* Programming Languages */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800">
              <Terminal className="w-4 h-4 text-sky-600" />
              <span>Programming Languages</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.programmingLanguages.map((s, i) => (
                <span key={`lang-${s}-${i}`} className="px-2.5 py-1 rounded-xl bg-white text-sky-800 text-xs font-medium border border-sky-200/80 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Frameworks & Web */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Web & App Frameworks</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.frameworks.map((s, i) => (
                <span key={`framework-${s}-${i}`} className="px-2.5 py-1 rounded-xl bg-white text-emerald-800 text-xs font-medium border border-emerald-200/80 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* AI & ML */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>AI, LLMs & Vector Tech</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.aiMlTech.map((s, i) => (
                <span key={`aiml-${s}-${i}`} className="px-2.5 py-1 rounded-xl bg-white text-violet-800 text-xs font-medium border border-violet-200/80 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Databases */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800">
              <Database className="w-4 h-4 text-amber-600" />
              <span>Databases & Storage</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.databases.map((s, i) => (
                <span key={`db-${s}-${i}`} className="px-2.5 py-1 rounded-xl bg-white text-amber-800 text-xs font-medium border border-amber-200/80 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Cloud & DevOps */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Cloud & DevOps</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.cloudDevOps.map((s, i) => (
                <span key={`cloud-${s}-${i}`} className="px-2.5 py-1 rounded-xl bg-white text-indigo-800 text-xs font-medium border border-indigo-200/80 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Tools & Utilities */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800">
              <Terminal className="w-4 h-4 text-slate-600" />
              <span>Engineering Tools</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.tools.map((s, i) => (
                <span key={`tool-${s}-${i}`} className="px-2.5 py-1 rounded-xl bg-white text-slate-700 text-xs font-medium border border-slate-200 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Experience & Projects Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Work Experience */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            Verified Professional Experience
          </h2>

          <div className="space-y-4">
            {profile.experience.map(exp => (
              <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {exp.duration}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>

                <ul className="space-y-1.5 mt-2">
                  {exp.achievements.map((ach, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-600 mt-0.5 font-bold">•</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1 pt-2">
                  {exp.technologiesUsed.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-lg bg-white text-slate-600 border border-slate-200 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Projects & Credentials */}
        <div className="space-y-6">
          
          {/* Projects */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <FolderGit2 className="w-4 h-4 text-emerald-600" />
              Demonstrated Projects
            </h2>

            <div className="space-y-3.5">
              {profile.projects.map(p => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    <div className="flex gap-1">
                      {p.techStack.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Education & Certifications
            </h2>

            <div className="space-y-3">
              {profile.education.map(edu => (
                <div key={edu.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-[11px] text-slate-500">{edu.institution} • {edu.location}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700">{edu.year}</span>
                </div>
              ))}

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Certifications & Credentials</span>
                </div>
                <div className="space-y-1.5">
                  {profile.certifications.map((c, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {profile.achievements && profile.achievements.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Key Achievements & Competition Wins</span>
                  </div>
                  <div className="space-y-1.5">
                    {profile.achievements.map((ach, i) => (
                      <div key={`ach-${i}`} className="text-xs text-slate-800 flex items-start gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <span className="text-amber-600 font-bold shrink-0">🏆</span>
                        <span className="font-semibold text-[11px] leading-tight">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
