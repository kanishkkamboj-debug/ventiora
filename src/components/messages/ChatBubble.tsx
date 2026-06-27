import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';

export interface ChatMessage {
  id: string;
  sender_username: string;
  sender_avatar?: string;
  content: string;
  created_at: string;
  is_mine: boolean;
}

interface ChatBubbleProps {
  message: ChatMessage;
  showAvatar?: boolean;
}

export function ChatBubble({ message, showAvatar = true }: ChatBubbleProps) {
  const timeString = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${message.is_mine ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!message.is_mine && showAvatar && (
        <div className="mr-3 shrink-0 self-end">
          <Avatar avatarUrl={message.sender_avatar} username={message.sender_username} size="sm" />
        </div>
      )}
      
      {!message.is_mine && !showAvatar && <div className="w-11" />} {/* Spacer for alignment */}

      <div className={`flex flex-col ${message.is_mine ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div 
          className={`px-4 py-2.5 rounded-2xl ${
            message.is_mine 
              ? 'bg-primary text-on-primary rounded-br-sm' 
              : 'bg-surface-container-low text-on-surface rounded-bl-sm border border-border'
          }`}
        >
          <p className="font-body-md text-body-md leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-[11px] text-muted-text mt-1 px-1 font-label-sm">{timeString}</span>
      </div>
    </motion.div>
  );
}
