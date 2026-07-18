export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface QuickReply {
  id: string;
  label: string;
  query: string;
}
