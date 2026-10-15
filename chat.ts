export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  category?: 'exam' | 'attendance' | 'marks' | 'assignment' | 'portal' | 'office' | 'general';
  isFallback?: boolean;
  contactCard?: {
    title: string;
    personOrOffice: string;
    room: string;
    email: string;
    phone: string;
  };
}

export interface StudentProfile {
  name: string;
  usn: string;
  department: string;
  semester: string;
}

export interface QuickPrompt {
  label: string;
  query: string;
  iconName: string;
  category: string;
}
