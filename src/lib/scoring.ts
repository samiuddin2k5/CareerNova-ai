import { CandidateProfile, JobPosting, CompatibilityScoreBreakdown } from '../types';

// Canonical skill normalizer
export function normalizeSkill(skill: string): string {
  const s = skill.trim().toLowerCase();
  if (s.includes('react')) return 'React.js';
  if (s.includes('next')) return 'Next.js';
  if (s.includes('node')) return 'Node.js';
  if (s.includes('express')) return 'Express.js';
  if (s.includes('typescript') || s === 'ts') return 'TypeScript';
  if (s.includes('javascript') || s === 'js') return 'JavaScript';
  if (s.includes('python') || s === 'py') return 'Python';
  if (s.includes('fastapi')) return 'FastAPI';
  if (s.includes('django')) return 'Django';
  if (s.includes('postgres') || s.includes('psql') || s.includes('pgvector')) return 'PostgreSQL';
  if (s.includes('mongo')) return 'MongoDB';
  if (s.includes('docker')) return 'Docker';
  if (s.includes('aws') || s.includes('amazon web services')) return 'AWS';
  if (s.includes('git') && !s.includes('digital')) return 'Git';
  if (s.includes('tailwind')) return 'Tailwind CSS';
  if (s.includes('rest') || s.includes('api')) return 'REST APIs';
  if (s.includes('langchain') || s.includes('langgraph')) return 'LangChain';
  if (s.includes('rag') || s.includes('retrieval-augmented')) return 'RAG';
  if (s.includes('llm') || s.includes('large language')) return 'LLMs';
  if (s.includes('vector') || s.includes('chroma') || s.includes('pinecone') || s.includes('qdrant')) return 'Vector Databases';
  if (s.includes('pytorch')) return 'PyTorch';
  if (s.includes('tensorflow')) return 'TensorFlow';
  if (s.includes('scikit') || s.includes('sklearn')) return 'Scikit-learn';
  if (s.includes('nlp') || s.includes('natural language')) return 'NLP';
  if (s.includes('computer vision') || s.includes('opencv') || s.includes('yolo')) return 'Computer Vision';
  if (s.includes('generative ai') || s.includes('genai')) return 'Generative AI';
  if (s.includes('redis')) return 'Redis';
  return skill.trim();
}

export function extractAllCandidateSkills(candidate: CandidateProfile): Set<string> {
  const set = new Set<string>();
  const add = (arr?: string[]) => {
    if (!arr) return;
    arr.forEach(item => {
      set.add(normalizeSkill(item));
      set.add(item.trim());
    });
  };

  add(candidate.skills.programmingLanguages);
  add(candidate.skills.frameworks);
  add(candidate.skills.aiMlTech);
  add(candidate.skills.databases);
  add(candidate.skills.cloudDevOps);
  add(candidate.skills.tools);

  // Also harvest from experience and projects
  candidate.experience.forEach(exp => {
    add(exp.technologiesUsed);
  });
  candidate.projects.forEach(proj => {
    add(proj.techStack);
  });

  return set;
}

export function calculateCompatibilityScore(
  candidate: CandidateProfile,
  job: JobPosting
): CompatibilityScoreBreakdown {
  const candidateSkillsSet = extractAllCandidateSkills(candidate);
  const normalizedCandidateSkills = Array.from(candidateSkillsSet).map(s => s.toLowerCase());

  // 1. Technical Skill Match (35%)
  const requiredSkills = job.requiredSkills || [];
  const preferredSkills = job.preferredSkills || [];

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  let requiredMatchedCount = 0;
  for (const skill of requiredSkills) {
    const norm = normalizeSkill(skill).toLowerCase();
    const raw = skill.toLowerCase();
    const isMatch = normalizedCandidateSkills.some(cs => cs === norm || cs === raw || cs.includes(raw) || raw.includes(cs));
    if (isMatch) {
      matchedSkills.push(skill);
      requiredMatchedCount++;
    } else {
      missingSkills.push(skill);
    }
  }

  let preferredMatchedCount = 0;
  for (const skill of preferredSkills) {
    const norm = normalizeSkill(skill).toLowerCase();
    const raw = skill.toLowerCase();
    const isMatch = normalizedCandidateSkills.some(cs => cs === norm || cs === raw || cs.includes(raw) || raw.includes(cs));
    if (isMatch && !matchedSkills.includes(skill)) {
      matchedSkills.push(skill);
      preferredMatchedCount++;
    }
  }

  const reqRatio = requiredSkills.length > 0 ? requiredMatchedCount / requiredSkills.length : 1;
  const prefRatio = preferredSkills.length > 0 ? preferredMatchedCount / preferredSkills.length : 0.5;
  // Weighted: Required is 85%, Preferred is 15%
  const rawTechScore = (reqRatio * 0.85 + prefRatio * 0.15) * 100;
  const technicalSkillMatch = Math.round(Math.min(100, Math.max(0, rawTechScore)));

  // 2. Semantic Similarity (25%)
  // Compare candidate resume descriptions/achievements with job requirements and description
  const candidateCorpus = [
    candidate.summary,
    ...candidate.experience.map(e => `${e.title} ${e.description} ${e.achievements.join(' ')}`),
    ...candidate.projects.map(p => `${p.name} ${p.description} ${p.highlights.join(' ')}`),
    ...candidate.certifications
  ].join(' ').toLowerCase();

  const jobCorpusWords = (job.description + ' ' + job.requirements.join(' '))
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['with', 'from', 'have', 'must', 'will', 'that', 'this', 'your', 'working', 'years', 'experience', 'strong'].includes(w));

  const uniqueJobTerms = Array.from(new Set(jobCorpusWords));
  let semanticHits = 0;
  for (const term of uniqueJobTerms) {
    if (candidateCorpus.includes(term)) {
      semanticHits++;
    }
  }
  const semanticRatio = uniqueJobTerms.length > 0 ? Math.min(1, (semanticHits / (uniqueJobTerms.length * 0.45))) : 0.8;
  const semanticSimilarity = Math.round(semanticRatio * 100);

  // 3. Experience Match (20%)
  const candidateYears = candidate.yearsOfExperience || 2.5;
  let requiredYears = 0;
  let experienceMatch = 100;

  if (job.isInternship || job.roleCategory === 'Internship' || job.experienceRequired.toLowerCase().includes('fresh') || job.experienceRequired.toLowerCase().includes('intern')) {
    experienceMatch = 100;
    requiredYears = 0;
  } else {
    requiredYears = 3;
    if (job.experienceRequired.includes('4-7')) requiredYears = 4.5;
    else if (job.experienceRequired.includes('3-6')) requiredYears = 3.5;
    else if (job.experienceRequired.includes('3-8')) requiredYears = 4;
    else if (job.experienceRequired.includes('3-5')) requiredYears = 3;
    else if (job.experienceRequired.includes('2-5')) requiredYears = 2.5;
    else if (job.experienceRequired.includes('2-4')) requiredYears = 2;

    if (candidateYears >= requiredYears) {
      experienceMatch = 100;
    } else {
      experienceMatch = Math.max(50, Math.round((candidateYears / requiredYears) * 100));
    }
  }

  // 4. Required Qualification Match (10%)
  let qualScore = 95; // fast-nuces BSCS is highly recognized
  const hasDegree = candidate.education.some(e => e.degree.toLowerCase().includes('computer') || e.degree.toLowerCase().includes('bscs') || e.degree.toLowerCase().includes('science'));
  if (hasDegree) qualScore = 100;
  else qualScore = 80;
  const qualificationMatch = qualScore;

  // 5. Job Role Match (10%)
  let roleMatch = 85;
  const isTargetRole = candidate.targetRoles.includes(job.roleCategory) || (job.isInternship && (candidate.targetRoles.includes('Full Stack Developer') || candidate.targetRoles.includes('AI Engineer')));
  if (isTargetRole) {
    roleMatch = 100;
  } else {
    roleMatch = 75;
  }

  // Deterministic Total Weighted Calculation
  const totalScore = Math.round(
    (technicalSkillMatch * 0.35) +
    (semanticSimilarity * 0.25) +
    (experienceMatch * 0.20) +
    (qualificationMatch * 0.10) +
    (roleMatch * 0.10)
  );

  // Strengths and Gaps determination
  const keyStrengths: string[] = [];
  if (matchedSkills.length > 0) {
    keyStrengths.push(`Matches core tech stack: ${matchedSkills.slice(0, 4).join(', ')}`);
  }
  if (candidateYears >= requiredYears) {
    keyStrengths.push(`Solid experience tenure (${candidateYears} yrs vs ${job.experienceRequired} requested)`);
  }
  if (job.workMode === 'On-site' && candidate.location.toLowerCase().includes('karachi')) {
    keyStrengths.push(`Direct local presence in Karachi, Pakistan for on-site collaboration`);
  } else if (job.workMode === 'Remote') {
    keyStrengths.push(`Demonstrated autonomous remote engineering capabilities and async workflow`);
  }

  const potentialGaps: string[] = [];
  if (missingSkills.length > 0) {
    potentialGaps.push(`Secondary skill requirements to clarify: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (candidateYears < requiredYears) {
    potentialGaps.push(`Slightly below upper experience threshold (${candidateYears} yrs vs ${job.experienceRequired})`);
  }

  // AI / Deterministic Recommendation
  let aiRecommendation = '';
  if (totalScore >= 85) {
    aiRecommendation = `Strong Match: Candidate possesses deep verified expertise in ${matchedSkills.slice(0, 3).join(', ')}. Highly recommended to submit tailored application via ${job.discoveredEmail ? 'direct email to ' + job.discoveredEmail : 'official career portal'}.`;
  } else if (totalScore >= 70) {
    aiRecommendation = `Competitive Match: Strong core alignment with ${job.company}'s requirements. Tailoring the resume to highlight ${matchedSkills.slice(0, 2).join(' & ')} will maximize interview probability.`;
  } else {
    aiRecommendation = `Moderate Match: Applicable role with partial skill crossover. Emphasize transferable achievements in project delivery.`;
  }

  return {
    technicalSkillMatch,
    semanticSimilarity,
    experienceMatch,
    qualificationMatch,
    roleMatch,
    totalScore,
    matchedSkills,
    missingSkills,
    keyStrengths,
    potentialGaps,
    aiRecommendation
  };
}
