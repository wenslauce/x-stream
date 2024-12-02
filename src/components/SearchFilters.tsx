import { X } from 'lucide-react';
import { MOVIE_GENRES } from '../services/api';

interface SearchFiltersProps {
  filters: {
    genre: string;
    year: string;
    rating: string;
    type: 'all' | 'movie' | 'tv';
  };
  onChange: (filters: any) => void;
  onClose: () => void;
}

export default function SearchFilters({ filters, onChange, onClose }: SearchFiltersProps) {
  // Generate years from 1950 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => (currentYear - i).toString()
  );

  // Rating options
  const ratings = ['9', '8', '7', '6', '5', '4'];

  return (
    <div className="bg-zinc-900 rounded-lg p-6 space-y-6 relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Genre Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => onChange({ ...filters, genre: e.target.value })}
            className="w-full bg-zinc-800 text-white rounded-md px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Genres</option>
            {Object.entries(MOVIE_GENRES).map(([name, id]) => (
              <option key={id} value={id}>
                {name.charAt(0) + name.slice(1).toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Release Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => onChange({ ...filters, year: e.target.value })}
            className="w-full bg-zinc-800 text-white rounded-md px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Minimum Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => onChange({ ...filters, rating: e.target.value })}
            className="w-full bg-zinc-800 text-white rounded-md px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Any Rating</option>
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ Stars
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Filters */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => onChange({
            genre: '',
            year: '',
            rating: '',
            type: 'all'
          })}
          className="text-sm text-red-500 hover:text-red-400"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}