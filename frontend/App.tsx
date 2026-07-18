import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from './types';
import { INITIAL_GREETING, QUICK_REPLIES } from './constants';
import { geminiService } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickReplies } from './components/QuickReplies';
import { Scissors } from 'lucide-react';

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat and add greeting on mount
  useEffect(() => {
    geminiService.initChat();
    setMessages([
      {
        id: generateId(),
        text: INITIAL_GREETING,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Hide quick replies after first interaction
    setShowQuickReplies(false);

    // Add user message
    const userMsgId = generateId();
    const userMessage: Message = {
      id: userMsgId,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Prepare bot message placeholder for streaming
    const botMsgId = generateId();
    setMessages((prev) => [
      ...prev,
      {
        id: botMsgId,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    try {
      const stream = await geminiService.sendMessageStream(text);
      
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        
        // Update the specific bot message with new chunks
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMsgId 
              ? { ...msg, text: fullResponse } 
              : msg
          )
        );
      }

      // Finalize message (remove streaming flag)
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      console.error("Chat error:", error);
      // Handle error gracefully in UI
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMsgId 
            ? { ...msg, text: "I'm sorry, I'm having trouble connecting right now. Please try again later or call the salon directly.", isStreaming: false } 
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl h-[90vh] md:h-[800px] max-h-full flex flex-col bg-salon-50 rounded-2xl shadow-2xl overflow-hidden border border-salon-100">
      
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-salon-100 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-salon-100 p-2 rounded-full text-salon-700">
            <Scissors size={20} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-salon-900">Lumière Salon</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500 font-medium">Lumi is online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide flex flex-col">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies & Input Area */}
      <div className="bg-salon-50/80 backdrop-blur-sm">
        {showQuickReplies && (
          <QuickReplies 
            replies={QUICK_REPLIES} 
            onSelect={handleSendMessage} 
            disabled={isTyping}
          />
        )}
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
      
    </div>
  );
}
