import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount and when re-enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 p-3 bg-white border-t border-salon-100 rounded-b-2xl"
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about styles, color, booking..."
        disabled={disabled}
        className="flex-1 bg-salon-50 border border-salon-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-salon-300 focus:border-transparent disabled:opacity-50 transition-all"
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="bg-salon-500 hover:bg-salon-600 text-white rounded-full p-2.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        aria-label="Send message"
      >
        <Send size={18} className="ml-0.5" />
      </button>
    </form>
  );
};
