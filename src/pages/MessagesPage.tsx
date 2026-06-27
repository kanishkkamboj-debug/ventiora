import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ChatBubble } from '../components/messages/ChatBubble';
import type { ChatMessage } from '../components/messages/ChatBubble';
import { Send, Search, Edit } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { motion } from 'framer-motion';

// Mock data
const mockConversations = [
  { id: '1', user: { username: 'alex_campus', role: 'Student' }, lastMessage: 'See you at the library!', unread: 0, time: '10:42 AM' },
  { id: '2', user: { username: 'priya_dev', role: 'Alumni' }, lastMessage: 'Can you send me the notes?', unread: 2, time: 'Yesterday' },
  { id: '3', user: { username: 'campus_admin', role: 'Admin' }, lastMessage: 'Your post was approved.', unread: 0, time: 'Mon' },
];

const mockChatHistory: ChatMessage[] = [
  { id: '1', sender_username: 'priya_dev', content: 'Hey, are you going to the career fair tomorrow?', created_at: new Date(Date.now() - 3600000).toISOString(), is_mine: false },
  { id: '2', sender_username: 'me', content: 'Yeah definitely! I printed my resumes this morning.', created_at: new Date(Date.now() - 3500000).toISOString(), is_mine: true },
  { id: '3', sender_username: 'priya_dev', content: 'Awesome. Can you send me the notes from CS301 though? I missed it.', created_at: new Date(Date.now() - 3000000).toISOString(), is_mine: false },
];

export function MessagesPage() {
  const [activeChat, setActiveChat] = useState(mockConversations[1]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender_username: 'me',
      content: message,
      created_at: new Date().toISOString(),
      is_mine: true,
    };
    
    setMessages([...messages, newMsg]);
    setMessage('');
  };

  return (
    <PageWrapper>
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex h-[calc(100vh-140px)] min-h-[600px] font-headline-md">
        
        {/* Left Sidebar - Conversations */}
        <div className="w-full md:w-80 border-r border-border flex flex-col bg-surface-container-lowest">
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface">
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Messages</h1>
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-primary">
              <Edit className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-border rounded-xl text-label-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {mockConversations.map((conv) => (
              <button 
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`w-full text-left p-4 border-b border-border transition-colors flex items-center gap-3 hover:bg-surface-container-low ${
                  activeChat.id === conv.id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                }`}
              >
                <Avatar username={conv.user.username} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-md text-label-md font-bold text-on-surface truncate">@{conv.user.username}</span>
                    <span className="text-[11px] text-muted-text shrink-0 ml-2 font-label-sm">{conv.time}</span>
                  </div>
                  <p className={`font-body-sm text-body-sm truncate ${conv.unread > 0 ? 'text-on-surface font-semibold' : 'text-muted-text'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    {conv.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane - Active Chat */}
        <div className="hidden md:flex flex-1 flex-col bg-background">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-border bg-surface flex items-center gap-3 shrink-0 shadow-sm z-10">
            <Avatar username={activeChat.user.username} size="sm" />
            <div>
              <h2 className="font-label-md text-label-md font-bold text-on-surface">@{activeChat.user.username}</h2>
              <p className="font-body-sm text-body-sm text-muted-text text-[12px]">{activeChat.user.role}</p>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col relative">
            <div className="mt-auto">
              {messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const showAvatar = !prevMsg || prevMsg.sender_username !== msg.sender_username;
                return <ChatBubble key={msg.id} message={msg} showAvatar={showAvatar} />;
              })}
            </div>
          </div>

          {/* Message Input Area */}
          <div className="p-4 bg-surface border-t border-border">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 bg-surface-container-low border border-border rounded-full pl-6 pr-14 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              />
              <motion.button 
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </div>
        
      </div>
    </PageWrapper>
  );
}
