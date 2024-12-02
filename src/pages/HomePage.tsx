import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Clock, Calendar } from 'lucide-react';
import Header from '../components/Header';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';
import { 
  fetchMovies, 
  fetchSeries, 
  fetchTopRated, 
  fetchUpcoming,
  fetchTrending
} from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import ContinueWatching from '../components/ContinueWatching';
import UpcomingReleases from '../components/UpcomingReleases';

export default function HomePage() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Fetch content
  const { data: trendingContent } = useQuery({
    queryKey: ['trending'],
    queryFn: () => fetchTrending('week'),
  });

  const { data: topRated } = useQuery({
    queryKey: ['top-rated'],
    queryFn: () => fetchTopRated(),
  });

  const { data: upcoming } = useQuery({
    queryKey: ['upcoming'],
    queryFn: () => fetchUpcoming(),
  });

  const { data: popularShows } = useQuery({
    queryKey: ['popular-shows'],
    queryFn: () => fetchSeries('popular'),
  });

  const { data: popularMovies } = useQuery({
    queryKey: ['popular-movies'],
    queryFn: () => fetchMovies('popular'),
  });

  const handleMovieClick = (movie: Movie) => {
    const route = movie.mediaType === 'tv' ? `/series/${movie.id}` : `/movie/${movie.id}`;
    navigate(route);
  };

  const handlePlayClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlaying(true);
  };

  // Get hero content
  const heroContent = trendingContent?.results.slice(0, 5) || [];
  const currentHero = heroContent[activeHeroIndex];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen">
          <AnimatePresence mode="wait">
            {currentHero && (
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                {/* Background Image with Enhanced Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={currentHero.backdropPath || currentHero.posterPath}
                    alt={currentHero.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                  
                  {/* Animated Scan Line Effect */}
                  <div className="absolute inset-0">
                    <div className="absolute h-px w-full top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan" />
                  </div>
                </div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-3xl space-y-6"
                    >
                      {/* Movie Info Pills */}
                      <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                        <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">{currentHero.voteAverage?.toFixed(1)}</span>
                        </div>

                        <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(currentHero.releaseDate).getFullYear()}</span>
                        </div>

                        <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                          <Clock className="w-4 h-4" />
                          <span>{currentHero.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                        {currentHero.title}
                      </h1>

                      {/* Overview */}
                      <p className="text-lg md:text-xl text-gray-200 line-clamp-3 max-w-2xl glass p-4 rounded-lg backdrop-blur-sm">
                        {currentHero.overview}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4">
                        <motion.button
                          onClick={() => handlePlayClick(currentHero)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative group"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
                          <div className="relative flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg">
                            <Play className="w-5 h-5" fill="currentColor" />
                            Watch Now
                          </div>
                        </motion.button>

                        <motion.button
                          onClick={() => handleMovieClick(currentHero)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative group"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-200" />
                          <div className="relative flex items-center gap-2 px-6 py-3 glass text-white rounded-lg backdrop-blur-sm">
                            <Info className="w-5 h-5" />
                            More Info
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroIndex(index)}
                className={cn(
                  "relative h-2 transition-all duration-300 rounded-full overflow-hidden",
                  index === activeHeroIndex ? "w-8 bg-red-600" : "w-2 bg-white/50 hover:bg-white/80"
                )}
              >
                {index === activeHeroIndex && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600"
                    layoutId="activeHeroDot"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Content Sections */}
        <div className="relative z-10 -mt-32 space-y-12 pb-20">
          {/* Continue Watching */}
          <ContinueWatching onItemClick={handleMovieClick} />
          
          {/* Latest Releases */}
          {upcoming?.results && (
            <div className="container mx-auto px-4">
              <MovieRow
                title="Latest Releases"
                items={upcoming.results}
                onItemClick={handleMovieClick}
              />
            </div>
          )}

          {/* Popular Shows */}
          {popularShows?.results && (
            <div className="container mx-auto px-4">
              <MovieRow
                title="Popular TV Shows"
                items={popularShows.results}
                onItemClick={handleMovieClick}
              />
            </div>
          )}

          {/* Top Rated */}
          {topRated?.results && (
            <div className="container mx-auto px-4">
              <MovieRow
                title="Top Rated"
                items={topRated.results}
                onItemClick={handleMovieClick}
              />
            </div>
          )}

          {/* Popular Movies */}
          {popularMovies?.results && (
            <div className="container mx-auto px-4">
              <MovieRow
                title="Popular Movies"
                items={popularMovies.results}
                onItemClick={handleMovieClick}
              />
            </div>
          )}

          {/* Upcoming Releases */}
          {upcoming?.results && (
            <UpcomingReleases
              items={upcoming.results}
              onItemClick={handleMovieClick}
            />
          )}
        </div>
      </main>

      {/* Video Player Modal */}
      {isPlaying && selectedMovie && (
        <VideoPlayer
          mediaId={selectedMovie.id.toString()}
          type={selectedMovie.mediaType === 'tv' ? 'tv' : 'movie'}
          onClose={() => {
            setIsPlaying(false);
            setSelectedMovie(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}