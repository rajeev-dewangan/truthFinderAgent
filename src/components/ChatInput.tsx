import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isCentered: boolean;
}

export function ChatInput({ onSend, isLoading, isCentered }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        y: isCentered ? 0 : 0, // Let layout prop handle the position change
      }}
      className={cn(
        "w-full max-w-3xl mx-auto px-4 transition-all duration-500 ease-in-out",
        isCentered 
          ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
          : "relative bottom-0 pb-6 pt-2"
      )}
    >
      {isCentered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 font-sans">
            Find the Truth
          </h1>
          <p className="text-zinc-500 max-w-md mx-auto text-lg">
            Uncover the real problems behind your challenges. Not the symptoms,
            but the root cause.
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="relative group w-full">
        <div className="relative flex items-end gap-2 p-3 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-200/50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/50 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your challenge..."
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-zinc-900 placeholder:text-zinc-400 resize-none focus:outline-none py-3 px-2 max-h-[200px] min-h-[24px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 mb-1",
              input.trim() && !isLoading
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
