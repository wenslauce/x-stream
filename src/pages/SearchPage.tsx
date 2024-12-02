import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Film, Tv, SlidersHorizontal, X } from 'lucide-react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { searchAll } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { cn } from '../lib/utils';
import SearchFilters from '../components/SearchFilters';
import { Movie } from '../types/movie';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    type: 'all' as 'all' | 'movie' | 'tv'
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search-all', debouncedSearch],
    queryFn: () => searchAll(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });

  const filteredResults = searchResults?.results.filter((item: Movie) => {
    if (filters.type !== 'all' && item.mediaType !== filters.type) return false;
    if (filters.year && new Date(item.releaseDate).getFullYear().toString() !== filters.year) return false;
    if (filters.rating && item.voteAverage < parseInt(filters.rating)) return false;
    return true;
  });

  const handleMovieClick = (movie: Movie) => {
    const route = movie.mediaType === 'tv' ? `/series/${movie.id}` : `/movie/${movie.id}`;
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Search Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="relative">
            <input
              type="search"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 text-white rounded-full px-6 py-4 pl-14 
                         focus:outline-none focus:ring-2 focus:ring-red-600
                         placeholder:text-gray-400"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full",
                "hover:bg-white/10 transition-colors",
                showFilters && "text-red-500"
              )}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>

        {/* Results Section */}
        <div className="mt-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
          ) : searchQuery.length < 2 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl text-gray-400">
                Start typing to search for movies and TV shows
              </h2>
            </div>
          ) : filteredResults?.length === 0 ? (
            <div className="text-center py-20">
              <X className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl text-white mb-2">No results found</h2>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Search Results
                  <span className="text-gray-400 text-sm ml-2">
                    ({filteredResults?.length} items)
                  </span>
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFilters(f => ({ ...f, type: 'all' }))}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm",
                      filters.type === 'all' 
                        ? "bg-red-600 text-white" 
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilters(f => ({ ...f, type: 'movie' }))}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm",
                      filters.type === 'movie'
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <Film className="w-4 h-4" />
                    Movies
                  </button>
                  <button
                    onClick={() => setFilters(f => ({ ...f, type: 'tv' }))}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm",
                      filters.type === 'tv'
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <Tv className="w-4 h-4" />
                    TV Shows
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredResults?.map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    onClick={() => handleMovieClick(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}