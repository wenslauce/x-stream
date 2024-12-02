import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface CastMember {
  id: number;
  name: string;
  character?: string;
  profilePath: string | null;
}

interface CastRowProps {
  cast: CastMember[];
}

export default function CastRow({ cast }: CastRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
    
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const distance = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - distance;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!cast.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group space-y-4"
    >
      <h3 className="text-lg md:text-xl font-semibold text-white">Cast & Crew</h3>
      
      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute -left-4 top-1/2 translate-y-4 z-10",
            "bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100",
            "transition-all duration-300 hover:bg-cyan-600",
            "transform hover:scale-110",
            "backdrop-blur-sm"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Cast Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {cast.map((member, index) => (
          <motion.div 
            key={member.id} 
            className="flex-none w-[160px] md:w-[180px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="relative group touch-manipulation">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
              <div className="relative bg-zinc-900 rounded-lg overflow-hidden backdrop-blur-sm">
                <div className="aspect-[2/3] bg-zinc-800">
                  {member.profilePath ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={member.profilePath}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h4 className="text-sm md:text-base font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                    {member.name}
                  </h4>
                  {member.character && (
                    <p className="text-xs md:text-sm text-gray-400 truncate mt-1 group-hover:text-gray-300">
                      {member.character}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute -right-4 top-1/2 translate-y-4 z-10",
            "bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100",
            "transition-all duration-300 hover:bg-cyan-600",
            "transform hover:scale-110",
            "backdrop-blur-sm"
          )}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
    </motion.div>
  );
}