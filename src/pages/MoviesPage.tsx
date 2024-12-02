import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Film, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import GenreFilter from '../components/GenreFilter';
import Footer from '../components/Footer';
import { fetchMovies } from '../services/api';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [contentType, setContentType] = useState<'movies' | 'tv'>('movies');
  const navigate = useNavigate();

  // Fetch movies with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['movies', selectedGenre],
    queryFn: ({ pageParam = 1 }) => 
      fetchMovies(
        selectedGenre ? 'genre' : 'popular',
        selectedGenre?.toString(),
        pageParam
      ),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  // Flatten all pages into a single array of movies
  const allMovies = data?.pages.flatMap(page => page.results) ?? [];

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Failed to load movies'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20">
        {/* Futuristic Hero Section */}
        <div className="relative min-h-[60vh] overflow-hidden">
          {/* Dynamic Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-purple-900/30 to-blue-900/30"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />

            {/* Animated Scanner Effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              animate={{
                y: ['0%', '6000%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-6"
            >
              {/* Decorative Elements */}
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-red-500 to-transparent" />
                <div className="absolute -left-8 top-0 w-1 h-32 bg-gradient-to-b from-purple-500 to-transparent opacity-50" />
              </div>

              <motion.h1 
                className="text-6xl md:text-7xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
                  Movies
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-gray-300 max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Discover the latest blockbusters, timeless classics, and hidden gems from around the world.
                Immerse yourself in a universe of cinematic excellence.
              </motion.p>

              {/* Stats Display */}
              <motion.div 
                className="flex flex-wrap gap-8 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative glass px-6 py-4 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-1">{allMovies.length}+</div>
                    <div className="text-sm text-gray-400">Movies Available</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative glass px-6 py-4 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-1">4K</div>
                    <div className="text-sm text-gray-400">Ultra HD</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative glass px-6 py-4 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-1">50+</div>
                    <div className="text-sm text-gray-400">Genres</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-4 right-4 w-32 h-32 border border-red-500/20 rounded-full" />
          <div className="absolute top-8 right-8 w-32 h-32 border border-purple-500/20 rounded-full" />
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-blue-500/20 rounded-full" />
        </div>

        {/* Genre Filter */}
        <GenreFilter
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
          contentType={contentType}
          onContentTypeChange={setContentType}
        />

        {/* Movies Grid with Infinite Scroll */}
        <div className="container mx-auto px-4 py-8">
          <MovieGrid
            movies={allMovies}
            isLoading={isLoading || isFetchingNextPage}
            hasMore={!!hasNextPage}
            onLoadMore={() => fetchNextPage()}
            onMovieClick={handleMovieClick}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}