import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle, 
  Award, 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Building2,
  Clock
} from 'lucide-react';
import { COLLEGE_NAME, COLLEGE_ACCREDITATION, ACADEMIC_TERM } from '../data/collegeData';

interface WelcomeBannerProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenKnowledge: () => void;
  onOpenCalculator: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onSelectPrompt,
  onOpenKnowledge,
  onOpenCalculator
}) => {
  const primaryTopics = [
    {
      title: "CIE Exams & Timetable",
      icon: Calendar,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      query: "When is my CIE exam and what is the syllabus portion?"
    },
    {
      title: "Attendance & 75% Rule",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      query: "What is the attendance requirement and what happens below 75%?"
    },
    {
      title: "Check Internal Marks",
      icon: Award,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      query: "How can I check my marks and how is the 50 marks CIE calculated?"
    },
    {
      title: "Assignment Deadlines",
      icon: FileText,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      query: "When is my assignment deadline and what are the lab practical rules?"
    },
    {
      title: "Student Portal Troubles",
      icon: HelpCircle,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      query: "How do I reset my student portal password or fix a locked account?"
    },
    {
      title: "CoE & Office Contacts",
      icon: Building2,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      query: "Where is the Controller of Examinations (CoE) office and who are the HODs?"
    }
  ];

  return (
    <div className="py-4 md:py-6 px-3 max-w-4xl mx-auto space-y-6">
      
      {/* College Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 md:p-8 shadow-lg border border-indigo-700/40">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Official Student AI Help Desk • {ACADEMIC_TERM}</span>
            </div>
            
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white">
              Welcome to the Student Help Desk
            </h2>
            
            <p className="text-xs md:text-sm text-indigo-100 max-w-xl leading-relaxed">
              Get instant, factual answers about CIE exams, syllabus units, attendance rules, assignments, internal marks rubrics, and portal issues.
            </p>

            <div className="pt-1 text-[11px] text-indigo-200/80 font-medium flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{COLLEGE_ACCREDITATION}</span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex md:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenKnowledge}
              className="px-3.5 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>View CIE Timetable</span>
            </button>
            <button
              onClick={onOpenCalculator}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20 flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>75% Calculator</span>
            </button>
          </div>
        </div>

      </div>

      {/* Suggested Topics Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Common Inquiries & Suggested Questions
          </h3>
          <span className="text-xs text-slate-400">Click any card to ask instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {primaryTopics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(topic.query)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left flex items-start gap-3 group cursor-pointer"
              >
                <div className={`p-2 rounded-xl border shrink-0 ${topic.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {topic.query}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 shrink-0 self-center transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Policy Note */}
      <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/60 text-slate-600 text-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Student Privacy Policy:</strong> The help desk does not store or invent personal grades. Official individual records must be accessed directly via your private credentials on <a href="https://portal.aist.edu" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">portal.aist.edu</a>.
        </div>
      </div>

    </div>
  );
};
