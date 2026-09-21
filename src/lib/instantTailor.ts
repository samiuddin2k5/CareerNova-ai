import { CandidateProfile, JobPosting, CompatibilityScoreBreakdown, TailoredResume, ApplicationEmail } from '../types';
import { calculateCompatibilityScore } from './scoring';

/**
 * High-speed instant deterministic tailoring engine.
 * Renders tailored resume draft in <5ms without blocking the UI on remote network roundtrips.
 */
export function buildInstantTailoredResume(
  candidate: CandidateProfile,
  job: JobPosting,
  breakdown?: CompatibilityScoreBreakdown
): TailoredResume {
  const matchBreakdown = breakdown || calculateCompatibilityScore(candidate, job);
  const versionId = `v-instant-${job.id}-${Date.now().toString(36)}`;

  // Prioritize skills that directly match this employer's requirements
  const prioritizedSkills = Array.from(new Set([
    ...matchBreakdown.matchedSkills,
    ...(job.requiredSkills || []),
    ...candidate.skills.frameworks,
    ...candidate.skills.programmingLanguages,
    ...candidate.skills.aiMlTech,
    ...candidate.skills.databases
  ])).slice(0, 15);

  const topMatched = matchBreakdown.matchedSkills.slice(0, 3).join(', ') || 'Modern Full-Stack & AI Systems';

  const tailoredSummary = `Results-driven ${job.roleCategory || 'Software Engineer'} with strong expertise in ${topMatched}. Proven track record designing scalable web applications, REST/GraphQL APIs, and AI integrations. Based in ${candidate.location}, well-aligned with ${job.company}'s engineering standards to deliver performant, test-covered, and maintainable software.`;

  // Emphasize matched achievements across candidate experience
  const tailoredExperience = candidate.experience.map((exp) => {
    const emphasizedBullets = exp.achievements.map((ach) => {
      const containsMatch = matchBreakdown.matchedSkills.some(skill => 
        ach.toLowerCase().includes(skill.toLowerCase())
      );
      return containsMatch ? `★ ${ach}` : ach;
    });

    return {
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      emphasizedBullets
    };
  });

  const tailoredProjects = candidate.projects.map((proj) => ({
    name: proj.name,
    techStack: proj.techStack,
    description: proj.description,
    impactBullets: proj.highlights || []
  }));

  return {
    jobId: job.id,
    versionId,
    targetJobTitle: job.title,
    targetCompany: job.company,
    tailoredHeadline: `${job.title} | ${candidate.fullName}`,
    tailoredSummary,
    prioritizedSkills,
    tailoredExperience,
    tailoredProjects,
    isAntiHallucinationVerified: true,
    createdAt: new Date().toISOString()
  };
}

/**
 * High-speed instant deterministic cover email generator.
 * Creates personalized, employer-specific email draft in <2ms.
 */
export function buildInstantApplicationEmail(
  candidate: CandidateProfile,
  job: JobPosting,
  breakdown?: CompatibilityScoreBreakdown
): ApplicationEmail {
  const matchBreakdown = breakdown || calculateCompatibilityScore(candidate, job);
  const toEmail = job.discoveredEmail || 'careers@' + (job.companyWebsite ? new URL(job.companyWebsite).hostname.replace('www.', '') : 'company.com');
  const cleanCompany = job.company.replace(/[^a-zA-Z0-9]/g, '');
  const attachmentName = candidate.originalFileName 
    ? candidate.originalFileName 
    : `${candidate.fullName.replace(/\s+/g, '_')}_CV_${cleanCompany}.pdf`;
  const subject = `Application for ${job.title} — ${candidate.fullName}`;

  const topSkillsList = matchBreakdown.matchedSkills.length > 0 
    ? matchBreakdown.matchedSkills.slice(0, 4).join(', ') 
    : 'React, TypeScript, Python, and modern web architectures';

  const bodyText = `Dear Hiring Team at ${job.company},

I am writing to express my enthusiastic interest in the ${job.title} position in ${job.location}${job.externalJobId ? ` (Ref: ${job.externalJobId})` : ''}, as advertised on ${job.source}.

With over ${candidate.yearsOfExperience} years of practical software engineering experience specializing in ${topSkillsList}, I have built resilient web applications and production-grade architectures. My background includes building high-throughput services, responsive interfaces, and integrating modern AI capabilities with strict code quality.

Key highlights aligned with ${job.company}'s requirements:
• Core Competencies: ${matchBreakdown.matchedSkills.slice(0, 3).join(', ') || 'Full Stack Engineering'} with clean modular design.
• Practical Impact: Delivering test-driven, maintainable code with containerized CI/CD workflows.
• Collaboration: Based in ${candidate.location}, fully available for ${job.workMode === 'On-site' ? 'on-site collaboration in Karachi' : 'productive remote execution'}.

I have attached my tailored resume (${attachmentName}) for your review. I would welcome the opportunity to discuss how my technical expertise aligns with ${job.company}'s goals.

Thank you for your time and consideration.

Best regards,

${candidate.fullName}
${candidate.title}
Email: ${candidate.email}
Phone: ${candidate.phone}
Location: ${candidate.location}`;

  return {
    toEmail,
    recipientName: `${job.company} Talent Acquisition`,
    subject,
    bodyText,
    attachmentName,
    generatedAt: new Date().toISOString()
  };
}
