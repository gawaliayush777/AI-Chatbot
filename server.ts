import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  COLLEGE_NAME,
  ACADEMIC_TERM,
  CIE_SCHEDULES,
  ATTENDANCE_POLICY,
  MARKS_EVALUATION_SCHEME,
  LAB_AND_PROJECT_GUIDELINES,
  IMPORTANT_DATES,
  DEPARTMENTS,
  OFFICES,
  PORTAL_FAQS,
  EXAM_RULES,
  SCHOLARSHIPS_INFO
} from './src/data/collegeData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Build comprehensive system instruction grounding the model in official college documents
const SYSTEM_INSTRUCTION = `
You are the official AI-powered Student Help Desk Chatbot for ${COLLEGE_NAME} during ${ACADEMIC_TERM}.

Your role is to assist college students with accurate, simple, polite, and reassuring answers regarding:
1. CIE Exams:
   - CIE-1: March 23 – March 28, 2026 (Units 1 & 2, 90 mins, 50 marks scaled to 20).
   - CIE-2: May 11 – May 16, 2026 (Units 3, 4, 5, 90 mins, 50 marks scaled to 20).
   - Improvement / Makeup CIE: May 25 – May 28, 2026 (Full syllabus, best 2 of 3 taken).
   - Minimum eligibility to appear for Semester End Exam (SEE): 40% (at least 20 out of 50 in CIE total).
2. Attendance Policy:
   - Minimum mandatory: 75% in each subject (theory and practical separately).
   - 65% to 74.9%: Eligible for medical condonation only with official hospital certificate within 3 days and Principal's sanction (₹500 subject fee).
   - Below 65%: Strictly detained (NSR - Not Satisfied Requirements). Must re-register next year.
3. Marks & Evaluation Scheme:
   - Total Internal Marks: 50.
   - Breakdown: Best 2 Tests (30 marks) + 2 LMS Assignments (10 marks) + Mini-project/Seminar (5 marks) + Attendance & Participation (5 marks).
   - Final course grade = CIE (50) + SEE (50) = 100 marks.
4. Assignments & Practicals:
   - Assignments: 2 mandatory LMS submissions. Late penalty: 10% deduction/day, closed after 3 days.
   - Lab Practical CIE: 30 marks continuous lab journal & assessment + 20 marks Lab Test/Viva in Week 13.
   - Project Submissions: Phase 1 Synopsis (Feb 28), Interim Demo (April 18), Final Code & Plagiarism <15% (May 20), Final Report (June 2).
5. Student Portal Troubleshooting:
   - Portal URL: portal.aist.edu
   - Forgot Password: Use USN + registered phone number for SMS OTP.
   - Account Locked: 5 failed attempts locks for 30 minutes. Contact portal-support@aist.edu or IT Desk Room G-08 (Ext 410).
   - Marks display: Academic Records -> Continuous Internal Evaluation (CIE) -> Select Spring 2026.
6. Campus Directory & Key Offices:
   - Controller of Examinations (CoE): Dr. M. S. Raghavan, Admin Block Room 114 (coe@aist.edu, Ext 114).
   - Student ERP Help Desk: Mr. Sandeep G., Central Computing Center Room G-08 (portal-support@aist.edu, Ext 410).
   - Accounts & Scholarships: Mr. R. Natarajan, Admin Block Room 102 (accounts@aist.edu, Ext 102).
   - Dean Student Welfare: Prof. Sunita Menon, Student Activity Center Room SAC-101 (dsw@aist.edu, Ext 150).
   - Central Library: Dr. H. N. Shreedhar, Library Building (library@aist.edu, Ext 250). Open 8 AM - 10 PM (Midnight during exams).
   - Departments:
     * CSE: HOD Dr. K. S. Venkatesh (Room 302, hod.cse@aist.edu), CIE Coord Prof. Priya Nair (cie.cse@aist.edu)
     * AI & DS: HOD Dr. Ananya Roy (Room 204, hod.aids@aist.edu), CIE Coord Prof. Rajesh Verma (cie.aids@aist.edu)
     * ECE: HOD Dr. Sudhir Deshmukh (Room 201, hod.ece@aist.edu), CIE Coord Dr. Meenakshi Sundaram (cie.ece@aist.edu)
     * MECH: HOD Dr. Arvind Kulkarni (Room W-105, hod.mech@aist.edu)
     * CIVIL: HOD Dr. B. R. Patil (Room C-102, hod.civil@aist.edu)
     * ISE: HOD Dr. Geetha Krishnan (Room 405, hod.ise@aist.edu)
7. Exam Rules & Malpractice:
   - Entry closes 15 mins after test start.
   - Physical Student ID card is mandatory on the desk.
   - Only non-programmable scientific calculators (e.g. Casio fx-991ES) permitted.
   - Mobile phones, smartwatches, and notes are strictly prohibited (Rule 14 suspension penalty).

CRITICAL AI GUIDELINES & ETHICS:
- Understand natural-language questions and generate concise, polite, accurate responses.
- NEVER invent or make up personal marks, individual student attendance percentages, or non-existent policies.
- If a student asks for their private individual records (e.g. "What is my attendance?", "How much marks did I get?", "Check my USN 1AY21CS042"):
  Politely inform them that confidential academic data is protected and not accessible via the public chat assistant. Provide the exact steps to log into portal.aist.edu to see their official scores securely, or direct them to their Department CIE coordinator.
- If a question cannot be resolved by official guidelines, provide a clear fallback response directing them to the specific faculty coordinator, CoE office (Admin Block Room 114), or Student ERP Desk (Room G-08).
- Keep responses clean, well structured using markdown formatting (bullet points, bold text).
- At the end of your answer, include 2 or 3 quick suggested follow-up questions formatted on separate lines beginning with "FOLLOW_UP: <Question>". Example:
  FOLLOW_UP: How can I check my marks on the portal?
  FOLLOW_UP: What happens if I miss CIE-1?
`;

// Helper: Local fallback knowledge matcher for offline or unconfigured API state
function generateLocalFactualResponse(query: string, studentProfile?: any) {
  const q = query.toLowerCase();

  if (q.includes('cie') || q.includes('exam date') || q.includes('timetable') || q.includes('when is my exam') || q.includes('schedule')) {
    return {
      text: `### 📅 CIE Examination Schedule (${ACADEMIC_TERM})

Here are the official dates for the Continuous Internal Evaluation tests:

- **CIE - 1**: **March 23 – March 28, 2026**
  - **Syllabus:** Units 1 & 2 (First 40% of syllabus)
  - **Duration:** 90 Minutes per paper (Sessions: 10:00 AM & 2:00 PM)
  - **Max Marks:** 50 (scaled to 20 marks)

- **CIE - 2**: **May 11 – May 16, 2026**
  - **Syllabus:** Units 3, 4, and 5 (Remaining 60%)
  - **Duration:** 90 Minutes per paper

- **Improvement / Makeup CIE**: **May 25 – May 28, 2026**
  - **Syllabus:** Comprehensive (All 5 Units)
  - **Note:** The **best 2 of 3** CIE scores are considered for your final internal marks.

*(Physical Student ID card is mandatory for entry. Hall entry closes 15 minutes after start time).*`,
      followUps: [
        "What is the pass mark for CIE?",
        "What are the exam rules and calculators allowed?",
        "What happens if I miss a CIE test?"
      ],
      category: 'exam'
    };
  }

  if (q.includes('attendance') || q.includes('75%') || q.includes('condonation') || q.includes('detain') || q.includes('shortage')) {
    return {
      text: `### 📊 Official Attendance Regulations

Under AIST autonomous academic guidelines:

1. **Minimum Mandatory:** **75% overall attendance** in every registered theory course and practical lab separately.
2. **Recommended Target:** **85% or higher** for placement eligibility and honor awards.
3. **Medical Condonation (65% – 74.9%):**
   - Granted **strictly** for verified medical emergencies or official college event representation.
   - Medical certificates must be submitted to the Dean of Student Welfare (SAC Room 101) within **3 working days** of returning.
   - Requires Principal's sanction and a condonation fee of ₹500/course.
4. **Strict Detention (< 65%):**
   - Students with attendance below 65% are marked as **NSR (Not Satisfied Requirements)**.
   - Detained students are **not permitted** to appear for Semester End Exams (SEE) and must repeat the course.

*Tip: Check your daily attendance on **portal.aist.edu**. Any discrepancies must be notified to your subject faculty within 48 hours.*`,
      followUps: [
        "How do I submit a medical certificate?",
        "How can I check my attendance on the portal?",
        "When is my CIE exam?"
      ],
      category: 'attendance'
    };
  }

  if (q.includes('mark') || q.includes('score') || q.includes('internal') || q.includes('result') || q.includes('grade') || q.includes('pass')) {
    // If student asks for personal marks
    if (q.includes('my mark') || q.includes('my score') || q.includes('my grade') || q.includes('usn') || q.includes('did i pass')) {
      return {
        text: `### 🔒 Student Privacy & Marks Verification

For your security and privacy, individual marks and personal records are **confidential** and cannot be disclosed via this public chat desk.

**To check your official CIE and Internal Marks:**
1. Visit the student ERP portal: [portal.aist.edu](https://portal.aist.edu)
2. Log in using your **USN** and password.
3. Go to **Academic Records** ➔ **Continuous Internal Evaluation (CIE)**.
4. Select **Spring 2026** semester to view your test scores, assignment grades, and cumulative totals.

**Passing Criteria:**
- Minimum required in CIE: **40% (20 out of 50 marks)** to be eligible for Semester End Exams (SEE).
- Total course grade is calculated as **50% CIE + 50% SEE = 100 marks**.`,
        followUps: [
          "How do I reset my portal password?",
          "How is the 50 marks CIE calculated?",
          "How do I apply for re-evaluation?"
        ],
        category: 'marks'
      };
    }

    return {
      text: `### 💯 CIE Marks Evaluation Scheme (50 Marks Total)

Your total Continuous Internal Evaluation (50 marks) is computed from:

1. **CIE Written Tests (30 Marks):** Average of your best 2 tests (scaled down from 50 marks).
2. **Assignments & Quizzes (10 Marks):** Two continuous LMS assignments (5 marks each).
3. **Seminar / Mini-Course Activity (5 Marks):** Collaborative presentation or report.
4. **Attendance & Participation (5 Marks):**
   - 90–100%: 5 marks
   - 85–89%: 4 marks
   - 80–84%: 3 marks
   - 75–79%: 2 marks

**Minimum Requirement:** You must score at least **20 out of 50 (40%)** in CIE to qualify for the Semester End Examination (SEE).`,
      followUps: [
        "When is my assignment deadline?",
        "When is the CIE-1 test scheduled?",
        "How do I check my marks on the portal?"
      ],
      category: 'marks'
    };
  }

  if (q.includes('assignment') || q.includes('deadline') || q.includes('submission') || q.includes('project') || q.includes('lab') || q.includes('practical')) {
    return {
      text: `### 📝 Assignments, Practicals & Project Deadlines

- **Assignment 2 LMS Deadline:** **May 5, 2026** (11:59 PM)
  - Late submissions receive a 10% penalty per day. The submission portal closes automatically after 3 days.
- **Laboratory Practical Assessment:**
  - Continuous Assessment: **30 Marks** (Lab records must be verified weekly).
  - Internal Lab Test & Viva: **20 Marks** (Conducted during Week 13).
- **Major / Mini Project Milestones:**
  - **Phase 1 (Synopsis):** February 28, 2026
  - **Phase 2 (Interim Prototype Demo):** April 18, 2026
  - **Phase 3 (Code & Plagiarism <15%):** May 20, 2026
  - **Final Report Submission:** June 2, 2026`,
      followUps: [
        "What are the rules for lab journals?",
        "When is the CIE exam schedule?",
        "Who can I contact for project approvals?"
      ],
      category: 'assignment'
    };
  }

  if (q.includes('portal') || q.includes('login') || q.includes('password') || q.includes('locked') || q.includes('erp') || q.includes('otp')) {
    return {
      text: `### 🔑 Student Portal (portal.aist.edu) Troubleshooting

If you are experiencing issues with the student ERP portal:

1. **Forgot Password:**
   - Click "Forgot Password" on the login page.
   - Enter your **USN** and registered mobile number to receive an instant OTP via SMS and college email.
2. **Account Locked:**
   - Accounts lock automatically after 5 incorrect password attempts.
   - The lock expires automatically after **30 minutes**.
   - For immediate reset, contact the **IT Help Desk** (Central Computing Center, Room G-08) or email \`portal-support@aist.edu\` with your Student ID card photo.
3. **Course Registration / Receipt Glitch:**
   - Clear your browser cache or open in Incognito. Ensure previous semester dues are cleared.
   - ERP Help Desk Extension: **Ext 410** (Mon–Sat: 9:00 AM – 6:00 PM).`,
      followUps: [
        "Where is the IT Help Desk located?",
        "How can I check my CIE marks?",
        "When is the tuition fee payment deadline?"
      ],
      category: 'portal'
    };
  }

  if (q.includes('fee') || q.includes('scholarship') || q.includes('accounts') || q.includes('nsp') || q.includes('concession')) {
    return {
      text: `### 💳 Fees & Scholarship Information

- **Tuition Fee & Exam Fee Deadline:** **April 30, 2026**
  - Pay online via Student ERP under the "Fee Payments" tab, or via Demand Draft at Accounts Section (Admin Block Room 102).
- **Available Scholarships:**
  1. **AIST Merit Scholarship:** Top 5% CGPA students in each branch receive a 25%–50% tuition waiver (Apply before March 31, 2026).
  2. **State Post-Matric & Freeship:** SC/ST/OBC/Minority schemes (Apply on state SSP/ePass portal by April 15, 2026).
  3. **National Scholarship Portal (NSP):** Central Sector scheme for merit students (Apply by April 30, 2026).
- **Accounts Office:** Ground Floor, Room 102 (Mon–Fri: 10:00 AM – 4:00 PM, Phone: Ext 102, Email: \`accounts@aist.edu\`).`,
      followUps: [
        "How do I apply for the AIST Merit Scholarship?",
        "Where do I submit my fee receipt?",
        "When is my CIE exam?"
      ],
      category: 'office'
    };
  }

  if (q.includes('faculty') || q.includes('department') || q.includes('hod') || q.includes('coe') || q.includes('controller') || q.includes('office') || q.includes('contact')) {
    return {
      text: `### 🏛️ Key College Offices & Faculty Contacts

- **Controller of Examinations (CoE Cell):**
  - Chief Controller: **Dr. M. S. Raghavan**
  - Location: Admin Block, 1st Floor, Room 114
  - Email: \`coe@aist.edu\` | Phone: Ext 114
- **Student ERP / IT Support Desk:**
  - In-Charge: **Mr. Sandeep G.**
  - Location: Central Computing Center, Room G-08
  - Email: \`portal-support@aist.edu\` | Phone: Ext 410
- **Department Heads (HODs):**
  - **CSE:** Dr. K. S. Venkatesh (Room 302, \`hod.cse@aist.edu\`)
  - **AI & DS:** Dr. Ananya Roy (Room 204, \`hod.aids@aist.edu\`)
  - **ECE:** Dr. Sudhir Deshmukh (Room 201, \`hod.ece@aist.edu\`)
  - **MECH:** Dr. Arvind Kulkarni (Room W-105, \`hod.mech@aist.edu\`)
  - **CIVIL:** Dr. B. R. Patil (Room C-102, \`hod.civil@aist.edu\`)
  - **ISE:** Dr. Geetha Krishnan (Room 405, \`hod.ise@aist.edu\`)`,
      followUps: [
        "Who is the CIE Coordinator for my department?",
        "Where is the Central Library?",
        "When is the CIE-1 exam?"
      ],
      category: 'office'
    };
  }

  // Fallback for general or unmapped questions
  return {
    text: `### ℹ️ CIE Help Desk Guidance

I want to make sure you get the most accurate and up-to-date college information! While I may not have specific official records for this particular question, here is where you can get immediate assistance:

- **For Exam Schedules, Hall Tickets & Marks Disputes:**
  Visit the **Controller of Examinations (CoE)** in **Admin Block, Room 114** or email \`coe@aist.edu\` (Ext 114).
- **For ERP Portal Login, OTP or Registration Issues:**
  Visit the **IT Help Desk** in **Central Computing Center, Room G-08** or email \`portal-support@aist.edu\` (Ext 410).
- **For Course Attendance & Assignments:**
  Please consult your **Subject Course Faculty** or Department CIE Coordinator.

Feel free to ask me about CIE test dates, syllabus portions, attendance criteria, or calculator rules!`,
    followUps: [
      "When is my CIE exam?",
      "What is the attendance requirement?",
      "How do I reset my portal password?",
      "What is the pass mark for CIE?"
    ],
    category: 'general',
    isFallback: true
  };
}

// API: Chat endpoint with Gemini AI integration
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, studentProfile } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const latestMessage = messages[messages.length - 1];
    const userPrompt = latestMessage.text || latestMessage.content || '';

    // If AI service is available with GEMINI_API_KEY
    if (ai) {
      try {
        // Construct conversation contents for Gemini
        const studentContext = studentProfile ? 
          `[Student Context: Name: ${studentProfile.name || 'Student'}, USN: ${studentProfile.usn || 'Unspecified'}, Dept: ${studentProfile.department || 'All'}, Semester: ${studentProfile.semester || 'All'}]` : 
          '';

        // Prepare previous turns for multi-turn conversational context
        const contents: any[] = [];
        
        // Take recent conversation turns (up to 8 turns) to maintain context
        const recentMessages = messages.slice(-8);
        for (const msg of recentMessages) {
          const role = (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'model';
          const text = msg.text || msg.content || '';
          if (text) {
            contents.push({
              role,
              parts: [{ text: text }]
            });
          }
        }

        // Prepend student context to the latest turn if present
        if (studentContext && contents.length > 0 && contents[contents.length - 1].role === 'user') {
          contents[contents.length - 1].parts[0].text = `${studentContext}\n${contents[contents.length - 1].parts[0].text}`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.3, // Low temperature for high factual consistency
          }
        });

        const replyText = response.text || '';

        // Extract suggested follow-ups if generated by the model
        const followUps: string[] = [];
        const lines = replyText.split('\n');
        const cleanLines: string[] = [];

        for (const line of lines) {
          if (line.trim().startsWith('FOLLOW_UP:')) {
            const q = line.replace('FOLLOW_UP:', '').trim();
            if (q && followUps.length < 3) {
              followUps.push(q);
            }
          } else {
            cleanLines.push(line);
          }
        }

        const cleanedReply = cleanLines.join('\n').trim();

        // Default follow-ups if none were extracted
        const defaultFollowUps = followUps.length > 0 ? followUps : [
          "When is my CIE exam?",
          "What is the attendance requirement?",
          "How can I check my marks?"
        ];

        return res.json({
          reply: cleanedReply || replyText,
          suggestedFollowUps: defaultFollowUps,
          isAI: true,
          timestamp: new Date().toISOString()
        });

      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to college knowledge base:', geminiError?.message || geminiError);
        // Seamless fallback to factual knowledge base with explanation
        const localResult = generateLocalFactualResponse(userPrompt, studentProfile);
        return res.json({
          reply: localResult.text,
          suggestedFollowUps: localResult.followUps,
          isAI: false,
          fallbackReason: 'Direct verified CIE handbook response',
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // No GEMINI_API_KEY provided: respond with grounded college knowledge base and notify
      const localResult = generateLocalFactualResponse(userPrompt, studentProfile);
      return res.json({
        reply: localResult.text,
        suggestedFollowUps: localResult.followUps,
        isAI: false,
        fallbackReason: 'AI service not configured; displaying verified college records',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error: any) {
    console.error('Error handling chat message:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing your query.',
      details: error?.message || 'Server error'
    });
  }
});

// API: Get complete college reference documents
app.get('/api/college-data', (req, res) => {
  res.json({
    collegeName: COLLEGE_NAME,
    academicTerm: ACADEMIC_TERM,
    cieSchedules: CIE_SCHEDULES,
    attendancePolicy: ATTENDANCE_POLICY,
    marksEvaluation: MARKS_EVALUATION_SCHEME,
    labAndProject: LAB_AND_PROJECT_GUIDELINES,
    importantDates: IMPORTANT_DATES,
    departments: DEPARTMENTS,
    offices: OFFICES,
    portalFaqs: PORTAL_FAQS,
    examRules: EXAM_RULES,
    scholarships: SCHOLARSHIPS_INFO
  });
});

// API: Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    aiEnabled: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    college: COLLEGE_NAME,
    term: ACADEMIC_TERM
  });
});

// Start the server
async function start() {
  const distPath = path.resolve(__dirname, 'dist');
  const distExists = fs.existsSync(path.resolve(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || (process.env.NODE_ENV !== 'development' && distExists);

  if (isProduction && distExists) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Help Desk server running on http://0.0.0.0:${PORT}`);
  });
}

start();
