'use client';

import { useState, useRef, useCallback } from 'react';
import { chatApi, ChatHistoryEntry, ChatResponse, handleApiError } from '@/lib/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  wasCached?: boolean;
  modelName?: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    setTimeout(scrollToBottom, 100);
  }, [scrollToBottom]);

  const sendMessage = useCallback(async (content: string, model?: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsLoading(true);
    setError(null);

    try {
      const response: ChatResponse = await chatApi.sendMessage(content.trim(), model);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        tokens: response.tokens_used,
        wasCached: response.was_cached,
        modelName: response.model_name,
      };

      addMessage(assistantMessage);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      
      const errorAssistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${errorMessage}`,
        timestamp: new Date(),
      };
      
      addMessage(errorAssistantMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage]);

  const loadHistory = useCallback(async (limit = 20) => {
    try {
      setError(null);
      const history = await chatApi.getHistory(limit);
      
      const historyMessages: ChatMessage[] = [];
      
      history.reverse().forEach((entry: ChatHistoryEntry) => {
        // Add user message
        historyMessages.push({
          id: `${entry.id}-user`,
          role: 'user',
          content: entry.prompt,
          timestamp: new Date(entry.timestamp),
        });
        
        // Add assistant message
        historyMessages.push({
          id: `${entry.id}-assistant`,
          role: 'assistant',
          content: entry.response,
          timestamp: new Date(entry.timestamp),
          tokens: entry.tokens_used,
          wasCached: entry.was_cached,
          modelName: entry.model_name,
        });
      });
      
      setMessages(historyMessages);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  }, [scrollToBottom]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      setError(null);
      await chatApi.clearHistory();
      setMessages([]);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    loadHistory,
    clearChat,
    clearHistory,
    setError,
  };
};
