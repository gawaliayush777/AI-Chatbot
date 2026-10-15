import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Phone, 
  ExternalLink,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectFollowUp?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectFollowUp }) => {
  const isBot = message.sender === 'bot';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text for speech
    const cleanText = message.text
      .replace(/[#*`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className={`flex w-full gap-3 my-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {/* Bot Avatar */}
      {isBot && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-xs border border-indigo-200">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        
        {/* Sender Name / Timestamp info */}
        <div className="flex items-center gap-2 mb-1 px-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            {isBot ? 'Student Help Desk AI' : 'You'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>

          {isBot && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified Handbook
            </span>
          )}

          {message.isFallback && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <HelpCircle className="w-3 h-3 text-amber-600" />
              Direct Support
            </span>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-xs text-sm ${
            isBot
              ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-sm'
              : 'bg-indigo-600 text-white rounded-tr-sm selection:bg-indigo-700 selection:text-white'
          }`}
        >
          {isBot ? (
            <MarkdownRenderer content={message.text} />
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          )}

          {/* Fallback Contact Card if available */}
          {message.contactCard && (
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                {message.contactCard.title}
              </div>
              <div className="text-slate-600">{message.contactCard.personOrOffice} • Room: {message.contactCard.room}</div>
              <div className="flex flex-wrap gap-3 pt-1 text-indigo-600 font-medium">
                <a href={`mailto:${message.contactCard.email}`} className="flex items-center gap-1 hover:underline">
                  <Mail className="w-3 h-3" /> {message.contactCard.email}
                </a>
                <span className="flex items-center gap-1 text-slate-600">
                  <Phone className="w-3 h-3 text-slate-500" /> {message.contactCard.phone}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bot Message Actions (Copy & Read Aloud) */}
        {isBot && (
          <div className="flex items-center gap-1.5 mt-1.5 px-1">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="Copy answer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {'speechSynthesis' in window && (
              <button
                onClick={handleSpeak}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                title={isSpeaking ? 'Stop reading' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-red-600">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Suggested Follow-ups */}
        {isBot && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onSelectFollowUp && (
          <div className="mt-3 flex flex-wrap gap-1.5 pl-1">
            <span className="text-[11px] font-medium text-slate-500 w-full mb-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Suggested follow-ups:
            </span>
            {message.suggestedFollowUps.map((question, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFollowUp(question)}
                className="inline-flex items-center text-xs bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200/80 transition-colors text-left"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
