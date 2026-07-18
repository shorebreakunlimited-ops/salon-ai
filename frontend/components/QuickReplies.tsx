import React from 'react';
import { QuickReply } from '../types';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onSelect, disabled }) => {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-4 pt-0">
      {replies.map((reply) => (
        <button
          key={reply.id}
          onClick={() => onSelect(reply.query)}
          disabled={disabled}
          className="text-xs md:text-sm bg-white border border-salon-200 text-salon-700 px-3 py-1.5 rounded-full hover:bg-salon-50 hover:border-salon-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
};
