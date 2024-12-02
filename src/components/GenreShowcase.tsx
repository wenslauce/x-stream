import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchMovies } from '../services/api';
import { MOVIE_GENRES } from '../services/api';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { cn } from '../lib/utils';

interface GenreShowcaseProps {
  onMovieClick: (movie: Movie) => void;
}

export default function GenreShowcase({ onMovieClick }: GenreShowcaseProps) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: movies } = useQuery({
    queryKey: ['genre-movies', selectedGenre],
    queryFn: () => fetchMovies('genre', selectedGenre?.toString()),
    enabled: !!selectedGenre,
  });

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-900/50 to-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">Explore by Genre</h2>
        
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(MOVIE_GENRES).map(([name, id]) => (
            <motion.button
              key={id}
              onClick={() => setSelectedGenre(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedGenre === id
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white"
                  : "bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50 hover:text-white"
              )}
            >
              {name.charAt(0) + name.slice(1).toLowerCase().replace('_', ' ')}
            </motion.button>
          ))}
        </div>

        {/* Movies Grid */}
        {movies?.results && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.results.slice(0, 6).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={onMovieClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}