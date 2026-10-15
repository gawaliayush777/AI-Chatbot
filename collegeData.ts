export interface DepartmentInfo {
  code: string;
  name: string;
  hod: string;
  hodCabin: string;
  hodEmail: string;
  coordinator: string;
  coordinatorEmail: string;
  phoneExt: string;
}

export interface CIEExamSchedule {
  exam: string;
  dateRange: string;
  syllabusPortion: string;
  duration: string;
  maxMarks: number;
  weightage: string;
  notes: string;
}

export interface ImportantDate {
  event: string;
  date: string;
  targetAudience: string;
  category: 'CIE' | 'Assignment' | 'Project' | 'Fees' | 'Portal';
}

export interface FacultyContact {
  name: string;
  designation: string;
  department: string;
  cabin: string;
  email: string;
  phone: string;
  officeHours: string;
}

export interface OfficeContact {
  office: string;
  inCharge: string;
  location: string;
  email: string;
  phone: string;
  timing: string;
  responsibilities: string[];
}

export interface PortalFAQ {
  issue: string;
  solution: string[];
  helpline: string;
}

export const COLLEGE_NAME = "Apex Institute of Science & Technology (AIST)";
export const COLLEGE_ACCREDITATION = "Autonomous Institution | Affiliated to State Technological University | NAAC 'A+' Accredited";
export const ACADEMIC_TERM = "Even Semester (Spring 2026)";

export const CIE_SCHEDULES: CIEExamSchedule[] = [
  {
    exam: "CIE - 1 (Continuous Internal Evaluation 1)",
    dateRange: "March 23, 2026 – March 28, 2026",
    syllabusPortion: "Units 1 and 2 (First 40% of syllabus)",
    duration: "90 Minutes per paper (2 sessions/day: 10:00 AM & 2:00 PM)",
    maxMarks: 50,
    weightage: "Scaled to 20 marks in final internal evaluation",
    notes: "Mandatory for all enrolled students. No re-test except on approved medical grounds with CoE permission."
  },
  {
    exam: "CIE - 2 (Continuous Internal Evaluation 2)",
    dateRange: "May 11, 2026 – May 16, 2026",
    syllabusPortion: "Units 3, 4, and 5 (Remaining 60% of syllabus)",
    duration: "90 Minutes per paper",
    maxMarks: 50,
    weightage: "Scaled to 20 marks in final internal evaluation",
    notes: "Syllabus covers full application problems and design case studies."
  },
  {
    exam: "Improvement / Makeup CIE Test",
    dateRange: "May 25, 2026 – May 28, 2026",
    syllabusPortion: "Comprehensive (Full Syllabus: Units 1 to 5)",
    duration: "90 Minutes per paper",
    maxMarks: 50,
    weightage: "Best 2 out of 3 CIE scores considered for final CIE marks computation",
    notes: "Eligible for students with genuine attendance/medical leaves approved by Dean Academics, or those wishing to improve aggregate score."
  }
];

export const ATTENDANCE_POLICY = {
  minimumMandatory: "75% overall in each registered subject (theory and lab separately)",
  recommendedTarget: "85% or higher for academic distinction and campus placements eligibility",
  condonationBracket: "65% to 74.9%",
  condonationCondition: "Permitted only on authentic medical grounds (hospitalization certificate submitted within 3 days of return) or authorized college representation in sports/cultural/hackathons. Subject to Principal approval & condonation fee of ₹500 per subject.",
  detentionRule: "Below 65% under ANY circumstance leads to detention (NSR - Not Satisfied Requirements). Detained students are not permitted to write Semester End Examinations (SEE) and must repeat the course.",
  portalTracking: "Attendance is updated daily by 5:00 PM on Student ERP portal (portal.aist.edu). Discrepancies must be raised with course faculty within 48 hours."
};

export const MARKS_EVALUATION_SCHEME = {
  totalInternalMarks: 50,
  breakdown: [
    { component: "CIE Written Tests (Best 2 of 3)", marks: 30, description: "Average of two best 50-mark tests scaled down to 30" },
    { component: "Continuous Assignments & Quizzes", marks: 10, description: "Two LMS assignments (5 marks each) based on Blooms taxonomy" },
    { component: "Course Seminar / Mini-Activity / Case Study", marks: 5, description: "Subject-specific collaborative report or presentation" },
    { component: "Attendance & Class Participation", marks: 5, description: "90-100%: 5 marks; 85-89%: 4 marks; 80-84%: 3 marks; 75-79%: 2 marks" }
  ],
  minimumEligibilityForSEE: "Student must score at least 20 out of 50 (40%) in CIE to be eligible to appear for Semester End Examination (SEE).",
  seeWeightage: "Semester End Exam (SEE) is for 100 marks scaled down to 50 marks. Total Grade = CIE (50) + SEE (50) = 100 marks.",
  grievanceProcess: "Evaluated CIE test answer booklets are distributed within 7 days of test. Students may apply for mark re-verification at the Exam Section within 3 days of marks display."
};

export const LAB_AND_PROJECT_GUIDELINES = {
  laboratory: {
    continuousAssessment: "30 Marks (Pre-lab test 5 marks, conduct of experiment 15 marks, lab record/journal 10 marks)",
    internalLabTestViva: "20 Marks (Conducted during the 13th week of the semester)",
    journalRule: "Weekly lab observation sheets must be signed on the day of practicals. Late submission loses 2 marks per session.",
    safetyAndDressCode: "Navy blue lab coat and closed shoes are strictly required in mechanical/chemistry/electrical labs."
  },
  projectSubmissions: [
    { milestone: "Phase 1: Problem Definition & Synopsis", deadline: "February 28, 2026", marks: "10% weightage" },
    { milestone: "Phase 2: Interim Design & Prototype Demo", deadline: "April 18, 2026", marks: "30% weightage" },
    { milestone: "Phase 3: Final Code Review, Plagiarism Check (<15%)", deadline: "May 20, 2026", marks: "30% weightage" },
    { milestone: "Final Project Report Submission & Demo", deadline: "June 2, 2026", marks: "30% weightage" }
  ]
};

export const IMPORTANT_DATES: ImportantDate[] = [
  { event: "Even Semester Registration & Classes Begin", date: "February 2, 2026", targetAudience: "All Semesters", category: "Portal" },
  { event: "Project Synopsis Submission Deadline", date: "February 28, 2026", targetAudience: "Final & Pre-final Year", category: "Project" },
  { event: "CIE - 1 Examination Period", date: "March 23 – 28, 2026", targetAudience: "Semesters 2, 4, 6, 8", category: "CIE" },
  { event: "CIE - 1 Marks Display on Portal", date: "April 6, 2026", targetAudience: "All Students", category: "CIE" },
  { event: "Mid-Term Project Review", date: "April 18, 2026", targetAudience: "B.Tech / M.Tech Projects", category: "Project" },
  { event: "Tuition Fee Balance & Exam Fee Payment Deadline", date: "April 30, 2026", targetAudience: "All Students", category: "Fees" },
  { event: "Assignment 2 LMS Submission Deadline", date: "May 5, 2026", targetAudience: "All Courses", category: "Assignment" },
  { event: "CIE - 2 Examination Period", date: "May 11 – 16, 2026", targetAudience: "Semesters 2, 4, 6, 8", category: "CIE" },
  { event: "Improvement / Makeup CIE Test", date: "May 25 – 28, 2026", targetAudience: "Eligible Students", category: "CIE" },
  { event: "Final CIE Marks & Attendance Shortage List", date: "June 1, 2026", targetAudience: "All Students", category: "CIE" },
  { event: "Practical & Viva Examinations (SEE Labs)", date: "June 5 – 12, 2026", targetAudience: "All Engineering Branches", category: "CIE" },
  { event: "Semester End Theory Examinations (SEE)", date: "June 15 – July 4, 2026", targetAudience: "All Students", category: "CIE" }
];

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    code: "CSE",
    name: "Computer Science & Engineering",
    hod: "Dr. K. S. Venkatesh",
    hodCabin: "Academic Block A, Room 302",
    hodEmail: "hod.cse@aist.edu",
    coordinator: "Prof. Priya Nair",
    coordinatorEmail: "cie.cse@aist.edu",
    phoneExt: "302"
  },
  {
    code: "AI_DS",
    name: "Artificial Intelligence & Data Science",
    hod: "Dr. Ananya Roy",
    hodCabin: "Tech Center Block, Room 204",
    hodEmail: "hod.aids@aist.edu",
    coordinator: "Prof. Rajesh Verma",
    coordinatorEmail: "cie.aids@aist.edu",
    phoneExt: "214"
  },
  {
    code: "ECE",
    name: "Electronics & Communication Engineering",
    hod: "Dr. Sudhir Deshmukh",
    hodCabin: "Academic Block B, Room 201",
    hodEmail: "hod.ece@aist.edu",
    coordinator: "Dr. Meenakshi Sundaram",
    coordinatorEmail: "cie.ece@aist.edu",
    phoneExt: "201"
  },
  {
    code: "MECH",
    name: "Mechanical Engineering",
    hod: "Dr. Arvind Kulkarni",
    hodCabin: "Workshop Complex, Room W-105",
    hodEmail: "hod.mech@aist.edu",
    coordinator: "Prof. Sunil Joshi",
    coordinatorEmail: "cie.mech@aist.edu",
    phoneExt: "105"
  },
  {
    code: "CIVIL",
    name: "Civil Engineering",
    hod: "Dr. B. R. Patil",
    hodCabin: "Structures Block, Room C-102",
    hodEmail: "hod.civil@aist.edu",
    coordinator: "Prof. Sneha Deshpande",
    coordinatorEmail: "cie.civil@aist.edu",
    phoneExt: "112"
  },
  {
    code: "ISE",
    name: "Information Science & Engineering",
    hod: "Dr. Geetha Krishnan",
    hodCabin: "Academic Block A, Room 405",
    hodEmail: "hod.ise@aist.edu",
    coordinator: "Prof. Varun Hegde",
    coordinatorEmail: "cie.ise@aist.edu",
    phoneExt: "405"
  }
];

export const OFFICES: OfficeContact[] = [
  {
    office: "Controller of Examinations (CoE) Cell",
    inCharge: "Dr. M. S. Raghavan, Chief Controller",
    location: "Administrative Block, 1st Floor, Room 114",
    email: "coe@aist.edu",
    phone: "+91 80 2345 6789 / Ext 114",
    timing: "Mon - Sat: 9:30 AM – 5:00 PM (Lunch: 1:00 PM – 2:00 PM)",
    responsibilities: [
      "CIE timetable publishing & hall ticket issues",
      "Marks discrepancies, re-evaluation, and grade sheets",
      "Special medical exam permissions & makeup tests",
      "Malpractice inquiry committee"
    ]
  },
  {
    office: "Student ERP & IT Help Desk",
    inCharge: "Mr. Sandeep G., Systems Administrator",
    location: "Central Computing Center, Ground Floor, Room G-08",
    email: "portal-support@aist.edu",
    phone: "+91 80 2345 6792 / Ext 410",
    timing: "Mon - Sat: 9:00 AM – 6:00 PM",
    responsibilities: [
      "Student portal password resets & account unlock",
      "Course registration, elective choices & OTP issues",
      "LMS submission glitches & receipt download errors",
      "Campus Wi-Fi credentials"
    ]
  },
  {
    office: "Accounts & Scholarship Section",
    inCharge: "Mr. R. Natarajan, Finance Officer",
    location: "Administrative Block, Ground Floor, Room 102",
    email: "accounts@aist.edu",
    phone: "+91 80 2345 6790 / Ext 102",
    timing: "Mon - Fri: 10:00 AM – 4:00 PM",
    responsibilities: [
      "Tuition fee dues, installment requests & fee receipts",
      "National Scholarship Portal (NSP) verification",
      "State Post-Matric & SC/ST Freeship forms",
      "Merit-based fee concession applications"
    ]
  },
  {
    office: "Dean of Student Welfare & Mentoring",
    inCharge: "Prof. Sunita Menon",
    location: "Student Activity Center, 1st Floor, Room SAC-101",
    email: "dsw@aist.edu",
    phone: "+91 80 2345 6795 / Ext 150",
    timing: "Mon - Fri: 10:00 AM – 4:30 PM",
    responsibilities: [
      "Student counseling, stress management & mental health",
      "Condonation applications on emergency health grounds",
      "Hostel accommodation and mess issues",
      "Anti-ragging committee complaints"
    ]
  },
  {
    office: "Central Library & Digital Repository",
    inCharge: "Dr. H. N. Shreedhar, Chief Librarian",
    location: "Central Library Building (4 Floors)",
    email: "library@aist.edu",
    phone: "+91 80 2345 6798 / Ext 250",
    timing: "Mon - Sat: 8:00 AM – 10:00 PM (Exam time: 8:00 AM – 12:00 Midnight)",
    responsibilities: [
      "Previous years CIE question papers & model answer keys",
      "IEEE, Springer, ScienceDirect remote access credentials",
      "Book bank book issuing for all semesters",
      "Plagiarism check reports (Turnitin)"
    ]
  }
];

export const PORTAL_FAQS: PortalFAQ[] = [
  {
    issue: "Forgot password or Student ERP account locked",
    solution: [
      "Navigate to portal.aist.edu and click 'Forgot Password'.",
      "Enter your official University Seat Number (USN) and registered mobile number.",
      "An OTP will be delivered via SMS and your college email (usn@student.aist.edu).",
      "If locked due to 5 consecutive wrong attempts, wait 30 minutes for auto-unlock, or email portal-support@aist.edu with your Student ID card photo."
    ],
    helpline: "portal-support@aist.edu | Ext: 410"
  },
  {
    issue: "How can I check my CIE marks on the portal?",
    solution: [
      "Log in to portal.aist.edu with your credentials.",
      "Open left menu -> 'Academic Records' -> 'Continuous Internal Evaluation (CIE)'.",
      "Select 'Spring 2026' semester from the dropdown.",
      "View test marks, assignment grades, and continuous lab rubrics. You can also download the signed PDF summary."
    ],
    helpline: "cie@aist.edu"
  },
  {
    issue: "Attendance discrepancy or missing hours",
    solution: [
      "Subject attendance is uploaded directly by the course teacher by 5 PM.",
      "If you were marked absent during an authorized college event or valid on-duty, submit an On-Duty (OD) form signed by your faculty advisor within 3 working days.",
      "Meet your department CIE coordinator if the record is not corrected within 48 hours."
    ],
    helpline: "Contact Department CIE Coordinator"
  },
  {
    issue: "Course registration / elective not showing up",
    solution: [
      "Open 'Academics' -> 'Course Registration'.",
      "Verify that previous semester fee dues are cleared; pending fees trigger an automated hold.",
      "If fee is paid, click 'Refresh ERP Cache' or visit Room G-08 with your fee payment receipt."
    ],
    helpline: "Room G-08, Central Computing Center"
  }
];

export const EXAM_RULES = [
  "Entry to CIE hall closes 15 minutes after the examination start time.",
  "Valid Student Physical ID Card is mandatory on the desk at all times.",
  "Calculators: Only non-programmable scientific calculators (e.g., Casio fx-991ES/MS or equivalent) are allowed.",
  "Smart watches, mobile phones, earphones, and cheat notes are strictly prohibited and confiscated immediately.",
  "Possession of unauthorized material attracts severe disciplinary penalty under Rule 14 (Suspension from current and subsequent CIE tests).",
  "Students cannot leave the examination hall during the first 45 minutes or the last 10 minutes.",
  "Writing on question papers other than USN is deemed malpractice."
];

export const SCHOLARSHIPS_INFO = [
  {
    title: "AIST Merit Scholarship",
    benefit: "25% to 50% tuition fee waiver",
    eligibility: "Top 5% CGPA holders in each branch with minimum 8.5 CGPA and zero active backlogs.",
    deadline: "March 31, 2026",
    applyAt: "Dean Academics Office / Accounts Room 102"
  },
  {
    title: "State Post-Matric & Freeship Scheme",
    benefit: "Up to 100% tuition reimbursement + maintenance allowance",
    eligibility: "Category SC/ST/OBC/Minority students as per state income ceiling.",
    deadline: "April 15, 2026",
    applyAt: "State ePass / SSP Portal (Institutional Verification at Room 102)"
  },
  {
    title: "National Scholarship Portal (NSP Central Sector)",
    benefit: "₹12,000 to ₹20,000 per annum",
    eligibility: "Higher Secondary percentile criteria (>80th percentile) with family income < 4.5 LPA.",
    deadline: "April 30, 2026",
    applyAt: "scholarships.gov.in (Submit printout to Admin Office)"
  }
];

export const SUGGESTED_QUESTIONS = [
  "When is my CIE exam?",
  "What is the attendance requirement?",
  "How can I check my marks?",
  "When is my assignment deadline?",
  "What happens if I miss a CIE test?",
  "How do I reset my portal password?",
  "What is the pass mark for CIE?",
  "Who is the Controller of Examinations?"
];
