import { useState } from 'react';
import { useWatchlist } from '../contexts/WatchlistContext';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { SearchResult } from '../types/movie';
import { Bookmark } from 'lucide-react';
import Header from '../components/Header';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState<SearchResult | null>(null);

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bookmark className="w-16 h-16 text-gray-500 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Your watchlist is empty</h2>
              <p className="text-gray-400">
                Add movies and TV shows to your watchlist to keep track of what you want to watch
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-8">My Watchlist</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.imdbId}
                movie={movie}
                onClick={setSelectedMovie}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedMovie && (
        <MovieModal
          movieId={selectedMovie.imdbId || selectedMovie.id.toString()}
          isImdbId={!!selectedMovie.imdbId}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}