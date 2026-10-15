import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw } from 'lucide-react';

interface AttendanceCalculatorProps {
  onAskBotAboutAttendance?: (query: string) => void;
  onClose?: () => void;
}

export const AttendanceCalculator: React.FC<AttendanceCalculatorProps> = ({ 
  onAskBotAboutAttendance,
  onClose 
}) => {
  const [totalClasses, setTotalClasses] = useState<number>(40);
  const [attendedClasses, setAttendedClasses] = useState<number>(32);

  const total = Math.max(0, totalClasses);
  const attended = Math.min(total, Math.max(0, attendedClasses));

  const percentage = total > 0 ? (attended / total) * 100 : 0;
  const roundedPercentage = percentage.toFixed(1);

  // Status calculation
  let status: 'safe' | 'condonation' | 'detained' = 'safe';
  if (percentage >= 75) {
    status = 'safe';
  } else if (percentage >= 65) {
    status = 'condonation';
  } else {
    status = 'detained';
  }

  // Calculate safe skips (classes student can miss while staying >= 75%)
  // formula: attended / (total + x) >= 0.75  =>  total + x <= attended / 0.75  => x = floor(attended / 0.75 - total)
  const safeSkips = percentage >= 75 ? Math.max(0, Math.floor(attended / 0.75 - total)) : 0;

  // Calculate classes required to reach 75%
  // formula: (attended + y) / (total + y) >= 0.75  =>  attended + y >= 0.75 * total + 0.75 * y  =>  0.25 * y >= 0.75 * total - attended  => y = ceil((0.75 * total - attended) / 0.25)
  const classesNeededTo75 = percentage < 75 ? Math.max(0, Math.ceil((0.75 * total - attended) / 0.25)) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 text-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base">AIST 75% Attendance Evaluator</h3>
            <p className="text-xs text-slate-500">Autonomous College Criteria Checker</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Total Classes Held</label>
          <input
            type="number"
            min={1}
            max={200}
            value={totalClasses}
            onChange={(e) => setTotalClasses(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Classes Attended</label>
          <input
            type="number"
            min={0}
            max={totalClasses}
            value={attendedClasses}
            onChange={(e) => setAttendedClasses(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Your Current Attendance</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-extrabold ${
                status === 'safe' ? 'text-emerald-600' :
                status === 'condonation' ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {roundedPercentage}%
              </span>
              <span className="text-xs text-slate-500">
                ({attended} / {total} classes)
              </span>
            </div>
          </div>

          <div className="text-right">
            {status === 'safe' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Eligible (Safe)
              </span>
            )}
            {status === 'condonation' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Condonation Zone
              </span>
            )}
            {status === 'detained' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Critical Shortage
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full mt-3 overflow-hidden relative">
          {/* 75% mark line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10" 
            style={{ left: '75%' }} 
            title="75% Minimum Requirement Line"
          />
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              status === 'safe' ? 'bg-emerald-500' :
              status === 'condonation' ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>0%</span>
          <span className="text-amber-600">65% Condonation</span>
          <span className="text-indigo-600 font-semibold">75% Mandatory</span>
          <span>100%</span>
        </div>

        {/* Actionable Advice */}
        <div className="mt-3 text-xs space-y-1.5">
          {status === 'safe' && (
            <p className="text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
              🎉 <strong>You meet the mandatory 75% criterion!</strong> You can safely miss up to{' '}
              <strong className="underline">{safeSkips} more class{safeSkips === 1 ? '' : 'es'}</strong> and still maintain the 75% cutoff.
            </p>
          )}

          {status === 'condonation' && (
            <div className="text-amber-900 bg-amber-50/90 p-2.5 rounded-lg border border-amber-200/80 leading-relaxed space-y-1">
              <p>
                ⚠️ <strong>You are in the medical condonation bracket (65%–74.9%).</strong>
              </p>
              <p>
                You need to attend the next <strong className="font-bold underline">{classesNeededTo75} consecutive classes</strong> without missing any to hit the 75% safe mark.
              </p>
              <p className="text-[11px] text-amber-800">
                *Alternatively, submit verified hospital documents to Dean Student Welfare for ₹500/subject condonation approval.
              </p>
            </div>
          )}

          {status === 'detained' && (
            <div className="text-rose-900 bg-rose-50/90 p-2.5 rounded-lg border border-rose-200/80 leading-relaxed space-y-1">
              <p>
                🚨 <strong>Critical Shortage: Below 65% triggers detention (NSR).</strong>
              </p>
              <p>
                You must attend <strong className="font-bold underline">{classesNeededTo75} consecutive classes</strong> without absence to reach 75%.
              </p>
              <p className="text-[11px] text-rose-800">
                Immediately meet your Department HOD and CIE Coordinator to discuss your attendance recovery plan!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Button */}
      {onAskBotAboutAttendance && (
        <button
          onClick={() => onAskBotAboutAttendance(`I currently have ${roundedPercentage}% attendance (${attended}/${total} classes). What should I do under college regulations?`)}
          className="mt-3 w-full py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-indigo-200/60"
        >
          <Info className="w-3.5 h-3.5" />
          Ask Help Desk for My Personalized Recovery Plan
        </button>
      )}
    </div>
  );
};
