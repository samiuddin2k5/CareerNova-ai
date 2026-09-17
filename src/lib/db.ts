import {
  CandidateProfile,
  JobPosting,
  ApplicationRecord,
  CareerAnalytics,
  TargetRole,
  AuthUser,
  UserSearchPreferences
} from '../types';
import { INITIAL_JOB_POSTINGS, DEFAULT_CANDIDATE_PROFILE } from '../data/initialJobs';
import { calculateCompatibilityScore } from './scoring';

export const INITIAL_SEARCH_PREFS: UserSearchPreferences = {
  targetRole: 'Full Stack Developer',
  targetLocations: ['Worldwide / Global (All Locations)'],
  workModes: ['On-site', 'Remote', 'Hybrid'],
  experienceLevel: 'Entry / Fresh Graduate (0-1 yrs)',
  primarySkills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'Tailwind CSS', 'PostgreSQL'],
  employmentTypes: ['Full-time', 'Internship'],
  onlyWithin48Hours: true,
  minExpectedSalary: 'PKR 120,000+',
  autoTailorEnabled: true,
};

class DatabaseStore {
  private candidateProfile: CandidateProfile = { ...DEFAULT_CANDIDATE_PROFILE };
  private jobs: JobPosting[] = [...INITIAL_JOB_POSTINGS];
  private applications: ApplicationRecord[] = [];
  private gmailAccessToken: string | null = null;
  private gmailUserEmail: string | null = null;
  private apifyApiKey: string | null = process.env.APIFY_API_KEY || null;
  private searchPreferences: UserSearchPreferences = { ...INITIAL_SEARCH_PREFS };
  private authUser: AuthUser | null = null;
  private registeredUsers: Map<string, { user: AuthUser; password?: string }> = new Map();

  constructor() {
    this.seedInitialApplications();
    // Seed default user account
    const defaultUser: AuthUser = {
      id: 'usr_default_sami',
      fullName: 'Syed Samiuddin Ahmed',
      email: 'samiuddin2k5@gmail.com',
      title: 'Full Stack & AI Software Engineer',
      location: 'Global / Worldwide',
      gmailConnected: true,
      gmailAddress: 'samiuddin2k5@gmail.com',
      provider: 'email',
      searchPreferences: { ...INITIAL_SEARCH_PREFS },
      createdAt: new Date().toISOString()
    };
    this.registeredUsers.set(defaultUser.email.toLowerCase(), { user: defaultUser, password: 'password123' });
    this.authUser = null;
  }

  private seedInitialApplications() {
    // Generate initial evaluated applications for top matching jobs
    this.jobs.slice(0, 4).forEach((job, idx) => {
      const breakdown = calculateCompatibilityScore(this.candidateProfile, job);
      const statuses: ApplicationRecord['status'][] = [
        'Awaiting Approval',
        'Email Ready',
        'Sent',
        'Interview'
      ];

      const record: ApplicationRecord = {
        id: `app-${job.id}`,
        userId: this.candidateProfile.id,
        jobId: job.id,
        company: job.company,
        jobTitle: job.title,
        location: job.location,
        workMode: job.workMode,
        jobSource: job.source,
        jobUrl: job.applicationUrl,
        compatibilityScore: breakdown.totalScore,
        scoreBreakdown: breakdown,
        matchedSkills: breakdown.matchedSkills,
        missingSkills: breakdown.missingSkills,
        discoveredEmail: job.discoveredEmail,
        emailSource: job.emailSource,
        emailConfidence: job.emailConfidence,
        directApplyRequired: job.directApplyRequired,
        status: statuses[idx] || 'Recommended',
        userApproved: idx >= 2,
        gmailMessageId: idx === 2 ? 'msg_18e4f5a9b1c2d3e4' : undefined,
        sentTimestamp: idx === 2 ? new Date(Date.now() - 24 * 3600 * 1000).toISOString() : undefined,
        appliedDate: idx >= 2 ? new Date(Date.now() - 24 * 3600 * 1000).toISOString() : undefined,
        followUpDueDate: idx === 2 ? new Date(Date.now() + 3 * 86400 * 1000).toISOString() : undefined,
        followUpStatus: idx === 2 ? 'Pending' : 'Not Needed',
        createdAt: new Date(Date.now() - (idx + 1) * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.applications.push(record);
    });
  }

  // Profile operations
  getProfile(): CandidateProfile {
    return this.candidateProfile;
  }

  updateProfile(profile: Partial<CandidateProfile>): CandidateProfile {
    this.candidateProfile = {
      ...this.candidateProfile,
      ...profile,
      updatedAt: new Date().toISOString()
    };
    // Recalculate scores for existing applications
    this.recalculateAllApplications();
    return this.candidateProfile;
  }

  private recalculateAllApplications() {
    this.applications = this.applications.map(app => {
      const job = this.jobs.find(j => j.id === app.jobId);
      if (!job) return app;
      const breakdown = calculateCompatibilityScore(this.candidateProfile, job);
      return {
        ...app,
        compatibilityScore: breakdown.totalScore,
        scoreBreakdown: breakdown,
        matchedSkills: breakdown.matchedSkills,
        missingSkills: breakdown.missingSkills,
        updatedAt: new Date().toISOString()
      };
    });
  }

  // Job operations
  getJobs(filters?: {
    role?: TargetRole | 'All';
    workMode?: string;
    only48Hours?: boolean;
    country?: string;
    searchQuery?: string;
  }): JobPosting[] {
    return this.jobs.filter(job => {
      if (filters?.role && filters.role !== 'All') {
        if (job.roleCategory !== filters.role) return false;
      }
      if (filters?.workMode && filters.workMode !== 'All') {
        if (job.workMode !== filters.workMode) return false;
      }
      if (filters?.only48Hours) {
        if (!job.isWithin48Hours && job.postedHoursAgo > 48) return false;
      }
      if (filters?.country && filters.country !== 'All') {
        if (filters.country === 'Pakistan') {
          const isPK = job.isKarachiOrRemotePK || 
                       job.country === 'Pakistan' || 
                       job.location.toLowerCase().includes('pakistan') || 
                       job.location.toLowerCase().includes('karachi') || 
                       job.location.toLowerCase().includes('lahore') || 
                       job.location.toLowerCase().includes('islamabad');
          if (!isPK) return false;
        } else if (filters.country === 'Global Remote') {
          if (job.workMode !== 'Remote') return false;
        } else {
          const c = filters.country.toLowerCase();
          const match = (job.country || '').toLowerCase().includes(c) || job.location.toLowerCase().includes(c);
          if (!match) return false;
        }
      }
      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matches = 
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
          job.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  getJobById(id: string): JobPosting | undefined {
    return this.jobs.find(j => j.id === id);
  }

  addJobs(newJobs: JobPosting[]): { addedCount: number; duplicateCount: number } {
    let addedCount = 0;
    let duplicateCount = 0;

    for (const newJob of newJobs) {
      // Strict Deduplication Rule:
      // Check externalJobId, normalized applicationUrl, or company + title combination
      const isDuplicate = this.jobs.some(existing => {
        if (existing.externalJobId && existing.externalJobId === newJob.externalJobId) return true;
        if (existing.applicationUrl && existing.applicationUrl.toLowerCase() === newJob.applicationUrl.toLowerCase()) return true;
        if (existing.company.toLowerCase() === newJob.company.toLowerCase() &&
            existing.title.toLowerCase() === newJob.title.toLowerCase()) return true;
        return false;
      });

      if (isDuplicate) {
        duplicateCount++;
      } else {
        this.jobs.unshift(newJob);
        addedCount++;
      }
    }

    return { addedCount, duplicateCount };
  }

  // Application operations
  getApplications(): ApplicationRecord[] {
    return this.applications;
  }

  getApplicationById(id: string): ApplicationRecord | undefined {
    return this.applications.find(a => a.id === id);
  }

  getApplicationByJobId(jobId: string): ApplicationRecord | undefined {
    return this.applications.find(a => a.jobId === jobId);
  }

  saveApplication(record: ApplicationRecord): ApplicationRecord {
    const idx = this.applications.findIndex(a => a.id === record.id);
    if (idx >= 0) {
      this.applications[idx] = {
        ...record,
        updatedAt: new Date().toISOString()
      };
      return this.applications[idx];
    } else {
      const newRec = {
        ...record,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.applications.unshift(newRec);
      return newRec;
    }
  }

  updateApplicationStatus(id: string, status: ApplicationRecord['status'], additionalData?: Partial<ApplicationRecord>): ApplicationRecord | null {
    const app = this.applications.find(a => a.id === id);
    if (!app) return null;

    app.status = status;
    if (additionalData) {
      Object.assign(app, additionalData);
    }
    app.updatedAt = new Date().toISOString();
    return app;
  }

  // Analytics
  getAnalytics(): CareerAnalytics {
    const totalJobsRetrieved = this.jobs.length;
    const jobsPassing48hFilter = this.jobs.filter(j => j.isWithin48Hours).length;
    const karachiOnsiteJobs = this.jobs.filter(j => j.workMode === 'On-site' && j.location.includes('Karachi')).length;
    const pakistanRemoteJobs = this.jobs.filter(j => j.workMode === 'Remote').length;
    const fullStackMatches = this.jobs.filter(j => j.roleCategory === 'Full Stack Developer').length;
    const aiEngineerMatches = this.jobs.filter(j => j.roleCategory === 'AI Engineer').length;

    const scores = this.applications.map(a => a.compatibilityScore);
    const averageCompatibilityScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 84;

    const highMatchCount = this.applications.filter(a => a.compatibilityScore >= 80).length;
    const awaitingApprovalCount = this.applications.filter(a => a.status === 'Awaiting Approval' || a.status === 'Email Ready').length;
    const sentApplicationsCount = this.applications.filter(a => a.status === 'Sent' || a.status === 'Application Submitted').length;
    const interviewCount = this.applications.filter(a => a.status === 'Interview').length;
    const rejectedCount = this.applications.filter(a => a.status === 'Rejected').length;

    const totalApplied = sentApplicationsCount + interviewCount + rejectedCount;
    const responseRatePercent = totalApplied > 0 ? Math.round((interviewCount / totalApplied) * 100) : 33;

    return {
      totalJobsRetrieved,
      jobsPassing48hFilter,
      karachiOnsiteJobs,
      pakistanRemoteJobs,
      fullStackMatches,
      aiEngineerMatches,
      averageCompatibilityScore,
      highMatchCount,
      awaitingApprovalCount,
      sentApplicationsCount,
      interviewCount,
      rejectedCount,
      responseRatePercent
    };
  }

  // OAuth and Config
  setGmailToken(token: string | null, email?: string) {
    this.gmailAccessToken = token;
    if (email) this.gmailUserEmail = email;
  }

  getGmailToken(): string | null {
    return this.gmailAccessToken;
  }

  getGmailEmail(): string | null {
    return this.gmailUserEmail;
  }

  setApifyApiKey(key: string | null) {
    this.apifyApiKey = key;
  }

  getApifyApiKey(): string | null {
    return this.apifyApiKey;
  }

  // Auth User and Search Preferences
  getAuthUser(): AuthUser | null {
    return this.authUser;
  }

  getUserByEmail(email: string): { user: AuthUser; password?: string } | null {
    if (!email) return null;
    return this.registeredUsers.get(email.trim().toLowerCase()) || null;
  }

  registerUser(user: AuthUser, password?: string): AuthUser {
    this.registeredUsers.set(user.email.trim().toLowerCase(), { user, password });
    this.setAuthUser(user);
    return user;
  }

  setAuthUser(user: AuthUser | null): AuthUser | null {
    this.authUser = user;
    if (user) {
      this.candidateProfile.fullName = user.fullName;
      this.candidateProfile.email = user.email;
      this.candidateProfile.title = user.title || this.candidateProfile.title;
      this.candidateProfile.location = user.location || this.candidateProfile.location;
      if (user.searchPreferences) {
        this.searchPreferences = { ...user.searchPreferences };
        if (user.searchPreferences.targetRole) {
          const role = user.searchPreferences.targetRole as TargetRole;
          if (!this.candidateProfile.targetRoles.includes(role)) {
            this.candidateProfile.targetRoles = [role, ...this.candidateProfile.targetRoles];
          }
        }
      }
      if (user.gmailAddress) {
        this.gmailUserEmail = user.gmailAddress;
      }
      if (user.gmailAccessToken) {
        this.gmailAccessToken = user.gmailAccessToken;
      }
      if (user.cvFileName) {
        this.candidateProfile.originalFileName = user.cvFileName;
      }
      if (user.cvDataUrl) {
        this.candidateProfile.cvDataUrl = user.cvDataUrl;
      }
      if (user.cvFileContent) {
        this.candidateProfile.rawResumeText = user.cvFileContent;
      }
    }
    return this.authUser;
  }

  getSearchPreferences(): UserSearchPreferences {
    return this.searchPreferences;
  }

  setSearchPreferences(prefs: Partial<UserSearchPreferences>): UserSearchPreferences {
    this.searchPreferences = {
      ...this.searchPreferences,
      ...prefs
    };
    if (this.authUser) {
      this.authUser.searchPreferences = { ...this.searchPreferences };
    }
    return this.searchPreferences;
  }
}

export const db = new DatabaseStore();
