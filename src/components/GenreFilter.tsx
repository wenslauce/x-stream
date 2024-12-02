import { Film, Tv } from 'lucide-react';
import { MOVIE_GENRES, TV_GENRES } from '../services/api';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface GenreFilterProps {
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
  contentType: 'movies' | 'tv';
  onContentTypeChange: (type: 'movies' | 'tv') => void;
}

export default function GenreFilter({
  selectedGenre,
  onGenreSelect,
  contentType,
  onContentTypeChange
}: GenreFilterProps) {
  const genres = contentType === 'movies' ? MOVIE_GENRES : TV_GENRES;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full space-y-6 sticky top-16 bg-black/80 backdrop-blur-sm z-30 py-4">
      <div className="container mx-auto px-4">
        {/* Content Type Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onContentTypeChange('movies')}
            className={cn(
              "relative group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300",
              contentType === 'movies'
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                : "bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-700/50"
            )}
          >
            <Film className="w-5 h-5" />
            Movies
            {contentType === 'movies' && (
              <motion.div
                layoutId="activeType"
                className="absolute inset-0 rounded-xl bg-white/10"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onContentTypeChange('tv')}
            className={cn(
              "relative group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300",
              contentType === 'tv'
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : "bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-700/50"
            )}
          >
            <Tv className="w-5 h-5" />
            TV Shows
            {contentType === 'tv' && (
              <motion.div
                layoutId="activeType"
                className="absolute inset-0 rounded-xl bg-white/10"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        </div>

        {/* Genre Tags */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide touch-pan-x"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onGenreSelect(null)}
            className={cn(
              "flex-none px-4 py-2 rounded-xl text-sm transition-all duration-300",
              "hover:scale-105",
              !selectedGenre
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-700/50"
            )}
          >
            All
          </motion.button>
          
          {Object.entries(genres).map(([name, id]) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGenreSelect(id)}
              className={cn(
                "flex-none px-4 py-2 rounded-xl text-sm transition-all duration-300",
                "hover:scale-105",
                selectedGenre === id
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-700/50"
              )}
            >
              {name.charAt(0) + name.slice(1).toLowerCase().replace('_', ' ')}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}