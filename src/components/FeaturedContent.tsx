import { motion } from 'framer-motion';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';

interface FeaturedContentProps {
  item: Movie;
  onPlayClick: (movie: Movie) => void;
  onMoreInfoClick: (movie: Movie) => void;
}

export default function FeaturedContent({ 
  item, 
  onPlayClick, 
  onMoreInfoClick 
}: FeaturedContentProps) {
  return (
    <section className="relative py-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        <img
          src={item.backdropPath || item.posterPath}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
              Featured
            </span>
            {item.voteAverage && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span>{item.voteAverage.toFixed(1)}</span>
              </div>
            )}
            {item.releaseDate && (
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(item.releaseDate).getFullYear()}</span>
              </div>
            )}
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">{item.title}</h2>
          
          <p className="text-gray-300 text-lg mb-8 line-clamp-3">
            {item.overview}
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlayClick(item)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-red-600 hover:bg-red-700 text-white",
                "transition-colors duration-200"
              )}
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoreInfoClick(item)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-white/10 hover:bg-white/20 text-white",
                "backdrop-blur-sm transition-colors duration-200"
              )}
            >
              <Info className="w-5 h-5" />
              More Info
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}