import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface SynopsisProps {
  text: string;
}

export default function Synopsis({ text }: SynopsisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = text.length > 200;
  const displayText = !shouldTruncate || isExpanded ? text : text.slice(0, 200) + '...';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
        <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Synopsis
        </span>
      </h3>
      
      <div className="relative">
        <motion.div 
          className="relative group"
          layout
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
          <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={isExpanded ? 'expanded' : 'collapsed'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm md:text-base text-gray-300 leading-relaxed"
              >
                {displayText}
              </motion.p>
            </AnimatePresence>

            {shouldTruncate && (
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "flex items-center gap-1 mt-2 md:mt-4",
                  "text-sm md:text-base text-cyan-500 hover:text-cyan-400",
                  "transition-colors group"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative">
                  {isExpanded ? 'Show Less' : 'Read More'}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Futuristic decorative elements */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent rounded-full"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-transparent rounded-full"></div>
      </div>
    </motion.div>
  );
}