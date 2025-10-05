'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatbotSidebar({ course, topic }: { course?: string; topic?: string }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages } = useChat();

  // 🧠 Load chat
  useEffect(() => {
    const saved = localStorage.getItem('murai-chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse chat:', err);
      }
    }
  }, [setMessages]);

  // 💾 Save chat
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('murai-chat', JSON.stringify(messages));
    }
  }, [messages]);

  // 📜 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 💬 Send message
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    // ✅ latest API: just pass an object with text + optional metadata
    await sendMessage({
      text: input,
      metadata: { course, topic },
    });

    setInput('');
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            🤖 MurAi <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Twój asystent do nauki angielskiego
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] shadow-sm transition-all duration-300 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none'
                  : 'bg-white/70 dark:bg-zinc-800/70 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-zinc-700/50 backdrop-blur-md rounded-bl-none'
              }`}
            >
              {message.parts
                .filter((p) => p.type === 'text')
                .map((p, i) => {
                  const text = p.text.trim();
                  const looksLikeMarkdown =
                    text.includes('**') || text.includes('#') || text.includes('- ') || text.includes('* ');
                  return looksLikeMarkdown ? (
                    <ReactMarkdown
                      key={`${message.id}-${i}`}
                      components={{
                        p: (props) => (
                          <p {...props} className="prose prose-sm dark:prose-invert leading-relaxed" />
                        ),
                        strong: (props) => (
                          <strong {...props} className="text-green-600 dark:text-green-400 font-semibold" />
                        ),
                        em: (props) => (
                          <em {...props} className="italic text-gray-700 dark:text-gray-300" />
                        ),
                        ul: (props) => (
                          <ul {...props} className="list-disc list-inside space-y-1 mt-2" />
                        ),
                        code: (props) => (
                          <code
                            {...props}
                            className="bg-gray-200/70 dark:bg-zinc-800/70 px-2 py-1 rounded-md text-xs font-mono text-green-600 dark:text-green-400"
                          />
                        ),
                      }}
                    >
                      {text}
                    </ReactMarkdown>
                  ) : (
                    <span key={`${message.id}-${i}`}>{text}</span>
                  );
                })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="💬 Napisz do MurAi..."
            className="flex-1 px-4 py-3 rounded-full bg-gray-100/80 dark:bg-zinc-800/80 border-0 focus:ring-2 focus:ring-green-500 text-sm transition-all outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all shadow-md"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
