'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Clock, Sparkles } from 'lucide-react';

interface ModelOption {
  value: string;
  label: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
}

const models: ModelOption[] = [
  {
    value: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    description: 'Latest and fastest model',
    badge: 'Default',
    icon: <Sparkles size={14} className="text-purple-400" />
  },
  {
    value: 'gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash Lite',
    description: 'Ultra-fast lightweight model',
    badge: 'New',
    icon: <Zap size={14} className="text-green-400" />
  },
  {
    value: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    description: 'Most capable and advanced',
    badge: 'Pro',
    icon: <Brain size={14} className="text-indigo-400" />
  },
  {
    value: 'gemini-1.5-flash',
    label: 'Gemini 1.5 Flash',
    description: 'Fast and efficient',
    icon: <Zap size={14} className="text-yellow-400" />
  },
  {
    value: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro',
    description: 'More capable but slower',
    icon: <Brain size={14} className="text-blue-400" />
  },
  {
    value: 'gemini-1.0-pro',
    label: 'Gemini 1.0 Pro',
    description: 'Legacy model',
    icon: <Clock size={14} className="text-gray-400" />
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
  const currentModel = models.find(m => m.value === selectedModel) || models[0];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-400 font-medium">AI Model</label>
      <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500">
          <SelectValue>
            <div className="flex items-center gap-2">
              {currentModel.icon}
              <span className="text-sm">{currentModel.label}</span>
              {currentModel.badge && (
                <Badge variant="secondary" className="text-xs px-1 py-0 h-auto">
                  {currentModel.badge}
                </Badge>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {models.map((model) => (
            <SelectItem 
              key={model.value} 
              value={model.value}
              className="text-gray-100 focus:bg-gray-700 focus:text-gray-100"
            >
              <div className="flex items-center gap-3 py-1">
                {model.icon}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.label}</span>
                    {model.badge && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-auto">
                        {model.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{model.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
