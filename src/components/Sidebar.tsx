'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ModelSelector from '@/components/ModelSelector';
import { 
  Bot, 
  History, 
  Trash2, 
  BarChart3, 
  RefreshCw,
  Database,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DatabaseStats } from '@/lib/api';

interface StatsPanel {
  stats: DatabaseStats | null;
  onRefresh: () => void;
}

const StatsPanel: React.FC<StatsPanel> = ({ stats, onRefresh }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between text-gray-200">
          <span className="flex items-center gap-2">
            <BarChart3 size={16} />
            Statistics
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
          >
            <RefreshCw size={12} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {stats ? (
          <>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Messages:</span>
              <span className="text-gray-200">{stats.total_entries}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Tokens:</span>
              <span className="text-gray-200">{stats.total_tokens_used.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Cache Hit Rate:</span>
              <span className="text-gray-200">{(stats.cache_hit_rate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Cached Responses:</span>
              <span className="text-gray-200">{stats.cached_entries}</span>
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-400">Loading stats...</div>
        )}
      </CardContent>
    </Card>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  stats: DatabaseStats | null;
  isConnected: boolean | null;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onLoadHistory: () => void;
  onClearChat: () => void;
  onClearHistory: () => void;
  onRefreshStats: () => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  onClose,
  stats,
  isConnected,
  selectedModel,
  onModelChange,
  onLoadHistory,
  onClearChat,
  onClearHistory,
  onRefreshStats
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        fixed md:relative z-50 md:z-auto
        ${isOpen ? 'w-80' : 'md:w-16'} 
        bg-gray-800 border-r border-gray-700 
        flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out
        h-full
      `}>
        
        {/* Sidebar Toggle Button for Desktop */}
        <div className="hidden md:block absolute right-5 top-5 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0 bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-full"
          >
            {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          </Button>
        </div>

        <div className="p-4 flex flex-col gap-4 h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            {isOpen && <Bot className="text-blue-400 flex-shrink-0" size={24} />}
            {isOpen && (
              <>
                <h1 className="text-xl font-bold text-white ">AI Chatbot</h1>
                {isConnected !== null && (
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-1 h-8 w-8 text-gray-400 hover:text-gray-200"
                  onClick={onClose}
                >
                  <X size={16} />
                </Button>
              </>
            )}
          </div>

          {/* Model Selector - Only show when open */}
          {isOpen && (
            <div className="flex-shrink-0">
              <ModelSelector 
                selectedModel={selectedModel}
                onModelChange={onModelChange}
                disabled={isConnected === false}
              />
            </div>
          )}

          {/* Stats Panel - Only show when open */}
          {isOpen && (
            <div className="flex-shrink-0">
              <StatsPanel stats={stats} onRefresh={onRefreshStats} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 flex-shrink-0 mt-2">
            <Button
              variant="outline"
              className={`${isOpen ? 'w-full justify-start' : 'w-full justify-center'} bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200`}
              onClick={onLoadHistory}
              title="Load History"
            >
              <History size={16} className={isOpen ? "mr-2" : ""} />
              {isOpen && "Load History"}
            </Button>
            
            <Button
              variant="outline"
              className={`${isOpen ? 'w-full justify-start' : 'w-full justify-center'} bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200`}
              onClick={onClearChat}
              title="Clear Chat"
            >
              <RefreshCw size={16} className={isOpen ? "mr-2" : ""} />
              {isOpen && "Clear Chat"}
            </Button>
            
            <Button
              variant="outline"
              className={`${isOpen ? 'w-full justify-start' : 'w-full justify-center'} bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200`}
              onClick={onClearHistory}
              title="Clear History"
            >
              <Trash2 size={16} className={isOpen ? "mr-2" : ""} />
              {isOpen && "Clear History"}
            </Button>
          </div>

          {/* Connection Status - Only show when open */}
          {isOpen && isConnected === false && (
            <Card className="bg-red-900/20 border-red-800 flex-shrink-0">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <Database size={14} />
                  Backend Offline
                </div>
                <p className="text-xs text-red-300 mt-1">
                  Make sure the Python backend is running on port 8000.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Collapsed Status Indicator */}
          {!isOpen && isConnected !== null && (
            <div className="flex justify-center mt-4">
              <div 
                className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                title={isConnected ? 'Backend Connected' : 'Backend Offline'}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
