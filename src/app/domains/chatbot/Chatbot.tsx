"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle } from "lucide-react";

const OPEN_WIDTH = "22rem";
const CLOSED_WIDTH = "4rem";

type ChatbotSidebarProps = {
  course: string;
  topic: string;
  onCollapse?: () => void;
};

export default function ChatbotSidebar({ course, topic, onCollapse }: ChatbotSidebarProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, setMessages } = useChat();

  useEffect(() => {
    setMessages([]);
  }, [course, topic, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--lesson-chatbot-width", isOpen ? OPEN_WIDTH : CLOSED_WIDTH);
    return () => {
      root.style.setProperty("--lesson-chatbot-width", OPEN_WIDTH);
    };
  }, [isOpen]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isThinking) {
      return;
    }

    setIsThinking(true);
    try {
      await sendMessage({ text: input }, { body: { course, topic } });
    } finally {
      setIsThinking(false);
      setInput("");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleCollapse = () => {
    setIsOpen(false);
    onCollapse?.();
  };

  if (!isOpen) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-l-3xl border-l border-emerald-100 bg-white shadow-lg shadow-emerald-100/50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md transition hover:from-emerald-400 hover:to-teal-400"
          title="Otwórz panel czatu"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col rounded-l-3xl border-l border-emerald-100 bg-white shadow-lg shadow-emerald-100/50">
      <header className="flex items-center justify-between border-b border-emerald-50 px-3 py-3">
        <button
          onClick={handleCollapse}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md transition hover:from-emerald-400 hover:to-teal-400"
          title="Zwiń panel czatu"
        >
          <MessageCircle className="h-5 w-5" />
        </button>

        <div className="ml-3 flex flex-1 flex-col">
          <span className="text-sm font-semibold text-emerald-700">MurAi</span>
          <span className="text-xs text-emerald-500/80">Twój asystent do nauki angielskiego</span>
        </div>

        <button
          onClick={handleNewChat}
          className="rounded-full border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:border-emerald-200 hover:bg-emerald-50"
        >
          Nowy czat
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-emerald-50/40 px-4 py-4">
        {messages.map((message, messageIndex) => (
          <div
            key={`${message.id}-${messageIndex}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-2 text-sm shadow-sm transition ${
                message.role === "user"
                  ? "rounded-br-none bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "rounded-bl-none border border-emerald-100 bg-white text-gray-800"
              }`}
            >
              {message.parts
                .filter((part) => part.type === "text")
                .map((part, index) => {
                  const text = part.text.trim();
                  const looksLikeMarkdown =
                    text.includes("**") || text.includes("#") || text.includes("- ") || text.includes("* ");
                  return looksLikeMarkdown ? (
                    <ReactMarkdown key={`${message.id}-${index}`}>{text}</ReactMarkdown>
                  ) : (
                    <span key={`${message.id}-${index}`}>{text}</span>
                  );
                })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-emerald-50 bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isThinking ? "MurAi pisze odpowiedź..." : "Napisz wiadomość..."}
            disabled={isThinking}
            className="flex-1 rounded-full border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-gray-700 transition placeholder:text-emerald-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isThinking}
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isThinking ? "..." : "Wyślij"}
          </button>
        </div>
      </form>
    </div>
  );
}
