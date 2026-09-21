export type WorkMode = 'On-site' | 'Remote' | 'Hybrid';
export type TargetRole = 
  | 'Full Stack Developer' 
  | 'AI Engineer' 
  | 'Frontend Developer' 
  | 'Backend Developer' 
  | 'Software Engineer' 
  | 'DevOps & Cloud Engineer'
  | 'Cybersecurity Specialist'
  | 'Data Scientist'
  | 'Mobile App Developer'
  | 'Mechanical Engineer'
  | 'Mechanical Design Engineer'
  | 'HVAC & Thermal Engineer'
  | 'Robotics & Automation Engineer'
  | 'Electrical Engineer'
  | 'Embedded Systems Engineer'
  | 'Electronics Engineer'
  | 'Power Systems Engineer'
  | 'Medical Doctor / Physician'
  | 'Medical Officer / Resident'
  | 'Biomedical Engineer'
  | 'Pharmacist'
  | 'Healthcare Specialist'
  | 'Civil Engineer'
  | 'Structural Engineer'
  | 'Product Manager'
  | 'Internship'
  | (string & {});
export type JobSource = 'LinkedIn' | 'Indeed' | 'Glassdoor' | 'Rozee.pk' | 'Direct Careers';
export type EmploymentType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract';

export type ContactConfidence = 
  | 'Verified Official Careers Email' 
  | 'Official Company Contact' 
  | 'No Verified Email Found';

export type ApplicationStatus = 
  | 'Recommended'
  | 'Analyzed'
  | 'Resume Enhanced'
  | 'Email Ready'
  | 'Awaiting Approval'
  | 'Approved'
  | 'Sent'
  | 'Application Submitted'
  | 'Interview'
  | 'Rejected'
  | 'Withdrawn'
  | 'Follow-up Required';

export interface CandidateSkills {
  programmingLanguages: string[];
  frameworks: string[];
  aiMlTech: string[];
  databases: string[];
  cloudDevOps: string[];
  tools: string[];
}

export interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologiesUsed: string[];
}

export interface CandidateProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  highlights: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface CandidateEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  gradeOrGpa?: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  yearsOfExperience: number;
  targetRoles: TargetRole[];
  skills: CandidateSkills;
  experience: CandidateExperience[];
  projects: CandidateProject[];
  education: CandidateEducation[];
  certifications: string[];
  achievements: string[];
  rawResumeText?: string;
  originalFileName?: string;
  cvDataUrl?: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  country?: string;
  city?: string;
  workMode: WorkMode;
  roleCategory: TargetRole;
  employmentType?: EmploymentType;
  isInternship?: boolean;
  internshipDuration?: string;
  stipend?: string;
  internshipStipend?: string;
  perks?: string[];
  internshipBatch?: string;
  source: JobSource;
  externalJobId: string;
  postedDate: string;
  postedHoursAgo: number;
  isWithin48Hours: boolean;
  isKarachiOrRemotePK: boolean;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequired: string;
  salaryRange?: string;
  applicationUrl: string;
  directApplyRequired: boolean;
  companyWebsite?: string;
  discoveredEmail?: string;
  emailSource?: string;
  emailConfidence: ContactConfidence;
}

export interface CompatibilityScoreBreakdown {
  technicalSkillMatch: number; // 35%
  semanticSimilarity: number;   // 25%
  experienceMatch: number;      // 20%
  qualificationMatch: number;   // 10%
  roleMatch: number;            // 10%
  totalScore: number;           // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  keyStrengths: string[];
  potentialGaps: string[];
  aiRecommendation: string;
}

export interface TailoredResume {
  jobId: string;
  versionId: string;
  targetJobTitle: string;
  targetCompany: string;
  tailoredHeadline: string;
  tailoredSummary: string;
  prioritizedSkills: string[];
  tailoredExperience: {
    title: string;
    company: string;
    duration: string;
    emphasizedBullets: string[];
  }[];
  tailoredProjects: {
    name: string;
    techStack: string[];
    description: string;
    impactBullets: string[];
  }[];
  isAntiHallucinationVerified: boolean;
  createdAt: string;
}

export interface ApplicationEmail {
  toEmail: string;
  recipientName?: string;
  subject: string;
  bodyText: string;
  attachmentName: string;
  generatedAt: string;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  jobId: string;
  company: string;
  jobTitle: string;
  location: string;
  workMode: WorkMode;
  jobSource: JobSource;
  jobUrl: string;
  compatibilityScore: number;
  scoreBreakdown: CompatibilityScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  tailoredResume?: TailoredResume;
  applicationEmail?: ApplicationEmail;
  discoveredEmail?: string;
  emailSource?: string;
  emailConfidence: ContactConfidence;
  directApplyRequired: boolean;
  status: ApplicationStatus;
  userApproved: boolean;
  gmailMessageId?: string;
  sentTimestamp?: string;
  appliedDate?: string;
  followUpDueDate?: string;
  followUpStatus?: 'Pending' | 'Followed Up' | 'Not Needed';
  followUpEmailDraft?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerAnalytics {
  totalJobsRetrieved: number;
  jobsPassing48hFilter: number;
  karachiOnsiteJobs: number;
  pakistanRemoteJobs: number;
  fullStackMatches: number;
  aiEngineerMatches: number;
  averageCompatibilityScore: number;
  highMatchCount: number; // >= 80%
  awaitingApprovalCount: number;
  sentApplicationsCount: number;
  interviewCount: number;
  rejectedCount: number;
  responseRatePercent: number;
}

export interface UserSearchPreferences {
  targetRole: TargetRole | string;
  targetRoles?: string[]; // Multiple target roles supported (e.g. ['DevOps & Cloud Engineer', 'Full Stack Developer'])
  targetLocations: string[];
  workModes: WorkMode[];
  experienceLevel: string;
  primarySkills: string[];
  employmentTypes: EmploymentType[];
  onlyWithin48Hours: boolean;
  minExpectedSalary?: string;
  autoTailorEnabled?: boolean;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  title: string;
  location: string;
  gmailConnected: boolean;
  gmailAddress: string;
  gmailAccessToken?: string | null;
  provider: 'google' | 'email' | 'guest';
  searchPreferences: UserSearchPreferences;
  cvFileName?: string;
  cvDataUrl?: string;
  cvFileContent?: string;
  createdAt: string;
}

