import React, { useEffect, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  const [hintIndex, setHintIndex] = useState(0);
  const hints = [
    "Consulting CIE handbook & timetables...",
    "Verifying official academic regulations...",
    "Formulating clear student response..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % hints.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [hints.length]);

  return (
    <div className="flex w-full gap-3 my-3 justify-start animate-in fade-in duration-200">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
        <Bot className="w-4 h-4 animate-bounce" />
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          {/* 3 bouncing dots */}
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
          </div>
          
          <span className="text-xs text-slate-500 italic flex items-center gap-1 font-medium pl-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {hints[hintIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
