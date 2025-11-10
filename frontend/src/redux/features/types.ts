export interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | { detail?: string } | null;
}

export interface loginType  {
    email: string,
    password: string
}

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
}

// types.ts

export interface Message {
  id: number;
  sender: "user" | "assistant";
  content: string;
  created_at: string; // ISO date string
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string; // ISO date string
  user_id: number;
}

export interface ChatState {
  conversations: Conversation[];     
  conversation: Conversation | null;   // currently selected conversation
  messages: Message[];
  latestMessage?: { sender: "user" | "assistant"; content: string } | null;
  loading: boolean;
  error: string | null;
}
