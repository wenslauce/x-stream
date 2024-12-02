import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Star, Clock, Calendar, Bookmark, BookmarkCheck, AlertTriangle } from 'lucide-react';
import { getMovieDetails, getRelatedMovies } from '../services/api';
import Header from '../components/Header';
import RelatedContent from '../components/RelatedContent';
import Synopsis from '../components/Synopsis';
import CastRow from '../components/CastRow';
import ReviewSection from '../components/ReviewSection';
import VideoPlayer from '../components/VideoPlayer';
import { useWatchlist } from '../contexts/WatchlistContext';
import { cn } from '../lib/utils';
import { ApiError } from '../types/error';
import Footer from '../components/Footer';

const SERVERS = [
  { id: 'upcloud', name: 'UpCloud', status: 'online' },
  { id: 'vidcloud', name: 'VidCloud', status: 'online' },
  { id: 'doodstream', name: 'DoodStream', status: 'offline' },
];

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState('upcloud');
  const [isPlaying, setIsPlaying] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const { data: movie, isLoading, isError, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id!),
    enabled: !!id,
  });

  const { data: relatedMovies } = useQuery({
    queryKey: ['related-movies', id],
    queryFn: () => getRelatedMovies(id!),
    enabled: !!id,
  });

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const toggleWatchlist = () => {
    if (!movie) return;
    if (isInWatchlist(movie.id.toString())) {
      removeFromWatchlist(movie.id.toString());
    } else {
      addToWatchlist(movie);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Failed to load movie</h2>
            <p className="text-gray-400 mb-4">
              {error instanceof ApiError ? error.message : 'An error occurred while loading the movie.'}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <div className="relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] mb-8">
          <div className="absolute inset-0">
            <img
              src={movie.backdropPath || movie.posterPath}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-end md:items-center p-4 md:p-8">
            <div className="container mx-auto">
              <div className="max-w-3xl space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                  {movie.voteAverage && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                      <span>{movie.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {movie.releaseDate && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{movie.runtime} min</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 md:gap-4">
                  <button
                    onClick={handlePlayClick}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 
                           bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Watch Now
                  </button>

                  <button
                    onClick={toggleWatchlist}
                    className={cn(
                      "flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-lg",
                      "transition-colors",
                      isInWatchlist(movie.id.toString())
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {isInWatchlist(movie.id.toString()) ? (
                      <>
                        <BookmarkCheck className="w-5 h-5" />
                        <span className="hidden md:inline">In Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        <span className="hidden md:inline">Add to Watchlist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Main Content */}
          <div className="space-y-8 md:space-y-12">
            {/* Synopsis Section */}
            <Synopsis text={movie.overview} />

            {/* Cast Section */}
            {movie.cast && movie.cast.length > 0 && (
              <CastRow cast={movie.cast} />
            )}

            {/* Genres Section */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold text-white">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-4 py-2 bg-zinc-800/50 rounded-lg text-sm text-gray-300 backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Server Selection */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-white">Available Servers</h3>
              <div className="flex flex-wrap gap-2">
                {SERVERS.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => setSelectedServer(server.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
                      selectedServer === server.id
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50"
                    )}
                    disabled={server.status === 'offline'}
                  >
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      server.status === 'online' ? "bg-green-500" : "bg-red-500"
                    )} />
                    {server.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection movieId={movie.id.toString()} />

            {/* Related Movies */}
            {relatedMovies && relatedMovies.length > 0 && (
              <RelatedContent
                title="More Like This"
                items={relatedMovies}
                onItemClick={(id) => navigate(`/movie/${id}`)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Video Player Modal */}
      {isPlaying && (
        <VideoPlayer
          mediaId={movie.imdbId || movie.id.toString()}
          onClose={() => setIsPlaying(false)}
        />
      )}

      <Footer />
    </div>
  );
}