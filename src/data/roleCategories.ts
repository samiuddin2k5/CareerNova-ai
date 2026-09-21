import { TargetRole } from '../types';

export interface RoleCategoryGroup {
  id: string;
  name: string;
  iconName: string;
  badgeColor: string;
  description: string;
  roles: {
    id: TargetRole;
    title: string;
    description: string;
    suggestedSkills: string[];
  }[];
}

export const ROLE_CATEGORY_GROUPS: RoleCategoryGroup[] = [
  {
    id: 'cloud_devops',
    name: 'Cloud, DevOps & Infrastructure',
    iconName: 'Cloud',
    badgeColor: 'sky',
    description: 'Cloud architectures, Kubernetes, CI/CD pipelines, SRE, and Terraform infrastructure',
    roles: [
      {
        id: 'DevOps & Cloud Engineer',
        title: 'DevOps & Cloud Engineer',
        description: 'CI/CD automation, Kubernetes clusters, AWS/GCP, infrastructure as code & monitoring',
        suggestedSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Bash Scripting', 'GitHub Actions', 'Prometheus', 'Ansible']
      },
      {
        id: 'Cybersecurity Specialist',
        title: 'Cybersecurity & InfoSec Specialist',
        description: 'Cloud security audits, penetration testing, vulnerability management, and SIEM',
        suggestedSkills: ['Cloud Security', 'Network Security', 'Vulnerability Assessment', 'Penetration Testing', 'SIEM', 'Python', 'Linux', 'Cryptography', 'Wireshark']
      }
    ]
  },
  {
    id: 'software_it',
    name: 'Software & Web Engineering',
    iconName: 'Code',
    badgeColor: 'violet',
    description: 'Full stack, frontend, backend microservices, mobile apps, and distributed systems',
    roles: [
      {
        id: 'Full Stack Developer',
        title: 'Full Stack Developer',
        description: 'Frontend and backend web systems, modern APIs, and high-performance databases',
        suggestedSkills: ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'REST APIs', 'Tailwind CSS', 'Git', 'MongoDB']
      },
      {
        id: 'Software Engineer',
        title: 'Software Engineer',
        description: 'System architecture, algorithms, distributed systems & object-oriented design',
        suggestedSkills: ['Java', 'C++', 'Python', 'Data Structures', 'System Design', 'Git', 'SQL', 'Docker', 'Linux', 'Microservices']
      },
      {
        id: 'Frontend Developer',
        title: 'Frontend Developer',
        description: 'Interactive responsive user interfaces, design systems, and web performance',
        suggestedSkills: ['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3/SASS', 'Redux Toolkit', 'JavaScript', 'REST APIs']
      },
      {
        id: 'Backend Developer',
        title: 'Backend Developer',
        description: 'High-throughput microservices, scalable APIs, databases, and caching architectures',
        suggestedSkills: ['Node.js', 'Python', 'FastAPI', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST APIs', 'GraphQL']
      },
      {
        id: 'Mobile App Developer',
        title: 'Mobile App Developer (iOS / Android / Flutter)',
        description: 'Native and cross-platform mobile apps for millions of daily active users',
        suggestedSkills: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Dart', 'Mobile UI/UX', 'Firebase', 'REST APIs']
      }
    ]
  },
  {
    id: 'ai_data',
    name: 'AI, Machine Learning & Data Science',
    iconName: 'Sparkles',
    badgeColor: 'indigo',
    description: 'Generative AI, Large Language Models, RAG pipelines, data analytics, and predictive ML',
    roles: [
      {
        id: 'AI Engineer',
        title: 'AI / Machine Learning Engineer',
        description: 'Generative AI, LLMs, RAG pipelines, computer vision, and neural network training',
        suggestedSkills: ['Python', 'PyTorch', 'Generative AI', 'LLMs', 'LangChain', 'FastAPI', 'RAG Pipelines', 'Vector Databases', 'Scikit-learn', 'Docker']
      },
      {
        id: 'Data Scientist',
        title: 'Data Scientist / Business Intelligence Analyst',
        description: 'Predictive modeling, big data analytics, statistical modeling, and executive BI dashboards',
        suggestedSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Tableau', 'Power BI', 'Scikit-learn', 'Statistics']
      }
    ]
  },
  {
    id: 'business_finance',
    name: 'Business, Management & Finance',
    iconName: 'BarChart3',
    badgeColor: 'amber',
    description: 'Product leadership, business strategy, financial analysis, marketing, and operations',
    roles: [
      {
        id: 'Product Manager',
        title: 'Product Manager / Technical Product Lead',
        description: 'Product roadmap, customer discovery, agile sprints, PRDs, and data-driven KPIs',
        suggestedSkills: ['Product Strategy', 'Agile & Scrum', 'User Journey Mapping', 'A/B Testing', 'Jira / Confluence', 'Wireframing & Figma', 'Data Analytics', 'Market Research']
      }
    ]
  },
  {
    id: 'mechanical_eng',
    name: 'Mechanical & Robotics Engineering',
    iconName: 'Wrench',
    badgeColor: 'orange',
    description: 'CAD 3D modeling, automotive manufacturing, thermal HVAC, and robotics mechatronics',
    roles: [
      {
        id: 'Mechanical Engineer',
        title: 'Mechanical Engineer',
        description: 'Mechanical systems design, plant maintenance, stress analysis, and fabrication',
        suggestedSkills: ['SolidWorks', 'AutoCAD', 'Thermodynamics', 'Fluid Mechanics', 'ANSYS FEA', 'GD&T', 'MATLAB', 'Manufacturing Processes', 'Machine Design']
      },
      {
        id: 'Mechanical Design Engineer',
        title: 'Mechanical Design Engineer (CAD/CAM)',
        description: '3D modeling, prototyping, tolerancing, and automotive product engineering',
        suggestedSkills: ['SolidWorks', 'CATIA', 'PTC Creo', 'AutoCAD', 'GD&T', '3D Prototyping', 'Finite Element Analysis (FEA)', 'Material Selection']
      },
      {
        id: 'HVAC & Thermal Engineer',
        title: 'HVAC & Thermal Systems Engineer',
        description: 'Heating, ventilation, air conditioning, and industrial heat transfer systems',
        suggestedSkills: ['HVAC Design', 'Thermodynamics', 'HAP (Hourly Analysis Program)', 'Refrigeration Systems', 'ASHRAE Standards', 'Fluid Dynamics', 'AutoCAD MEP']
      },
      {
        id: 'Robotics & Automation Engineer',
        title: 'Robotics & Mechatronics Engineer',
        description: 'Industrial robotics, kinematics, actuators, sensors, and PLC automation',
        suggestedSkills: ['ROS (Robot Operating System)', 'MATLAB / Simulink', 'Mechatronics', 'Kinematics & Dynamics', 'SolidWorks', 'Python / C++', 'PLC Programming']
      }
    ]
  },
  {
    id: 'electrical_eng',
    name: 'Electrical & Electronics Engineering',
    iconName: 'Zap',
    badgeColor: 'yellow',
    description: 'Power distribution, embedded firmware, analog circuits, and grid protection',
    roles: [
      {
        id: 'Electrical Engineer',
        title: 'Electrical Engineer (Power & Substations)',
        description: 'Power distribution, circuit analysis, high-voltage switchgear, and electrical design',
        suggestedSkills: ['Power Systems', 'AutoCAD Electrical', 'MATLAB / Simulink', 'ETAP', 'Circuit Analysis', 'Switchgear & Transformers', 'Single Line Diagrams (SLD)']
      },
      {
        id: 'Embedded Systems Engineer',
        title: 'Embedded Systems & Firmware Engineer',
        description: 'Microcontrollers, firmware development in C/C++, RTOS, and hardware interfacing',
        suggestedSkills: ['Embedded C/C++', 'Microcontrollers (ARM, STM32, ESP32)', 'RTOS', 'I2C / SPI / UART', 'PCB Design', 'Hardware Debugging', 'IoT Protocols']
      },
      {
        id: 'Electronics Engineer',
        title: 'Electronics & Hardware Design Engineer',
        description: 'PCB schematic layout, analog/digital circuits, and RF signal integrity',
        suggestedSkills: ['Altium Designer', 'KiCAD', 'Analog & Digital Circuit Design', 'SPICE Simulation', 'PCB Layout & Routing', 'Soldering & Lab Instrumentation']
      },
      {
        id: 'Power Systems Engineer',
        title: 'Power Systems & Grid Engineer',
        description: 'Transmission networks, grid protection, renewable solar/wind integration & ETAP',
        suggestedSkills: ['ETAP', 'Load Flow Analysis', 'Relay Protection & Coordination', 'Substation Design', 'Renewable Energy Systems', 'PLC / SCADA']
      }
    ]
  },
  {
    id: 'medical_healthcare',
    name: 'Medical, Doctors & Healthcare',
    iconName: 'HeartPulse',
    badgeColor: 'emerald',
    description: 'Clinical practice, resident physicians, hospital patient care, pharmacology & biomedical',
    roles: [
      {
        id: 'Medical Doctor / Physician',
        title: 'Medical Doctor / General Physician',
        description: 'Patient consultations, clinical diagnostics, treatment planning, and internal medicine',
        suggestedSkills: ['Clinical Diagnosis', 'Patient Management', 'Internal Medicine', 'Pharmacology & Prescriptions', 'Electronic Health Records (EHR)', 'Preventive Medicine', 'BLS / ACLS Certification']
      },
      {
        id: 'Medical Officer / Resident',
        title: 'Medical Officer / Resident Doctor',
        description: 'Hospital in-patient rounds, emergency triage, ICU monitoring, and acute care',
        suggestedSkills: ['Emergency Medicine', 'Patient Triage', 'ICU Management', 'Clinical Decision Support', 'Surgical Assistance', 'Medical Documentation', 'Inpatient Care']
      },
      {
        id: 'Biomedical Engineer',
        title: 'Biomedical Engineer',
        description: 'Hospital medical device maintenance, biomedical instrumentation, regulatory compliance',
        suggestedSkills: ['Medical Device Maintenance', 'Biomedical Sensors', 'ISO 13485 Compliance', 'MATLAB', 'Signal Processing (ECG/EEG)', 'Diagnostic Imaging Equipment', 'Patient Safety Standards']
      },
      {
        id: 'Pharmacist',
        title: 'Pharmacist & Clinical Pharmacologist',
        description: 'Medication therapy management, dosage calculations, drug interactions, inventory',
        suggestedSkills: ['Clinical Pharmacology', 'Medication Therapy Management', 'Drug Interaction Analysis', 'Hospital Pharmacy Dispensing', 'Pharmacovigilance', 'EHR Systems']
      },
      {
        id: 'Healthcare Specialist',
        title: 'Healthcare Informatics & Clinical Coordinator',
        description: 'Clinical research trials, healthcare data management, hospital quality protocols',
        suggestedSkills: ['Healthcare Informatics', 'Clinical Research Protocols', 'GCP Compliance', 'Biostatistics', 'Patient Safety & Quality Assurance', 'Medical Terminology']
      }
    ]
  },
  {
    id: 'civil_eng',
    name: 'Civil & Infrastructure Engineering',
    iconName: 'Building',
    badgeColor: 'teal',
    description: 'Structural engineering, site inspection, construction management, and surveying',
    roles: [
      {
        id: 'Civil Engineer',
        title: 'Civil Site Engineer',
        description: 'On-site construction supervision, material testing, QA/QC, and site surveying',
        suggestedSkills: ['AutoCAD Civil 3D', 'Site Supervision', 'Concrete Technology', 'Total Station & Surveying', 'Bill of Quantities (BOQ)', 'Construction Safety Standards']
      },
      {
        id: 'Structural Engineer',
        title: 'Structural Design Engineer',
        description: 'Reinforced concrete and steel structure design, seismic analysis, foundation modeling',
        suggestedSkills: ['ETABS', 'STAAD.Pro', 'Revit Structure', 'Structural Analysis', 'ACI / Eurocode Standards', 'Seismic Design', 'Foundation Engineering']
      }
    ]
  },
  {
    id: 'internship_programs',
    name: 'Internships & Trainees (All Disciplines)',
    iconName: 'GraduationCap',
    badgeColor: 'pink',
    description: 'Rotational cohorts, summer traineeships, house officers, and graduate fellowship programs',
    roles: [
      {
        id: 'Internship',
        title: 'Universal Internship & Trainee Program (All Fields)',
        description: 'Undergraduate and fresh graduate rotational programs across Cloud, Tech, Medical, & Engineering',
        suggestedSkills: ['Problem Solving', 'Team Collaboration', 'Git / Version Control', 'Fast Learner', 'Communication Skills', 'Fundamental Coursework']
      }
    ]
  }
];

export interface ProfessionalTitleGroup {
  discipline: string;
  badgeColor: string;
  titles: string[];
}

export const POPULAR_PROFESSIONAL_TITLES: ProfessionalTitleGroup[] = [
  {
    discipline: 'Cloud & DevOps',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/40 hover:bg-sky-900/60 hover:border-sky-400',
    titles: [
      'DevOps & Cloud Engineer',
      'Site Reliability Engineer (SRE)',
      'Cloud Solutions Architect',
      'Platform & Infrastructure Engineer',
      'Cybersecurity & InfoSec Specialist',
      'DevOps & Cloud Intern'
    ]
  },
  {
    discipline: 'Software & Web',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/40 hover:bg-violet-900/60 hover:border-violet-400',
    titles: [
      'Full Stack Developer',
      'Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Mobile App Developer (Flutter/React Native)',
      'Software Engineering Intern'
    ]
  },
  {
    discipline: 'AI & Data',
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 hover:border-indigo-400',
    titles: [
      'AI / Machine Learning Engineer',
      'Generative AI & LLM Specialist',
      'Data Scientist',
      'Data Analyst / BI Specialist',
      'AI / ML Research Intern'
    ]
  },
  {
    discipline: 'Business & Management',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 hover:border-amber-400',
    titles: [
      'Product Manager',
      'Business Analyst',
      'Financial Analyst / Accountant',
      'Project Manager (Agile / Scrum)',
      'Digital Marketing & Growth Specialist',
      'Business Operations Intern'
    ]
  },
  {
    discipline: 'Mechanical & Robotics',
    badgeColor: 'border-orange-500/40 text-orange-300 bg-orange-950/40 hover:bg-orange-900/60 hover:border-orange-400',
    titles: [
      'Mechanical Engineer',
      'Mechanical Design Engineer (CAD/CAM)',
      'HVAC & Thermal Systems Engineer',
      'Robotics & Automation Engineer',
      'Automotive Manufacturing Engineer',
      'Mechanical Engineering Intern'
    ]
  },
  {
    discipline: 'Electrical & Embedded',
    badgeColor: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/40 hover:bg-yellow-900/60 hover:border-yellow-400',
    titles: [
      'Electrical Engineer (Power & Substations)',
      'Embedded Systems & Firmware Engineer',
      'Electronics & PCB Design Engineer',
      'Power Systems & Grid Engineer',
      'Electrical Engineering Intern'
    ]
  },
  {
    discipline: 'Doctors & Healthcare',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 hover:border-emerald-400',
    titles: [
      'Medical Doctor / General Physician',
      'Medical Officer / Resident Doctor',
      'Biomedical Engineer',
      'Clinical Pharmacist',
      'Healthcare Informatics Specialist',
      'Trainee House Officer / Medical Intern'
    ]
  },
  {
    discipline: 'Civil & Infrastructure',
    badgeColor: 'border-teal-500/40 text-teal-300 bg-teal-950/40 hover:bg-teal-900/60 hover:border-teal-400',
    titles: [
      'Civil Site Engineer',
      'Structural Design Engineer',
      'Construction Project Manager',
      'Civil Engineering Intern'
    ]
  }
];

// Flat list of all roles for convenience
export const ALL_TARGET_ROLES: { id: TargetRole; title: string; categoryName: string; suggestedSkills: string[] }[] = 
  ROLE_CATEGORY_GROUPS.flatMap(group => 
    group.roles.map(r => ({
      id: r.id,
      title: r.title,
      categoryName: group.name,
      suggestedSkills: r.suggestedSkills
    }))
  );

/**
 * Returns suggested primary skills based on the chosen target role
 */
export function getSuggestedSkillsForRole(role: TargetRole | string): string[] {
  if (!role) return ROLE_CATEGORY_GROUPS[0].roles[0].suggestedSkills;

  const found = ALL_TARGET_ROLES.find(r => r.id === role || r.title.toLowerCase() === role.toLowerCase());
  if (found) {
    return found.suggestedSkills;
  }

  const roleLower = role.toLowerCase();
  if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre') || roleLower.includes('kubernetes')) {
    return ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Bash Scripting', 'GitHub Actions', 'Prometheus', 'Ansible'];
  }
  if (roleLower.includes('product') || roleLower.includes('business') || roleLower.includes('finance') || roleLower.includes('marketing')) {
    return ['Product Strategy', 'Agile & Scrum', 'User Journey Mapping', 'A/B Testing', 'Jira / Confluence', 'Wireframing & Figma', 'Data Analytics', 'Market Research'];
  }
  if (roleLower.includes('mechanical') || roleLower.includes('cad') || roleLower.includes('thermal') || roleLower.includes('hvac')) {
    return ['SolidWorks', 'AutoCAD', 'Thermodynamics', 'ANSYS FEA', 'GD&T', 'MATLAB', 'Manufacturing Processes', 'Machine Design'];
  }
  if (roleLower.includes('electrical') || roleLower.includes('embedded') || roleLower.includes('electronics') || roleLower.includes('power')) {
    return ['Power Systems', 'AutoCAD Electrical', 'MATLAB / Simulink', 'Embedded C/C++', 'PCB Design', 'ETAP', 'Microcontrollers', 'Circuit Analysis'];
  }
  if (roleLower.includes('doctor') || roleLower.includes('physician') || roleLower.includes('medical') || roleLower.includes('clinical') || roleLower.includes('health') || roleLower.includes('nurse')) {
    return ['Clinical Diagnosis', 'Patient Management', 'Internal Medicine', 'Emergency Care (BLS/ACLS)', 'Pharmacology', 'Electronic Health Records (EHR)', 'Inpatient Care'];
  }
  if (roleLower.includes('biomedical')) {
    return ['Medical Device Maintenance', 'Biomedical Sensors', 'ISO 13485 Compliance', 'Signal Processing (ECG/EEG)', 'Diagnostic Imaging', 'Patient Safety'];
  }
  if (roleLower.includes('civil') || roleLower.includes('structural')) {
    return ['AutoCAD Civil 3D', 'ETABS', 'STAAD.Pro', 'Site Supervision', 'Concrete Technology', 'Structural Analysis', 'BOQ Estimation'];
  }
  if (roleLower.includes('ai') || roleLower.includes('machine learning')) {
    return ['Python', 'PyTorch', 'Generative AI', 'LLMs', 'LangChain', 'FastAPI', 'RAG Pipelines', 'Vector Databases', 'Docker'];
  }

  // Default to Full Stack / Tech
  return ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'REST APIs', 'Tailwind CSS', 'Git', 'MongoDB'];
}

/**
 * Returns aggregated, de-duplicated suggested skills for multiple chosen target roles
 */
export function getSuggestedSkillsForRoles(roles: (TargetRole | string)[]): string[] {
  if (!roles || roles.length === 0) {
    return getSuggestedSkillsForRole('Full Stack Developer');
  }
  const skillsSet = new Set<string>();
  roles.forEach(role => {
    const list = getSuggestedSkillsForRole(role);
    list.forEach(s => skillsSet.add(s));
  });
  return Array.from(skillsSet);
}

export interface CountryLocationOption {
  country: string;
  flag: string;
  region: string;
  popularCities: string[];
}

export const ALL_COUNTRIES_LIST: CountryLocationOption[] = [
  {
    country: 'Worldwide / Global Remote',
    flag: '🌐',
    region: 'Global',
    popularCities: ['Global Remote', 'Anywhere in the World', 'Remote Worldwide']
  },
  {
    country: 'Pakistan',
    flag: '🇵🇰',
    region: 'South Asia',
    popularCities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Faisalabad', 'Remote (Pakistan)']
  },
  {
    country: 'United States',
    flag: '🇺🇸',
    region: 'North America',
    popularCities: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Remote (USA)']
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    popularCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Cambridge', 'Remote (UK)']
  },
  {
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    popularCities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Remote (UAE)']
  },
  {
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    region: 'Middle East',
    popularCities: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'NEOM', 'Remote (KSA)']
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    popularCities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Stuttgart', 'Remote (Germany)']
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    region: 'North America',
    popularCities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Waterloo', 'Remote (Canada)']
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    popularCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Remote (Australia)']
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    region: 'Southeast Asia',
    popularCities: ['Singapore Central', 'Jurong', 'Changi', 'Remote (Singapore)']
  },
  {
    country: 'Qatar',
    flag: '🇶🇦',
    region: 'Middle East',
    popularCities: ['Doha', 'Al Rayyan', 'Lusail']
  },
  {
    country: 'India',
    flag: '🇮🇳',
    region: 'South Asia',
    popularCities: ['Bangalore', 'Mumbai', 'Delhi / NCR', 'Hyderabad', 'Pune', 'Remote (India)']
  },
  {
    country: 'Turkey',
    flag: '🇹🇷',
    region: 'Europe/Middle East',
    popularCities: ['Istanbul', 'Ankara', 'Izmir']
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    region: 'East Asia',
    popularCities: ['Tokyo', 'Osaka', 'Yokohama', 'Kyoto']
  },
  {
    country: 'Ireland',
    flag: '🇮🇪',
    region: 'Europe',
    popularCities: ['Dublin', 'Cork', 'Galway', 'Remote (Ireland)']
  },
  {
    country: 'Netherlands',
    flag: '🇳🇱',
    region: 'Europe',
    popularCities: ['Amsterdam', 'Rotterdam', 'Eindhoven', 'Utrecht']
  },
  {
    country: 'Switzerland',
    flag: '🇨🇭',
    region: 'Europe',
    popularCities: ['Zurich', 'Geneva', 'Basel', 'Lausanne']
  },
  {
    country: 'Sweden',
    flag: '🇸🇪',
    region: 'Europe',
    popularCities: ['Stockholm', 'Gothenburg', 'Malmö']
  },
  {
    country: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    popularCities: ['Paris', 'Lyon', 'Toulouse', 'Marseille']
  },
  {
    country: 'Spain',
    flag: '🇪🇸',
    region: 'Europe',
    popularCities: ['Madrid', 'Barcelona', 'Valencia']
  },
  {
    country: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    popularCities: ['Milan', 'Rome', 'Turin']
  },
  {
    country: 'Malaysia',
    flag: '🇲🇾',
    region: 'Southeast Asia',
    popularCities: ['Kuala Lumpur', 'Penang', 'Cyberjaya']
  },
  {
    country: 'South Korea',
    flag: '🇰🇷',
    region: 'East Asia',
    popularCities: ['Seoul', 'Busan', 'Pangyo Techno Valley']
  },
  {
    country: 'South Africa',
    flag: '🇿🇦',
    region: 'Africa',
    popularCities: ['Johannesburg', 'Cape Town', 'Durban']
  },
  {
    country: 'Egypt',
    flag: '🇪🇬',
    region: 'Middle East/Africa',
    popularCities: ['Cairo', 'Alexandria', 'Giza']
  },
  {
    country: 'New Zealand',
    flag: '🇳🇿',
    region: 'Oceania',
    popularCities: ['Auckland', 'Wellington', 'Christchurch']
  }
];
