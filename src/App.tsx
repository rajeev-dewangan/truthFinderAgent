import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { chatService } from "@/services/chatService";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    const storedSessionId = localStorage.getItem("truth_finder_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem("truth_finder_session_id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(content, sessionId);
      
      const agentMessage: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        content: response.response,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optional: Add error message to chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        content: "I apologize, but I'm having trouble connecting to the server. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (!sessionId) return;
    
    try {
      await chatService.clearChat(sessionId);
      setMessages([]);
      // We don't generate a new session ID, just clear the history for the current one
      // as per the API behavior (it clears history for the user_id)
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  const isCentered = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header onClear={handleClear} showClear={messages.length > 0} />

      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
          <div className="w-full max-w-3xl mx-auto pt-24 pb-32 min-h-full flex flex-col justify-end">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl mx-auto py-8 px-4 flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce mx-0.5" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <div className="text-zinc-500 text-sm flex items-center font-medium">
                  Thinking...
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 z-10">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            isCentered={isCentered}
          />
        </div>
      </main>
    </div>
  );
}
