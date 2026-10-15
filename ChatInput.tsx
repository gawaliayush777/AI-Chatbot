import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, CornerDownLeft } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../data/collegeData';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onSelectSuggestion: (question: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onSelectSuggestion
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Voice speech-to-text integration
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200/90 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-2.5">
        
        {/* Suggested Quick Questions Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Suggestions:
          </span>
          {SUGGESTED_QUESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(suggestion)}
              disabled={isLoading}
              className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Text Input Container */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all shadow-2xs">
          
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening 
                ? "Listening... Speak your college question clearly" 
                : "Ask about CIE dates, attendance rules, assignment deadlines, marks, faculty..."
            }
            disabled={isLoading}
            className="flex-1 max-h-32 p-2 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
          />

          {/* Action Buttons: Voice Mic + Send */}
          <div className="flex items-center gap-1.5 pb-1 pr-1">
            
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
              }`}
              title={isListening ? "Listening... click to stop" : "Use voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                input.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title="Send question (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>

          </div>

        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for newline</span>
          <span className="hidden sm:inline">Protected Student Data • Factual Handbook Grounded</span>
        </div>

      </div>
    </div>
  );
};
