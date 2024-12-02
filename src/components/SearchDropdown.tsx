import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { Film, Tv } from 'lucide-react';
import { cn } from '../lib/utils';

interface SearchDropdownProps {
  results: Movie[];
  isVisible: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ results, isVisible, onClose }: SearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleItemClick = (result: Movie) => {
    const route = result.mediaType === 'tv' ? `/series/${result.id}` : `/movie/${result.id}`;
    navigate(route);
    onClose();
  };

  if (!isVisible || results.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-lg shadow-lg overflow-hidden max-h-[70vh] overflow-y-auto scrollbar-hide z-50"
    >
      {results.map((result) => (
        <button
          key={result.id}
          className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors"
          onClick={() => handleItemClick(result)}
        >
          <img
            src={result.posterPath || 'https://via.placeholder.com/45x68?text=No+Image'}
            alt={result.title}
            className="w-[45px] h-[68px] object-cover rounded"
          />
          <div className="flex-1 text-left">
            <h3 className="text-white font-medium line-clamp-1">{result.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{new Date(result.releaseDate).getFullYear()}</span>
              <span>•</span>
              <div className={cn(
                "flex items-center gap-1",
                result.mediaType === 'tv' ? "text-blue-400" : "text-red-400"
              )}>
                {result.mediaType === 'tv' ? (
                  <Tv className="w-3 h-3" />
                ) : (
                  <Film className="w-3 h-3" />
                )}
                <span>{result.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}