import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Award, 
  Building2, 
  HelpCircle, 
  ShieldAlert, 
  ExternalLink, 
  Search, 
  Mail, 
  Phone, 
  BookOpen,
  DollarSign
} from 'lucide-react';
import {
  CIE_SCHEDULES,
  MARKS_EVALUATION_SCHEME,
  ATTENDANCE_POLICY,
  DEPARTMENTS,
  OFFICES,
  PORTAL_FAQS,
  EXAM_RULES,
  SCHOLARSHIPS_INFO,
  COLLEGE_NAME,
  ACADEMIC_TERM
} from '../data/collegeData';

interface KnowledgeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

export const KnowledgeDrawer: React.FC<KnowledgeDrawerProps> = ({ 
  isOpen, 
  onClose,
  onSelectQuery
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'marks' | 'offices' | 'portal' | 'rules' | 'scholarships'>('schedule');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Official Handbook
              </span>
              <span className="text-xs text-slate-300 font-mono">{ACADEMIC_TERM}</span>
            </div>
            <h2 className="text-base md:text-lg font-bold mt-1 text-white">
              CIE Academic Knowledge & Directory
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-3 py-2 gap-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> CIE Schedules
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'marks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Marks & Rubrics
          </button>
          <button
            onClick={() => setActiveTab('offices')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'offices'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Campus Directory
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'portal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Portal & ERP
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Exam Rules
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'scholarships'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Scholarships
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          
          {/* TAB 1: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900">
                💡 <strong>Autonomous Rule:</strong> The best 2 out of 3 CIE test scores will be used to calculate your internal test component.
              </div>

              {CIE_SCHEDULES.map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs hover:border-indigo-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.exam}</h4>
                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">{item.dateRange}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      {item.maxMarks} Marks
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <p><strong>📖 Syllabus:</strong> {item.syllabusPortion}</p>
                    <p><strong>⏱️ Duration:</strong> {item.duration}</p>
                    <p><strong>⚖️ Weightage:</strong> {item.weightage}</p>
                    <p className="text-slate-500 italic mt-1">{item.notes}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectQuery(`Give me details about ${item.exam} syllabus and timing.`);
                      onClose();
                    }}
                    className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Ask about this exam ➔
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: MARKS & EVALUATION */}
          {activeTab === 'marks' && (
            <div className="space-y-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Internal Assessment (50 Marks) Breakdown</h4>
                <div className="space-y-2">
                  {MARKS_EVALUATION_SCHEME.breakdown.map((comp, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-800">{comp.component}</span>
                        <p className="text-[11px] text-slate-500">{comp.description}</p>
                      </div>
                      <span className="font-bold text-indigo-600 text-sm">{comp.marks} M</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold">⚠️ Minimum Qualifying Cutoff for SEE:</p>
                <p>{MARKS_EVALUATION_SCHEME.minimumEligibilityForSEE}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">Grievance & Re-verification:</p>
                <p>{MARKS_EVALUATION_SCHEME.grievanceProcess}</p>
              </div>
            </div>
          )}

          {/* TAB 3: CAMPUS OFFICES & DIRECTORY */}
          {activeTab === 'offices' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Key Academic Offices</h3>
              {OFFICES.map((off, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{off.office}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{off.inCharge}</p>
                    </div>
                    <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {off.location}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <a href={`mailto:${off.email}`} className="text-indigo-600 hover:underline">{off.email}</a>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{off.phone}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">🕒 {off.timing}</p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-700">Services:</p>
                    <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5 mt-1">
                      {off.responsibilities.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <h3 className="font-bold text-slate-900 text-sm pt-2">Department CIE Coordinators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DEPARTMENTS.map((dept, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="font-bold text-slate-900">{dept.name} ({dept.code})</div>
                    <p className="text-slate-600 mt-1">HOD: {dept.hod}</p>
                    <p className="text-slate-500">Cabin: {dept.hodCabin}</p>
                    <p className="text-indigo-600 mt-1 font-medium">CIE Coord: {dept.coordinator}</p>
                    <a href={`mailto:${dept.coordinatorEmail}`} className="text-indigo-600 underline text-[11px] block mt-0.5">
                      {dept.coordinatorEmail}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PORTAL & ERP HELP */}
          {activeTab === 'portal' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                🔗 Official Student Portal URL:{' '}
                <a href="https://portal.aist.edu" target="_blank" rel="noreferrer" className="font-bold underline text-indigo-700">
                  portal.aist.edu
                </a>
              </div>

              {PORTAL_FAQS.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-sm">{faq.issue}</h4>
                  <ol className="list-decimal pl-4 mt-2 space-y-1 text-xs text-slate-600">
                    {faq.solution.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Helpdesk: {faq.helpline}</span>
                    <button
                      onClick={() => {
                        onSelectQuery(`How do I resolve: ${faq.issue}?`);
                        onClose();
                      }}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Ask Help Desk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: EXAM RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <h4 className="font-bold text-sm flex items-center gap-1.5 text-rose-950 mb-1">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Malpractice Code & Strict Discipline
                </h4>
                <p className="leading-relaxed">
                  Possession of unauthorized electronic devices (smart watches, smartphones, bluetooth earphones) or written cheat material results in immediate confiscation and disciplinary suspension under Rule 14.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Key Instructions to Candidates:</h4>
                <ul className="space-y-2 text-slate-700">
                  {EXAM_RULES.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 6: SCHOLARSHIPS */}
          {activeTab === 'scholarships' && (
            <div className="space-y-4">
              {SCHOLARSHIPS_INFO.map((sch, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-sm">{sch.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {sch.benefit}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p><strong>Eligibility:</strong> {sch.eligibility}</p>
                    <p className="text-rose-600 font-semibold"><strong>Application Deadline:</strong> {sch.deadline}</p>
                    <p><strong>How to Apply:</strong> {sch.applyAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Apex Institute of Science & Technology • Controller of Examinations Office
        </div>

      </div>
    </div>
  );
};
