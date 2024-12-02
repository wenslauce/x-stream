import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMovieClick: (movie: Movie) => void;
}

export default function MovieGrid({ 
  movies, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  onMovieClick 
}: MovieGridProps) {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading]);

  // Create a Map to handle duplicate IDs
  const uniqueMovies = movies.reduce((acc, movie) => {
    // Create a unique key using movie ID and media type
    const key = `${movie.id}-${movie.mediaType || 'movie'}`;
    if (!acc.has(key)) {
      acc.set(key, movie);
    }
    return acc;
  }, new Map<string, Movie>());

  if (!movies.length && !isLoading) {
    return (
      <div className="text-center py-20">
        <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {Array.from(uniqueMovies.values()).map((movie) => (
          <motion.div
            key={`${movie.id}-${movie.mediaType || 'movie'}-${movie.releaseDate}`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <MovieCard
              movie={movie}
              onClick={onMovieClick}
              className="transform transition-all duration-300 hover:scale-105 hover:z-10"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading indicator and infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          </div>
        )}
      </div>
    </div>
  );
}