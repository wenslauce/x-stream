import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Tv, AlertTriangle, Play, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import GenreFilter from '../components/GenreFilter';
import Footer from '../components/Footer';
import { fetchSeries } from '../services/api';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';

export default function SeriesPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [contentType, setContentType] = useState<'movies' | 'tv'>('tv');
  const navigate = useNavigate();

  // Fetch TV series with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['series', selectedGenre],
    queryFn: ({ pageParam = 1 }) => 
      fetchSeries(
        selectedGenre ? 'genre' : 'popular',
        selectedGenre?.toString(),
        pageParam
      ),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  // Flatten all pages into a single array of series
  const allSeries = data?.pages.flatMap(page => page.results) ?? [];

  const handleSeriesClick = (series: Movie) => {
    navigate(`/series/${series.id}`);
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
              {error instanceof Error ? error.message : 'Failed to load TV series'}
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

  // Featured series (first item from the results)
  const featuredSeries = allSeries[0];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20">
        {/* Futuristic Hero Section */}
        <div className="relative min-h-[70vh] overflow-hidden">
          {/* Dynamic Background */}
          <div className="absolute inset-0">
            {featuredSeries && (
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute inset-0"
              >
                <img
                  src={featuredSeries.backdropPath || featuredSeries.posterPath}
                  alt={featuredSeries.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

            {/* Animated Accents */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-cyan-900/30 to-teal-900/30"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />

            {/* Scanner Effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              animate={{
                y: ['0%', '7000%'],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Title and Description */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-blue-500 to-transparent" />
                  <div className="absolute -left-8 top-0 w-1 h-32 bg-gradient-to-b from-cyan-500 to-transparent opacity-50" />
                
                  <motion.h1 
                    className="text-6xl md:text-7xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500">
                      TV Series
                    </span>
                  </motion.h1>
                </div>

                <motion.p 
                  className="text-xl text-gray-300 max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Dive into epic storylines, complex characters, and unforgettable moments.
                  Your next binge-worthy adventure awaits.
                </motion.p>

                {/* Featured Series Info */}
                {featuredSeries && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-500/20">
                        Featured Series
                      </span>
                      {featuredSeries.voteAverage && (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          {featuredSeries.voteAverage.toFixed(1)}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white">{featuredSeries.title}</h2>
                    <p className="text-gray-400 line-clamp-2">{featuredSeries.overview}</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSeriesClick(featuredSeries)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-5 h-5" fill="currentColor" />
                      Watch Now
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>

              {/* Right Column - Decorative Elements */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="hidden lg:block relative"
              >
                <div className="absolute top-0 right-0 w-64 h-64 border border-blue-500/20 rounded-full animate-spin-slow" />
                <div className="absolute top-4 right-4 w-64 h-64 border border-cyan-500/20 rounded-full animate-reverse-spin" />
                <div className="absolute top-8 right-8 w-64 h-64 border border-teal-500/20 rounded-full animate-spin-slow" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Genre Filter */}
        <GenreFilter
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
          contentType={contentType}
          onContentTypeChange={setContentType}
        />

        {/* Series Grid with Infinite Scroll */}
        <div className="container mx-auto px-4 py-8">
          <MovieGrid
            movies={allSeries}
            isLoading={isLoading || isFetchingNextPage}
            hasMore={!!hasNextPage}
            onLoadMore={() => fetchNextPage()}
            onMovieClick={handleSeriesClick}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}