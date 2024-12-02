import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Movie } from '../types/movie';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';

interface ContinueWatchingProps {
  onItemClick: (movie: Movie) => void;
}

interface WatchProgress extends Movie {
  progress: number;
  lastWatched: string;
}

export default function ContinueWatching({ onItemClick }: ContinueWatchingProps) {
  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>([]);

  useEffect(() => {
    // Load all movie progress
    const allMovies = Object.keys(localStorage)
      .filter(key => key.startsWith('x-stream-cache-progress-'))
      .map(key => {
        const movieId = key.replace('x-stream-cache-progress-', '');
        const progress = storage.getProgress(movieId);
        if (!progress) return null;

        const movieData = storage.getCacheItem<Movie>(`movie-details-${movieId}`);
        if (!movieData) return null;

        return {
          ...movieData,
          progress: progress.progress,
          lastWatched: progress.lastWatched
        };
      })
      .filter((item): item is WatchProgress => item !== null)
      // Sort by last watched
      .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());

    setWatchProgress(allMovies);
  }, []);

  if (!watchProgress.length) return null;

  const removeItem = (movieId: number) => {
    storage.cacheStorage.remove(`progress-${movieId}`);
    setWatchProgress(prev => prev.filter(item => item.id !== movieId));
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">Continue Watching</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchProgress.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div 
                className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <img
                  src={item.posterPath || ''}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <div 
                    className="h-full bg-red-600"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className={cn(
                  "absolute -top-2 -right-2 p-1 rounded-full",
                  "bg-red-600 text-white opacity-0 group-hover:opacity-100",
                  "transition-opacity duration-200 z-10"
                )}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title */}
              <h3 className="mt-2 text-sm text-gray-300 line-clamp-2">
                {item.title}
              </h3>

              {/* Last Watched */}
              <p className="text-xs text-gray-500">
                {new Date(item.lastWatched).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}