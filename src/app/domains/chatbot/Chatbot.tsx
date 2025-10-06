'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatbotSidebar({ course, topic }: { course: string; topic: string }) {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, setMessages } = useChat();

  // Reset when switching lesson/topic
  useEffect(() => {
    setMessages([]);
  }, [course, topic]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    setIsThinking(true);
    try {
      await sendMessage({ text: input }, { body: { course, topic } });
    } finally {
      setIsThinking(false);
      setInput('');
    }
  }

  // Manual reset
  function handleNewChat() {
    setMessages([]);
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-t-3xl">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">MurAi</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Twój asystent do nauki angielskiego
          </p>
        </div>

        <button
          onClick={handleNewChat}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition cursor-pointer"
        >
          Nowy czat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth rounded-b-3xl">
        {messages.map((message, messageIndex) => (
          <div
            key={`${message.id}-${messageIndex}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-3xl text-sm max-w-[85%] shadow-sm transition-all duration-300 cursor-pointer ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none hover:opacity-90'
                  : 'bg-white/80 dark:bg-zinc-800/80 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-zinc-700/50 backdrop-blur-md rounded-bl-none hover:bg-gray-100 dark:hover:bg-zinc-700/80'
              }`}
            >
              {message.parts
                .filter((p) => p.type === 'text')
                .map((p, i) => {
                  const text = p.text.trim();
                  const looksLikeMarkdown =
                    text.includes('**') ||
                    text.includes('#') ||
                    text.includes('- ') ||
                    text.includes('* ');
                  return looksLikeMarkdown ? (
                    <ReactMarkdown key={`${message.id}-${i}`}>{text}</ReactMarkdown>
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
      <form
        onSubmit={handleSend}
        className="p-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 rounded-b-3xl"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isThinking ? 'MurAi odpowiada...' : 'Napisz wiadomość...'}
            disabled={isThinking}
            className="flex-1 px-4 py-3 rounded-full bg-gray-100/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-green-500 text-sm transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
          />
          <button
            type="submit"
            disabled={isThinking}
            className={`px-5 py-2 rounded-full text-white shadow-md transition-all cursor-pointer ${
              isThinking
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-95'
            }`}
          >
            {isThinking ? '...' : 'Wyślij'}
          </button>
        </div>
      </form>
    </div>
  );
}
