'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import highlight.js CSS for syntax highlighting
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const [copied, setCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLElement>(null);

  const handleCopy = async () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  // Extract language from className (format: "language-javascript")
  const language = className?.replace('language-', '') || 'text';

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-t-lg border-b border-gray-600">
        <span className="text-xs text-gray-300 font-medium">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? (
            <Check size={12} className="text-green-400" />
          ) : (
            <Copy size={12} className="text-gray-400" />
          )}
        </Button>
      </div>
      <pre className="!mt-0 !rounded-t-none bg-gray-800 overflow-x-auto">
        <code ref={codeRef} className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
};

const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <code className="bg-gray-700 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );
};

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom code block component
          pre: ({ children }) => {
            const codeElement = React.Children.toArray(children)[0] as any;
            if (codeElement?.props?.className) {
              return (
                <CodeBlock className={codeElement.props.className}>
                  {codeElement.props.children}
                </CodeBlock>
              );
            }
            return <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">{children}</pre>;
          },
          
          // Custom inline code component
          code: ({ children, className, ...props }) => {
            // If it's a code block (has className), let the pre component handle it
            if (className) {
              return <code className={className} {...props}>{children}</code>;
            }
            // Otherwise, it's inline code
            return <InlineCode>{children}</InlineCode>;
          },

          // Custom heading components
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-100 mt-6 mb-4 border-b border-gray-600 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-100 mt-5 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-gray-100 mt-4 mb-2">
              {children}
            </h3>
          ),

          // Custom list components
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 text-gray-200 my-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 text-gray-200 my-3">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-200">{children}</li>
          ),

          // Custom paragraph component
          p: ({ children }) => (
            <p className="text-gray-200 mb-3 leading-relaxed">{children}</p>
          ),

          // Custom blockquote component
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-800/50 rounded-r-lg my-4">
              <div className="text-gray-300 italic">{children}</div>
            </blockquote>
          ),

          // Custom table components
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-600 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-700">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-gray-800">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-gray-600">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-medium text-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-300">{children}</td>
          ),

          // Custom link component
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {children}
            </a>
          ),

          // Custom horizontal rule
          hr: () => (
            <hr className="border-gray-600 my-6" />
          ),

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-100">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
