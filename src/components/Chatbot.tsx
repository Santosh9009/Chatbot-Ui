'use client';

import React, { useState, useEffect } from 'react';
import { useChat, type ChatMessage } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Sidebar from '@/components/Sidebar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Zap,
  Menu
} from 'lucide-react';
import { chatApi, DatabaseStats, handleApiError } from '@/lib/api';

const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-2 sm:gap-3 p-2 sm:p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-700 text-gray-300'
      }`}>
        {isUser ? <User size={12} className="sm:w-4 sm:h-4" /> : <Bot size={12} className="sm:w-4 sm:h-4" />}
      </div>
      
      <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-lg px-3 sm:px-4 py-2 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-700 text-gray-100'
        }`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="text-sm">
              <MarkdownRenderer content={message.content} />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs text-gray-500 flex-wrap">
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {message.tokens && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs">{message.tokens} tokens</span>
            </>
          )}
          {message.wasCached && (
            <>
              <span className="hidden sm:inline">•</span>
              <Badge variant="secondary" className="text-xs px-1 py-0 h-auto">
                <Zap size={8} className="mr-1" />
                <span className="hidden sm:inline">Cached</span>
                <span className="sm:hidden">⚡</span>
              </Badge>
            </>
          )}
          {message.modelName && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs hidden sm:inline">{message.modelName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Chatbot() {
  const {
    messages,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    loadHistory,
    clearChat,
    clearHistory,
    setError
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open on desktop
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash'); // Default model

  // Load initial data
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Check if backend is connected
        await chatApi.healthCheck();
        setIsConnected(true);
        
        // Load chat history
        await loadHistory(10);
        
        // Load stats
        const statsData = await chatApi.getStats();
        setStats(statsData);
      } catch (err) {
        setIsConnected(false);
        setError(handleApiError(err));
      }
    };

    initializeChat();
  }, [loadHistory, setError]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // Closed by default on mobile
      } else {
        setIsSidebarOpen(true); // Open by default on desktop
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue, selectedModel); // Pass the selected model
    setInputValue('');
    
    // Refresh stats after sending message
    try {
      const statsData = await chatApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  const handleLoadHistory = async () => {
    await loadHistory(20);
    try {
      const statsData = await chatApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
    // Close sidebar on mobile after action
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setStats(null);
    // Close sidebar on mobile after action
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleClearChat = () => {
    clearChat();
    // Close sidebar on mobile after action
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const refreshStats = async () => {
    try {
      const statsData = await chatApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        stats={stats}
        isConnected={isConnected}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onLoadHistory={handleLoadHistory}
        onClearChat={handleClearChat}
        onClearHistory={handleClearHistory}
        onRefreshStats={refreshStats}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-700 p-4 flex-shrink-0 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 h-10 w-10 text-gray-400 hover:text-gray-200"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Chat with AI Assistant</h2>
            <p className="text-sm text-gray-400">
              Powered by {selectedModel.replace('gemini-', 'Gemini ').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • Memory & Caching
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2 sm:p-4">
              <div className="space-y-1">
                {messages.length === 0 && !isLoading && (
                  <div className="text-center text-gray-500 mt-8 px-4">
                    <Bot size={32} className="sm:w-12 sm:h-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-base sm:text-lg font-medium">Welcome to AI Chatbot!</p>
                    <p className="text-sm">Start a conversation or load your chat history.</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isLoading && (
                  <div className="flex gap-2 sm:gap-3 p-2 sm:p-4">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">
                      <Bot size={12} className="sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-700 text-gray-100 rounded-lg px-3 sm:px-4 py-2">
                      <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Error Display */}
        {error && (
          <div className="border-t border-gray-700 p-3 sm:p-4 bg-red-900/20 flex-shrink-0">
            <div className="text-red-400 text-sm">
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-700 p-3 sm:p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || isConnected === false}
              className="flex-1 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim() || isConnected === false}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4"
              size="sm"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
