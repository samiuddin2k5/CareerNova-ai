import { JobPosting, UserSearchPreferences, TargetRole } from '../types';

/**
 * Checks if a job matches the user's target role
 */
export function matchesRoleCategory(job: JobPosting, targetRole: TargetRole | string): boolean {
  if (!targetRole || targetRole === 'All' || targetRole === 'All Categories' || targetRole.toLowerCase().includes('all fields')) {
    return true;
  }

  if (job.roleCategory === targetRole) return true;

  const title = job.title.toLowerCase();
  const desc = job.description.toLowerCase();
  const role = targetRole.toLowerCase();
  const required = (job.requiredSkills || []).map(s => s.toLowerCase());

  // 1. Mechanical Engineering
  if (role.includes('mechanical') || role.includes('cad') || role.includes('thermal') || role.includes('hvac') || role.includes('automotive') || role.includes('robotics')) {
    return (
      job.roleCategory === 'Mechanical Engineer' ||
      job.roleCategory === 'Mechanical Design Engineer' ||
      job.roleCategory === 'HVAC & Thermal Engineer' ||
      job.roleCategory === 'Robotics & Automation Engineer' ||
      title.includes('mechanical') ||
      title.includes('cad') ||
      title.includes('solidworks') ||
      title.includes('thermal') ||
      title.includes('hvac') ||
      title.includes('automotive') ||
      title.includes('robotics') ||
      required.some(s => s.includes('solidworks') || s.includes('autocad') || s.includes('thermodynamics') || s.includes('ansys'))
    );
  }

  // 2. Electrical & Electronics Engineering
  if (role.includes('electrical') || role.includes('power systems') || role.includes('embedded') || role.includes('electronics')) {
    return (
      job.roleCategory === 'Electrical Engineer' ||
      job.roleCategory === 'Power Systems Engineer' ||
      job.roleCategory === 'Embedded Systems Engineer' ||
      job.roleCategory === 'Electronics Engineer' ||
      title.includes('electrical') ||
      title.includes('power system') ||
      title.includes('substation') ||
      title.includes('embedded') ||
      title.includes('electronics') ||
      title.includes('firmware') ||
      title.includes('circuit') ||
      required.some(s => s.includes('power systems') || s.includes('circuit') || s.includes('embedded') || s.includes('etap'))
    );
  }

  // 3. Medical, Doctors & Healthcare
  if (role.includes('doctor') || role.includes('physician') || role.includes('medical') || role.includes('clinical') || role.includes('health') || role.includes('pharmacist') || role.includes('biomedical')) {
    return (
      job.roleCategory === 'Medical Doctor / Physician' ||
      job.roleCategory === 'Medical Officer / Resident' ||
      job.roleCategory === 'Biomedical Engineer' ||
      job.roleCategory === 'Pharmacist' ||
      job.roleCategory === 'Healthcare Specialist' ||
      title.includes('doctor') ||
      title.includes('physician') ||
      title.includes('medical officer') ||
      title.includes('resident') ||
      title.includes('hospital') ||
      title.includes('clinical') ||
      title.includes('biomedical') ||
      title.includes('pharmacist') ||
      required.some(s => s.includes('clinical diagnosis') || s.includes('patient') || s.includes('ehr') || s.includes('medical device'))
    );
  }

  // 4. Civil & Infrastructure Engineering
  if (role.includes('civil') || role.includes('structural') || role.includes('construction')) {
    return (
      job.roleCategory === 'Civil Engineer' ||
      job.roleCategory === 'Structural Engineer' ||
      title.includes('civil') ||
      title.includes('structural') ||
      title.includes('site engineer') ||
      title.includes('construction') ||
      required.some(s => s.includes('etabs') || s.includes('civil 3d') || s.includes('concrete'))
    );
  }

  // 5. Cloud & DevOps Engineering
  if (
    role.includes('devops') || 
    role.includes('cloud') || 
    role.includes('sre') || 
    role.includes('infrastructure') || 
    role.includes('site reliability') || 
    role.includes('platform engineer') ||
    role.includes('kubernetes')
  ) {
    if (job.roleCategory === 'DevOps & Cloud Engineer') return true;
    if (
      title.includes('devops') ||
      title.includes('cloud') ||
      title.includes('sre') ||
      title.includes('site reliability') ||
      title.includes('infrastructure') ||
      title.includes('platform engineer') ||
      title.includes('platform architect') ||
      title.includes('kubernetes') ||
      title.includes('aws cloud') ||
      title.includes('cloud support') ||
      title.includes('terraform')
    ) return true;
    
    // For internship category, check if it's explicitly cloud/devops focused
    if (job.isInternship || job.roleCategory === 'Internship') {
      return (
        title.includes('cloud') || 
        title.includes('devops') || 
        title.includes('sre') ||
        title.includes('infrastructure')
      );
    }

    return false;
  }

  // 6. Business, Management & Finance
  if (role.includes('product') || role.includes('business analyst') || role.includes('finance') || role.includes('marketing') || role.includes('operations')) {
    return (
      job.roleCategory === 'Product Manager' ||
      title.includes('product manager') ||
      title.includes('product lead') ||
      title.includes('business analyst') ||
      title.includes('operations manager') ||
      title.includes('financial analyst') ||
      title.includes('marketing lead')
    );
  }

  // 7. Software & IT fields
  if (role.includes('full stack') || role.includes('fullstack')) {
    return (
      job.roleCategory === 'Full Stack Developer' ||
      title.includes('full stack') ||
      title.includes('fullstack') ||
      title.includes('mern')
    );
  }

  if (role.includes('ai') || role.includes('machine learning')) {
    return (
      job.roleCategory === 'AI Engineer' ||
      title.includes('ai ') ||
      title.includes('ai engineer') ||
      title.includes('artificial intelligence') ||
      title.includes('machine learning') ||
      title.includes('deep learning') ||
      title.includes('llm') ||
      title.includes('generative ai') ||
      title.includes('data science') ||
      title.includes('computer vision') ||
      title.includes('nlp') ||
      title.includes('langchain') ||
      title.includes('rag')
    );
  }

  if (role.includes('frontend') || role.includes('front-end')) {
    return (
      job.roleCategory === 'Frontend Developer' ||
      title.includes('frontend') ||
      title.includes('front-end') ||
      title.includes('ui developer') ||
      title.includes('ui engineer') ||
      title.includes('react developer') ||
      title.includes('react engineer') ||
      title.includes('next.js') ||
      (job.isInternship && (title.includes('frontend') || title.includes('react') || title.includes('ui/ux engineering')))
    );
  }

  if (role.includes('backend') || role.includes('back-end')) {
    return (
      job.roleCategory === 'Backend Developer' ||
      title.includes('backend') ||
      title.includes('back-end') ||
      title.includes('api engineer') ||
      title.includes('node.js developer') ||
      title.includes('python backend') ||
      title.includes('fastapi') ||
      title.includes('distributed systems') ||
      title.includes('microservices') ||
      (job.isInternship && (title.includes('backend') || title.includes('api developer') || title.includes('fastapi') || title.includes('node.js')))
    );
  }

  if (role.includes('software engineer')) {
    return (
      job.roleCategory === 'Software Engineer' ||
      title.includes('software engineer') ||
      title.includes('software developer')
    );
  }

  if (role.includes('internship') || role.includes('intern')) {
    return job.isInternship || job.roleCategory === 'Internship' || title.includes('intern');
  }

  return title.includes(role) || desc.includes(role);
}

/**
 * Checks if a job matches any of the user's selected target locations.
 * Pakistan selection is strictly optional and choosable:
 * - If user chooses "Global / Worldwide (All Locations)", shows all postings globally (including Pakistan).
 * - If user chooses "Pakistan", shows Pakistan jobs and internships.
 * - If user chooses other countries (US, UK, UAE, Germany, etc.), Pakistan postings are strictly excluded.
 */
export function matchesLocationList(job: JobPosting, locations: string[]): boolean {
  if (!locations || locations.length === 0) return true;

  // 1. Check if user selected Global/All Locations (Worldwide including Pakistan)
  const isGlobalAllSelected = locations.some(l => {
    const lower = l.toLowerCase().trim();
    return (
      lower === 'all' ||
      lower === 'all locations' ||
      lower === 'all countries' ||
      lower === 'worldwide' ||
      lower === 'global' ||
      lower.includes('all locations') ||
      lower.includes('all countries') ||
      lower.includes('worldwide / global') ||
      lower.includes('global / worldwide') ||
      lower.includes('worldwide (all')
    );
  });

  if (isGlobalAllSelected) {
    return true; // Worldwide mode includes all countries (Pakistan, US, UK, Germany, UAE, etc.)
  }

  const jobLoc = (job.location || '').toLowerCase();
  const jobCity = (job.city || '').toLowerCase();
  const jobCountry = (job.country || '').toLowerCase();

  return locations.some(loc => {
    const l = loc.toLowerCase().trim();
    if (!l) return false;

    // Pakistan locations (Only if user explicitly chose Pakistan or a Pakistan city)
    if (l === 'pakistan' || l.startsWith('pakistan') || l.includes('pakistan (')) {
      if (l.includes('remote')) {
        return (
          job.workMode === 'Remote' &&
          (job.isKarachiOrRemotePK || jobCountry === 'pakistan' || jobLoc.includes('pakistan'))
        );
      }
      return (
        job.isKarachiOrRemotePK ||
        jobCountry === 'pakistan' ||
        jobLoc.includes('pakistan') ||
        jobLoc.includes('karachi') ||
        jobLoc.includes('lahore') ||
        jobLoc.includes('islamabad') ||
        jobLoc.includes('rawalpindi') ||
        jobLoc.includes('peshawar') ||
        jobLoc.includes('faisalabad')
      );
    }
    if (l === 'karachi' || l.includes('karachi')) {
      return jobLoc.includes('karachi') || jobCity.includes('karachi');
    }
    if (l === 'lahore' || l.includes('lahore')) {
      return jobLoc.includes('lahore') || jobCity.includes('lahore');
    }
    if (l === 'islamabad' || l.includes('islamabad')) {
      return jobLoc.includes('islamabad') || jobCity.includes('islamabad');
    }
    if (l === 'remote pakistan' || l === 'remote (pakistan)') {
      return (
        job.workMode === 'Remote' &&
        (job.isKarachiOrRemotePK || jobCountry === 'pakistan' || jobLoc.includes('pakistan'))
      );
    }

    // Worldwide / Global Remote (specifically remote jobs)
    if (l === 'worldwide remote' || l === 'global remote' || l.includes('worldwide remote') || l.includes('global remote')) {
      return (
        job.workMode === 'Remote' ||
        jobCountry === 'global remote' ||
        jobLoc.includes('worldwide') ||
        jobLoc.includes('anywhere')
      );
    }

    // United States
    if (l.includes('united states') || l === 'usa' || l === 'us') {
      return (
        jobCountry === 'united states' ||
        jobLoc.includes('usa') ||
        jobLoc.includes('united states') ||
        jobLoc.includes('san francisco') ||
        jobLoc.includes('new york') ||
        jobLoc.includes('austin') ||
        jobLoc.includes('seattle') ||
        jobLoc.includes('chicago')
      );
    }

    // United Arab Emirates
    if (l.includes('uae') || l.includes('dubai') || l.includes('united arab emirates') || l.includes('abu dhabi')) {
      return (
        jobCountry === 'united arab emirates' ||
        jobLoc.includes('dubai') ||
        jobLoc.includes('abu dhabi') ||
        jobLoc.includes('sharjah') ||
        jobLoc.includes('uae')
      );
    }

    // Saudi Arabia
    if (l.includes('saudi') || l.includes('riyadh') || l.includes('ksa') || l.includes('jeddah')) {
      return (
        jobCountry === 'saudi arabia' ||
        jobLoc.includes('riyadh') ||
        jobLoc.includes('jeddah') ||
        jobLoc.includes('dammam') ||
        jobLoc.includes('saudi')
      );
    }

    // Germany
    if (l.includes('germany') || l.includes('berlin') || l.includes('munich') || l.includes('frankfurt')) {
      return (
        jobCountry === 'germany' ||
        jobLoc.includes('berlin') ||
        jobLoc.includes('munich') ||
        jobLoc.includes('frankfurt') ||
        jobLoc.includes('hamburg') ||
        jobLoc.includes('germany')
      );
    }

    // Canada
    if (l.includes('canada') || l.includes('toronto') || l.includes('vancouver') || l.includes('montreal')) {
      return (
        jobCountry === 'canada' ||
        jobLoc.includes('toronto') ||
        jobLoc.includes('vancouver') ||
        jobLoc.includes('montreal') ||
        jobLoc.includes('waterloo') ||
        jobLoc.includes('canada')
      );
    }

    // United Kingdom
    if (l.includes('united kingdom') || l === 'uk' || l.includes('london') || l.includes('manchester')) {
      return (
        jobCountry === 'united kingdom' ||
        jobLoc.includes('london') ||
        jobLoc.includes('manchester') ||
        jobLoc.includes('uk') ||
        jobLoc.includes('edinburgh')
      );
    }

    // Australia
    if (l.includes('australia') || l.includes('sydney') || l.includes('melbourne')) {
      return (
        jobCountry === 'australia' ||
        jobLoc.includes('sydney') ||
        jobLoc.includes('melbourne') ||
        jobLoc.includes('brisbane') ||
        jobLoc.includes('australia')
      );
    }

    // Singapore
    if (l.includes('singapore')) {
      return (
        jobCountry === 'singapore' ||
        jobLoc.includes('singapore')
      );
    }

    // India
    if (l.includes('india') || l.includes('bangalore') || l.includes('mumbai')) {
      return (
        jobCountry === 'india' ||
        jobLoc.includes('bangalore') ||
        jobLoc.includes('mumbai') ||
        jobLoc.includes('india')
      );
    }

    return jobLoc.includes(l) || jobCity.includes(l) || jobCountry.includes(l);
  });
}

/**
 * Checks if a job matches at least one of the user's primary skills
 */
export function matchesSkills(job: JobPosting, userSkills: string[]): boolean {
  if (!userSkills || userSkills.length === 0) return true;

  const jobSkillText = [
    ...job.requiredSkills,
    ...(job.preferredSkills || []),
    job.title,
    job.description
  ].join(' ').toLowerCase();

  return userSkills.some(skill => {
    const s = skill.toLowerCase().trim();
    if (!s) return false;

    // Tech / Software
    if (s.includes('react')) return jobSkillText.includes('react');
    if (s.includes('node')) return jobSkillText.includes('node');
    if (s.includes('python')) return jobSkillText.includes('python');
    if (s.includes('typescript')) return jobSkillText.includes('typescript') || jobSkillText.includes('ts');
    if (s.includes('tailwind')) return jobSkillText.includes('tailwind');
    if (s.includes('postgres') || s.includes('sql')) return jobSkillText.includes('sql') || jobSkillText.includes('postgres');
    if (s.includes('docker')) return jobSkillText.includes('docker');
    if (s.includes('fastapi')) return jobSkillText.includes('fastapi');
    if (s.includes('pytorch')) return jobSkillText.includes('pytorch') || jobSkillText.includes('torch');
    if (s.includes('langchain') || s.includes('rag')) return jobSkillText.includes('langchain') || jobSkillText.includes('rag') || jobSkillText.includes('llm');

    // Mechanical
    if (s.includes('solidworks')) return jobSkillText.includes('solidworks') || jobSkillText.includes('cad');
    if (s.includes('autocad')) return jobSkillText.includes('autocad') || jobSkillText.includes('cad');
    if (s.includes('ansys')) return jobSkillText.includes('ansys') || jobSkillText.includes('fea');
    if (s.includes('thermo')) return jobSkillText.includes('thermodynamics') || jobSkillText.includes('thermal');
    if (s.includes('gd&t')) return jobSkillText.includes('gd&t') || jobSkillText.includes('drafting');

    // Electrical
    if (s.includes('power')) return jobSkillText.includes('power') || jobSkillText.includes('grid') || jobSkillText.includes('substation');
    if (s.includes('embedded')) return jobSkillText.includes('embedded') || jobSkillText.includes('firmware') || jobSkillText.includes('microcontroller');
    if (s.includes('pcb')) return jobSkillText.includes('pcb') || jobSkillText.includes('circuit') || jobSkillText.includes('hardware');
    if (s.includes('etap')) return jobSkillText.includes('etap') || jobSkillText.includes('power systems');

    // Medical / Healthcare
    if (s.includes('clinical') || s.includes('diagnosis')) return jobSkillText.includes('clinical') || jobSkillText.includes('diagnosis') || jobSkillText.includes('consultation');
    if (s.includes('patient')) return jobSkillText.includes('patient') || jobSkillText.includes('inpatient') || jobSkillText.includes('rounds');
    if (s.includes('ehr')) return jobSkillText.includes('ehr') || jobSkillText.includes('records') || jobSkillText.includes('documentation');
    if (s.includes('pharmacology')) return jobSkillText.includes('pharmacology') || jobSkillText.includes('prescriptions') || jobSkillText.includes('drug');
    if (s.includes('bls') || s.includes('acls') || s.includes('emergency')) return jobSkillText.includes('emergency') || jobSkillText.includes('triage') || jobSkillText.includes('bls');
    if (s.includes('biomedical') || s.includes('medical device')) return jobSkillText.includes('medical device') || jobSkillText.includes('biomedical') || jobSkillText.includes('iso 13485');

    // Civil
    if (s.includes('civil 3d') || s.includes('survey')) return jobSkillText.includes('civil') || jobSkillText.includes('surveying');
    if (s.includes('etabs') || s.includes('staad')) return jobSkillText.includes('etabs') || jobSkillText.includes('structural');

    return jobSkillText.includes(s);
  });
}

/**
 * Checks if a job matches ANY of the user's selected target roles.
 * If user selected 'DevOps & Cloud Engineer' and 'Full Stack Developer',
 * only jobs and internships related to DevOps & Cloud OR Full Stack Developer will match!
 */
export function matchesTargetRoles(
  job: JobPosting, 
  targetRoles?: (TargetRole | string)[] | null, 
  singleTargetRole?: TargetRole | string | null
): boolean {
  // Collect all roles from array and/or single fallback
  const roles: string[] = [];
  if (targetRoles && targetRoles.length > 0) {
    roles.push(...targetRoles.filter(Boolean));
  } else if (singleTargetRole) {
    // If single role contains commas (e.g. "DevOps & Cloud Engineer, Full Stack Developer")
    if (typeof singleTargetRole === 'string' && singleTargetRole.includes(',')) {
      roles.push(...singleTargetRole.split(',').map(s => s.trim()).filter(Boolean));
    } else {
      roles.push(String(singleTargetRole).trim());
    }
  }

  // If no roles specified or 'All' selected
  if (
    roles.length === 0 || 
    roles.includes('All') || 
    roles.includes('All Categories') || 
    roles.some(r => r.toLowerCase().includes('all fields'))
  ) {
    return true;
  }

  // The job MUST match at least one of the selected roles
  return roles.some(role => matchesRoleCategory(job, role));
}

/**
 * Filter standard job postings strictly by user's given fields
 */
export function filterJobsBySearchPreferences(
  jobs: JobPosting[],
  preferences?: UserSearchPreferences | null,
  options?: {
    strictRole?: boolean;
    strictLocation?: boolean;
    strictSkills?: boolean;
    strictWorkMode?: boolean;
    strict48Hours?: boolean;
  }
): JobPosting[] {
  if (!preferences) return jobs;

  const {
    strictRole = true,
    strictLocation = true,
    strictSkills = true,
    strictWorkMode = true,
    strict48Hours = false
  } = options || {};

  return jobs.filter(job => {
    // 1. Target Role Match (Multi-role supported!)
    const hasRoles = (preferences.targetRoles && preferences.targetRoles.length > 0) || preferences.targetRole;
    if (strictRole && hasRoles) {
      if (!matchesTargetRoles(job, preferences.targetRoles, preferences.targetRole)) {
        return false;
      }
    }

    // 2. Location Match
    if (strictLocation && preferences.targetLocations && preferences.targetLocations.length > 0) {
      if (!matchesLocationList(job, preferences.targetLocations)) {
        return false;
      }
    }

    // 3. Work Mode Match
    if (strictWorkMode && preferences.workModes && preferences.workModes.length > 0 && preferences.workModes.length < 3) {
      if (!preferences.workModes.includes(job.workMode)) {
        return false;
      }
    }

    // 4. Skills Match
    if (strictSkills && preferences.primarySkills && preferences.primarySkills.length > 0) {
      if (!matchesSkills(job, preferences.primarySkills)) {
        return false;
      }
    }

    // 5. 48 Hours Check (optional strictness)
    if (strict48Hours && preferences.onlyWithin48Hours) {
      if (!job.isWithin48Hours) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter internships strictly by user's given fields
 */
export function filterInternshipsBySearchPreferences(
  internships: JobPosting[],
  preferences?: UserSearchPreferences | null
): JobPosting[] {
  if (!preferences) return internships.filter(j => j.isInternship || j.roleCategory === 'Internship' || j.title.toLowerCase().includes('intern'));

  // First ensure only actual internships
  const allInternships = internships.filter(j => j.isInternship || j.roleCategory === 'Internship' || j.title.toLowerCase().includes('intern'));

  return allInternships.filter(internship => {
    // 1. Match Domain/Role strictly (Multi-role supported)
    const hasRoles = (preferences.targetRoles && preferences.targetRoles.length > 0) || preferences.targetRole;
    if (hasRoles && preferences.targetRole !== 'Internship') {
      const matchesDomain = matchesTargetRoles(internship, preferences.targetRoles, preferences.targetRole);
      if (!matchesDomain) {
        return false;
      }
    }

    // 2. Location Match
    if (preferences.targetLocations && preferences.targetLocations.length > 0) {
      if (!matchesLocationList(internship, preferences.targetLocations)) {
        return false;
      }
    }

    // 3. Work Mode Match
    if (preferences.workModes && preferences.workModes.length > 0 && preferences.workModes.length < 3) {
      if (!preferences.workModes.includes(internship.workMode)) {
        return false;
      }
    }

    return true;
  });
}
