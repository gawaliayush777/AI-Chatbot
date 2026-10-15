import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { WelcomeBanner } from './components/WelcomeBanner';
import { KnowledgeDrawer } from './components/KnowledgeDrawer';
import { AttendanceCalculator } from './components/AttendanceCalculator';
import { ChatMessage as ChatMessageType, StudentProfile } from './types/chat';
import { COLLEGE_NAME, ACADEMIC_TERM } from './data/collegeData';

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Student',
    usn: '',
    department: 'CSE',
    semester: 'Sem 4'
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with official welcome message
  useEffect(() => {
    const initialWelcome: ChatMessageType = {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello and welcome to the **${COLLEGE_NAME} Student Help Desk**! 🎓\n\nI am your dedicated academic assistant for **${ACADEMIC_TERM}**. I can help you with:\n- 📅 **CIE Exam Timetables & Syllabus Units**\n- 📊 **75% Mandatory Attendance & Condonation Rules**\n- 💯 **Internal Marks (50 Marks) Breakdown & Passing Criteria**\n- 📝 **Assignments, Lab Practicals & Project Submissions**\n- 🔑 **Student ERP Portal Login & Password Troubleshooting**\n- 🏛️ **Faculty Cabins & CoE Office Contacts**\n\nHow can I help you today? You can choose one of the suggested questions below or type your inquiry!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        "When is my CIE exam?",
        "What is the attendance requirement?",
        "How can I check my marks?",
        "When is my assignment deadline?"
      ]
    };

    setMessages([initialWelcome]);

    // Check backend API status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setIsAiActive(data.aiEnabled !== false);
      })
      .catch((err) => {
        console.warn('Backend status check:', err);
      });
  }, []);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle sending message to backend
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            sender: m.sender,
            text: m.text
          })),
          studentProfile
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const botReply: ChatMessageType = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I apologize, but I could not formulate a complete answer. Please contact the Controller of Examinations office directly at coe@aist.edu.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: data.suggestedFollowUps || [
          "When is my CIE exam?",
          "What is the attendance requirement?",
          "How can I check my marks?"
        ],
        isFallback: !data.isAI
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error: any) {
      console.error('Error fetching chat response:', error);

      // Graceful fallback response informing student
      const errorReply: ChatMessageType = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `### ℹ️ Official Notice: Student Help Desk\n\nI was unable to retrieve a dynamic response from the server at this instant. \n\n**Here are direct official contacts for immediate assistance:**\n- **CIE Exams & Marks Verification:** Controller of Examinations (Admin Block Room 114, email: \`coe@aist.edu\`)\n- **Student ERP Login & Password Reset:** Central Computing Center Room G-08, email: \`portal-support@aist.edu\` (Ext 410)\n- **Attendance Shortage Queries:** Please contact your Department HOD or CIE Coordinator.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
        contactCard: {
          title: "Exam & Student Affairs Section",
          personOrOffice: "Controller of Examinations (CoE)",
          room: "Admin Block Room 114",
          email: "coe@aist.edu",
          phone: "+91 80 2345 6789 / Ext 114"
        },
        suggestedFollowUps: [
          "When is my CIE exam?",
          "What is the attendance requirement?",
          "How do I reset my portal password?"
        ]
      };

      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialWelcome: ChatMessageType = {
      id: `welcome-${Date.now()}`,
      sender: 'bot',
      text: `Chat cleared. Welcome to the **${COLLEGE_NAME} Student Help Desk**!\n\nFeel free to ask about exams, attendance, timetables, syllabus, or portal troubleshooting.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        "When is my CIE exam?",
        "What is the attendance requirement?",
        "How can I check my marks?"
      ]
    };
    setMessages([initialWelcome]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans">
      
      {/* Top Header */}
      <Header
        studentProfile={studentProfile}
        onUpdateProfile={(updated) => setStudentProfile((prev) => ({ ...prev, ...updated }))}
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onClearChat={handleClearChat}
        isAiActive={isAiActive}
      />

      {/* Main Container */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto bg-white sm:border-x sm:border-slate-200 shadow-sm relative">
        
        {/* Attendance Calculator Drawer Modal if opened */}
        {isCalculatorOpen && (
          <div className="absolute inset-x-3 top-3 z-20 max-w-xl mx-auto animate-in slide-in-from-top-4 duration-200">
            <AttendanceCalculator
              onClose={() => setIsCalculatorOpen(false)}
              onAskBotAboutAttendance={(query) => {
                setIsCalculatorOpen(false);
                handleSendMessage(query);
              }}
            />
          </div>
        )}

        {/* Chat Scroll Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4"
        >
          {/* Welcome Banner shown when chat has only the welcome message */}
          {messages.length <= 1 && (
            <WelcomeBanner
              onSelectPrompt={handleSendMessage}
              onOpenKnowledge={() => setIsKnowledgeOpen(true)}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
            />
          )}

          {/* Messages Stream */}
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSelectFollowUp={handleSendMessage}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}
        </div>

        {/* Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onSelectSuggestion={handleSendMessage}
        />

      </main>

      {/* Knowledge Drawer Sidebar */}
      <KnowledgeDrawer
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
        onSelectQuery={(query) => {
          handleSendMessage(query);
        }}
      />

    </div>
  );
}
