import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  Trash2, 
  Sparkles, 
  Users, 
  Building2,
  ChevronDown,
  Info
} from 'lucide-react';
import { COLLEGE_NAME, ACADEMIC_TERM, DEPARTMENTS } from '../data/collegeData';
import { StudentProfile } from '../types/chat';

interface HeaderProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (profile: Partial<StudentProfile>) => void;
  onOpenKnowledge: () => void;
  onOpenCalculator: () => void;
  onClearChat: () => void;
  isAiActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  studentProfile,
  onUpdateProfile,
  onOpenKnowledge,
  onOpenCalculator,
  onClearChat,
  isAiActive
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Top Banner with College Identity */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        
        {/* Brand & Crest */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/10 ring-2 ring-indigo-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight tracking-tight">
                Student Help Desk
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isAiActive ? 'AI Assistant Online' : 'Handbook Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {COLLEGE_NAME} • <span className="text-indigo-600 font-medium">{ACADEMIC_TERM}</span>
            </p>
          </div>
        </div>

        {/* Quick Tools & Context */}
        <div className="flex items-center gap-1.5 md:gap-2">
          
          {/* Department / Semester pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              title="Filter by Department & Semester"
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Context:</span>
              <span className="font-semibold text-indigo-700">
                {studentProfile.department} • {studentProfile.semester}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Context Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs text-slate-700">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 mb-2">
                  Academic Context Customizer
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department</label>
                    <select
                      value={studentProfile.department}
                      onChange={(e) => onUpdateProfile({ department: e.target.value })}
                      className="w-full p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium"
                    >
                      <option value="All">All Departments</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Semester</label>
                    <select
                      value={studentProfile.semester}
                      onChange={(e) => onUpdateProfile({ semester: e.target.value })}
                      className="w-full p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium"
                    >
                      <option value="Sem 2">Semester 2 (1st Year)</option>
                      <option value="Sem 4">Semester 4 (2nd Year)</option>
                      <option value="Sem 6">Semester 6 (3rd Year)</option>
                      <option value="Sem 8">Semester 8 (Final Year)</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="mt-3 w-full py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Apply Context
                </button>
              </div>
            )}
          </div>

          {/* 75% Attendance Evaluator Button */}
          <button
            onClick={onOpenCalculator}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            title="Attendance Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">75% Calculator</span>
          </button>

          {/* Handbook Button */}
          <button
            onClick={onOpenKnowledge}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Open College Handbook & Timetables"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CIE Handbook</span>
          </button>

          {/* Clear Chat */}
          <button
            onClick={onClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
