import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface MovieRowProps {
  title: string;
  items: Movie[];
  onItemClick: (movie: Movie) => void;
}

export default function MovieRow({ title, items, onItemClick }: MovieRowProps) {
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
    
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const distance = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - distance;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div 
      className="relative group space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute -left-4 top-1/2 -translate-y-1/2 z-10",
            "bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100",
            "transition-all duration-300 hover:bg-red-600",
            "transform hover:scale-110",
            "backdrop-blur-sm"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Movies Container */}
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
        {items.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="flex-none w-[200px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <MovieCard
              movie={item}
              onClick={() => onItemClick(item)}
              className="transform transition-all duration-500 hover:scale-110"
            />
          </motion.div>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-10",
            "bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100",
            "transition-all duration-300 hover:bg-red-600",
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