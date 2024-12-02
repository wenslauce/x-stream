import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';

interface HeroSliderProps {
  items: Movie[];
  autoPlayInterval?: number;
  onPlayClick?: (movie: Movie) => void;
}

export default function HeroSlider({ 
  items, 
  autoPlayInterval = 5000,
  onPlayClick 
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval, isHovered]);

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentItem = items[currentIndex];

  if (!items.length) return null;

  return (
    <div 
      className="relative min-h-[90vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <img
            src={currentItem.backdropPath || currentItem.posterPath}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
          
          {/* Futuristic Scanning Effect */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
            <div className="absolute h-px w-full top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl space-y-6 relative"
            >
              {/* Decorative Lines */}
              <div className="absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-cyan-500 to-transparent" />
              <div className="absolute -left-8 top-0 w-1 h-32 bg-gradient-to-b from-purple-500 to-transparent opacity-50" />

              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
                layoutId={`title-${currentItem.id}`}
              >
                {currentItem.title}
              </motion.h1>

              {/* Movie Info Pills */}
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{currentItem.voteAverage?.toFixed(1)}</span>
                </div>

                <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(currentItem.releaseDate).getFullYear()}</span>
                </div>

                {currentItem.mediaType && (
                  <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                    <Clock className="w-4 h-4" />
                    <span>{currentItem.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
                  </div>
                )}
              </div>

              <p className="text-lg md:text-xl text-gray-200 line-clamp-3 max-w-2xl glass p-4 rounded-lg backdrop-blur-sm">
                {currentItem.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  onClick={() => onPlayClick?.(currentItem)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300" />
                  <div className="relative flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Watch Now
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigate(`/${currentItem.mediaType}/${currentItem.id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300" />
                  <div className="relative flex items-center gap-2 px-6 py-3 glass text-white rounded-lg backdrop-blur-sm">
                    <Info className="w-5 h-5" />
                    More Info
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass backdrop-blur-md text-white hover:bg-white/20 transition-colors z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass backdrop-blur-md text-white hover:bg-white/20 transition-colors z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "relative h-2 transition-all duration-300 rounded-full overflow-hidden",
              index === currentIndex ? "w-8 bg-red-600" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                layoutId="activeDot"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Side Previews */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => handleDotClick(index)}
            className={cn(
              "relative w-32 aspect-video rounded-lg overflow-hidden group",
              "transition-all duration-300",
              index === currentIndex ? "ring-2 ring-cyan-500" : "opacity-50 hover:opacity-80"
            )}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={item.backdropPath || item.posterPath}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-xs text-white line-clamp-1">{item.title}</p>
            </div>
            {index === currentIndex && (
              <div className="absolute inset-0 ring-1 ring-inset ring-cyan-500" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}