import { Play, Star, Clock, Calendar, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface HeroBannerProps {
  movie: Movie;
  onPlayClick: () => void;
}

export default function HeroBanner({ movie, onPlayClick }: HeroBannerProps) {
  const navigate = useNavigate();

  return (
    <div className="relative h-[85vh] w-full">
      {/* Background Image with Enhanced Gradient */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropPath || movie.posterPath}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div 
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-t from-black via-black/75 to-black/20",
            "after:absolute after:inset-0",
            "after:bg-gradient-to-r after:from-black/90 after:via-black/40 after:to-transparent"
          )}
        />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 md:px-6 pb-20 md:pb-24">
          <div className="max-w-3xl space-y-6">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              {movie.title}
            </h1>
            
            {/* Movie Info Pills */}
            <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
              {/* Rating */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{movie.voteAverage.toFixed(1)}</span>
              </div>

              {/* Release Year */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white">
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>

              {/* Runtime (if available) */}
              {movie.runtime && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white">
                  <Clock className="w-4 h-4" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-lg md:text-xl text-gray-200 line-clamp-3 max-w-2xl">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onPlayClick}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                  "bg-red-600 hover:bg-red-700 text-white",
                  "transition-colors duration-200",
                  "font-medium text-lg"
                )}
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Watch Now
              </button>

              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                  "bg-white/10 hover:bg-white/20 text-white",
                  "backdrop-blur-sm transition-colors duration-200",
                  "font-medium text-lg"
                )}
              >
                <Info className="w-5 h-5" />
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}