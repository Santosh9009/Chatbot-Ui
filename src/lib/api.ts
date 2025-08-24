import axios from 'axios';

// Base URL for the Python FastAPI backend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface ChatHistoryEntry {
  id: number;
  prompt: string;
  response: string;
  tokens_used: number;
  timestamp: string;
  model_name?: string;
  was_cached: boolean;
}

export interface DatabaseStats {
  total_entries: number;
  total_tokens_used: number;
  cached_entries: number;
  cache_hit_rate: number;
  latest_timestamp?: string;
}

export interface ChatRequest {
  message: string;
  model?: string;
}

export interface ChatResponse {
  response: string;
  tokens_used: number;
  was_cached: boolean;
  model_name: string;
}

export interface HealthCheck {
  status: string;
  database: string;
  total_entries: number;
  api_configured: boolean;
  timestamp: string;
}

// API functions
export const chatApi = {
  // Send a chat message
  sendMessage: async (message: string, model?: string): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat', {
      message,
      model,
    });
    return response.data;
  },

  // Get chat history
  getHistory: async (limit = 20): Promise<ChatHistoryEntry[]> => {
    const response = await api.get<ChatHistoryEntry[]>(`/history?limit=${limit}`);
    return response.data;
  },

  // Get database statistics
  getStats: async (): Promise<DatabaseStats> => {
    const response = await api.get<DatabaseStats>('/stats');
    return response.data;
  },

  // Clear chat history
  clearHistory: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/history');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<HealthCheck> => {
    const response = await api.get<HealthCheck>('/health');
    return response.data;
  },
};

// Error handling helper
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return 'Rate limit exceeded. Please wait a moment before sending another message.';
    }
    if (error.response?.status === 400) {
      return error.response.data?.detail || 'Invalid request.';
    }
    if (error.response?.status === 500) {
      return 'Server error. Please try again later.';
    }
    if (error.code === 'ECONNREFUSED') {
      return 'Cannot connect to the chatbot server. Please make sure the backend is running.';
    }
    return error.response?.data?.detail || error.message || 'An error occurred.';
  }
  return 'An unexpected error occurred.';
};
