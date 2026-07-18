import React from 'react';
import { Message } from '../types';
import { Sparkles, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 
          ${isBot ? 'bg-salon-200 text-salon-700 mr-3' : 'bg-salon-600 text-white ml-3'}`}>
          {isBot ? <Sparkles size={16} /> : <User size={16} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div 
            className={`px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm
              ${isBot 
                ? 'bg-white text-gray-800 rounded-tl-none border border-salon-100' 
                : 'bg-salon-500 text-white rounded-tr-none'
              }
              ${message.isStreaming ? 'animate-pulse' : ''}
            `}
          >
            {/* Simple text rendering. In a real app, you might want a markdown parser here if the bot uses markdown, 
                but we instructed it to minimize markdown. */}
            <span className="whitespace-pre-wrap break-words">{message.text}</span>
            
            {message.isStreaming && (
              <span className="inline-block ml-1 w-1.5 h-4 bg-current opacity-50 animate-bounce align-middle"></span>
            )}
          </div>
          
          {/* Timestamp */}
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
