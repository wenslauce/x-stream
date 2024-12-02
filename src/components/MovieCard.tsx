import { Play, Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';
import { useWatchlist } from '../contexts/WatchlistContext';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  className?: string;
}

export default function MovieCard({ movie, onClick, className }: MovieCardProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const posterUrl = movie.posterPath || 'https://via.placeholder.com/300x450?text=No+Poster';
  const isInList = isInWatchlist(movie.id.toString());

  // Safely handle the vote average
  const rating = typeof movie.voteAverage === 'number' 
    ? movie.voteAverage.toFixed(1) 
    : 'N/A';

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInList) {
      removeFromWatchlist(movie.id.toString());
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div 
      className={cn(
        "card neon-glow touch-manipulation",
        "group cursor-pointer min-h-[200px]",
        className
      )}
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <img 
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Hover/Touch Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent 
                       opacity-0 group-hover:opacity-100 md:group-focus:opacity-100
                       transition-all duration-500 flex flex-col items-center 
                       justify-center p-4 backdrop-blur-sm">
          <div className="transform translate-y-8 group-hover:translate-y-0 
                        md:group-focus:translate-y-0 transition-transform duration-500">
            <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white mb-4 animate-pulse-slow" />
            <h3 className="text-fluid-lg font-bold text-center mb-2">{movie.title}</h3>
            <p className="text-fluid-sm text-gray-300 text-center line-clamp-3">{movie.overview}</p>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start
                       opacity-100 md:opacity-0 md:group-hover:opacity-100 
                       transition-opacity duration-300">
          {/* Rating Badge */}
          <div className="glass flex items-center gap-1 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-fluid-sm font-medium">
              {rating}
            </span>
          </div>

          {/* Watchlist Button - Enlarged for touch */}
          <button
            onClick={handleWatchlistClick}
            className={cn(
              "p-3 rounded-full transition-all duration-300",
              "hover:scale-110 active:scale-95",
              isInList
                ? "glass text-red-500"
                : "glass text-white hover:text-red-500"
            )}
          >
            {isInList ? (
              <BookmarkCheck className="w-6 h-6" />
            ) : (
              <Bookmark className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}