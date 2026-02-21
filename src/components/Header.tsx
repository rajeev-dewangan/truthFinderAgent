import { Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  onClear: () => void;
  showClear: boolean;
}

export function Header({ onClear, showClear }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-8 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Truth Finder Agent
      </div>
      
      {showClear && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear chat history"
        >
          <Trash2 size={14} />
          <span>Clear Chat</span>
        </motion.button>
      )}
    </header>
  );
}
