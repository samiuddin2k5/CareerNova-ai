import { jsPDF } from 'jspdf';
import { CandidateProfile, TailoredResume, JobPosting } from '../types';

/**
 * Generates an executive, ATS-friendly, and beautifully formatted PDF resume 
 * perfectly matching Syed Samiuddin Ahmed's verified background and credentials.
 */
export function generateResumePdf(
  profile: CandidateProfile,
  tailored?: TailoredResume,
  job?: JobPosting
): { blob: Blob; dataUrl: string; filename: string; base64: string } {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // Header section
  // Main Candidate Name
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(profile.fullName, margin, 46);

  // Subtitle / Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229); // indigo-600 / violet
  const titleText = tailored?.targetJobTitle 
    ? `${tailored.targetJobTitle} (Tailored for ${job?.company || 'Target Company'})` 
    : (profile.title || 'Software Engineer');
  doc.text(titleText, margin, 62);

  // Contact Info Top Right / Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // slate-700
  const contactText1 = `Phone: ${profile.phone || 'Contact via Email'}  |  Email: ${profile.email}`;
  const contactText2 = `Location: ${profile.location || 'Pakistan'}  |  Status: Open for Opportunities`;
  
  doc.text(contactText1, margin, 78);
  doc.text(contactText2, margin, 90);

  // Divider Line below Header
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(1);
  doc.line(margin, 98, margin + contentWidth, 98);

  let y = 114;

  // Helper for Section Headings
  const drawHeading = (title: string, yPos: number): number => {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, yPos);

    doc.setDrawColor(79, 70, 229); // violet accent
    doc.setLineWidth(1.5);
    doc.line(margin, yPos + 3, margin + 140, yPos + 3);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin + 140, yPos + 3, margin + contentWidth, yPos + 3);

    return yPos + 16;
  };

  // 1. ABOUT Section
  y = drawHeading('About', y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  
  const aboutText = tailored?.tailoredSummary || profile.summary || 
    'Passionate and enthusiastic Full Stack Developer skilled in building modern, responsive, and user-friendly web applications. Experienced in React.js, Python, Java, HTML, CSS, JavaScript, AI, and Figma. Dedicated to creating innovative digital solutions, attractive UI/UX designs, and scalable applications while continuously learning new technologies. Open to all types of software-related work, including web development, software development, AI solutions, automation, software testing, database management, UI/UX design, mobile applications, and emerging technology projects. Adaptable, quick to learn, and committed to delivering high-quality software solutions across diverse domains.';
  
  const splitAbout = doc.splitTextToSize(aboutText, contentWidth);
  doc.text(splitAbout, margin, y);
  y += splitAbout.length * 11 + 10;

  // 2. KEY ACHIEVEMENTS & FEATURED PROJECTS
  y = drawHeading('Key Achievements & Projects', y);

  const achievementsList = [
    {
      title: 'Crime Record Management System: Full Stack Project',
      positionBadge: '1st Position - University Project Exhibition',
      bullets: [
        'Developed a Full Stack Criminal Record Management System using React.js, HTML, CSS, JavaScript, and Python/Java to efficiently manage criminal records, FIRs, and case details.',
        'Implemented secure authentication, real-time data handling, database integration, and CRUD operations while designing a modern, responsive, and user-friendly interface.',
        'Presented the project at a University Project Exhibition and secured 1st Position for its innovative features, functionality, and modern UI/UX design.'
      ]
    },
    {
      title: 'Car Damage Detection : AI Project',
      positionBadge: '2nd Position - AI Project Exhibition',
      bullets: [
        'Developed an AI-powered Full Stack Vehicle Damage Detection System using React.js, Python, Machine Learning, HTML, CSS, and JavaScript to identify vehicle damages such as dents, scratches, and broken parts from images.',
        'Integrated image processing and AI models to provide real-time, accurate damage analysis and automated damage reporting through a modern and user-friendly interface.',
        'Presented the project at an AI Project Exhibition and secured 2nd Position for its innovative use of Artificial Intelligence and practical real-world application.'
      ]
    },
    {
      title: 'AI-Powered Smart Emergency Dispatch System – Full Stack Project',
      positionBadge: '1st Position - University Project Exhibition',
      bullets: [
        'Developed an AI-powered Full Stack Smart Emergency Dispatch System using React.js, HTML, CSS, JavaScript, Node.js, Express.js, and AI technologies to efficiently manage emergency requests, ambulance dispatching, and patient case handling.',
        'Implemented secure authentication, AI-based emergency severity analysis, real-time ambulance tracking, database integration, notifications, and CRUD operations while designing a modern, responsive, and user-friendly interface.',
        'Presented the project at a University Project Exhibition and secured 1st Position for its innovative features, intelligent automation, functionality, and modern UI/UX design.'
      ]
    }
  ];

  achievementsList.forEach(item => {
    if (y > pageHeight - 75) {
      doc.addPage();
      y = 40;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(item.title, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // emerald-600
    const badgeW = doc.getTextWidth(item.positionBadge);
    doc.text(item.positionBadge, margin + contentWidth - badgeW, y);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    item.bullets.forEach(bullet => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 40;
      }
      doc.text('•', margin + 4, y);
      const splitBullet = doc.splitTextToSize(bullet, contentWidth - 16);
      doc.text(splitBullet, margin + 14, y);
      y += splitBullet.length * 10 + 2;
    });

    y += 4;
  });

  // 3. EDUCATION & CERTIFICATIONS (2-column layout in bottom section)
  y += 2;
  const colWidth = (contentWidth - 20) / 2;

  // Left Col: Education
  const yStartCols = y;
  let yLeft = drawHeading('Education', yStartCols);

  const educationList = [
    { degree: 'Software Engineering', inst: 'Sir Syed University', year: '2027', grade: 'GPA 3.4' },
    { degree: 'Intermediate', inst: 'Usman Public College', year: '2022', grade: 'Grade A' },
    { degree: 'Matriculation', inst: 'Usman Public School', year: '2020', grade: 'Grade A+' }
  ];

  educationList.forEach(edu => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(edu.degree, margin, yLeft);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`${edu.year} | ${edu.grade}`, margin + colWidth - 75, yLeft);
    yLeft += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(edu.inst, margin, yLeft);
    yLeft += 11;
  });

  // Right Col: Certifications
  const rightMargin = margin + colWidth + 20;
  let yRight = yStartCols;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATION', rightMargin, yRight);

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.5);
  doc.line(rightMargin, yRight + 3, rightMargin + 100, yRight + 3);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(rightMargin + 100, yRight + 3, rightMargin + colWidth, yRight + 3);
  yRight += 16;

  const certificationsList = [
    { name: 'React.js', date: '2025 | Knowledge Gate' },
    { name: 'Html/Css/Javascript', date: '2024 | Coursera' },
    { name: 'Generative AI', date: '2024 | Coursera' },
    { name: 'Programing Fundamental', date: '2025 | Great Learning' },
    { name: 'Python', date: '2025 | Great Learning' },
    { name: 'Agentic AI', date: '2025 | Great Learning' }
  ];

  certificationsList.forEach(cert => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(cert.name, rightMargin, yRight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(cert.date, rightMargin + colWidth - 95, yRight);
    yRight += 11;
  });

  y = Math.max(yLeft, yRight) + 6;

  // 4. SKILLS SECTION
  y = drawHeading('Skills', y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const skills = [
    'Python', 'Java', 'React js', 'Frontend Developement', 'Backend Developement', 
    'Figma', 'HTML/CSS/JS', 'Node js', 'Manual Testing', 'Automation Testing', 
    'MongoDB', 'Basic Knowledge of Agentic ai', 'Basic Knowledge of Generative ai', 
    'n8n Experience', 'Next.js'
  ];

  const skillString = skills.join('   •   ');
  const splitSkills = doc.splitTextToSize(skillString, contentWidth);
  doc.text(splitSkills, margin, y);
  y += splitSkills.length * 10 + 10;

  // Footer Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  const footerNote = tailored
    ? `Tailored ATS Resume for ${job?.company || 'Target Employer'} • ${profile.fullName} • ${profile.email}`
    : `Verified Candidate Resume • ${profile.fullName} • ${profile.email} • ${profile.location}`;
  doc.text(footerNote, margin, pageHeight - 20);

  const filename = tailored
    ? `${profile.fullName.replace(/\s+/g, '_')}_Resume_${(job?.company || 'Tailored').replace(/[^a-zA-Z0-9]/g, '')}.pdf`
    : `${profile.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

  const blob = doc.output('blob');
  const dataUrl = doc.output('datauristring');
  const rawBase64 = dataUrl.split(',')[1] || '';

  return { blob, dataUrl, filename, base64: rawBase64 };
}

export function downloadResumePdf(
  profile: CandidateProfile,
  tailored?: TailoredResume,
  job?: JobPosting
) {
  const { blob, filename } = generateResumePdf(profile, tailored, job);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
