import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Movie, SearchResult } from '../types/movie';
import { storage } from '../services/storage';

interface WatchlistContextType {
  watchlist: (Movie | SearchResult)[];
  addToWatchlist: (movie: Movie | SearchResult) => void;
  removeFromWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<(Movie | SearchResult)[]>(() => {
    return storage.getWatchlist();
  });

  // Sync state with storage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('x-stream-watchlist-')) {
        setWatchlist(storage.getWatchlist());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToWatchlist = (movie: Movie | SearchResult) => {
    if (!isInWatchlist(movie.id.toString())) {
      const updatedWatchlist = [...watchlist, movie];
      setWatchlist(updatedWatchlist);
      storage.saveToWatchlist(movie);
    }
  };

  const removeFromWatchlist = (movieId: string) => {
    const updatedWatchlist = watchlist.filter(movie => movie.id.toString() !== movieId);
    setWatchlist(updatedWatchlist);
    storage.removeFromWatchlist(movieId);
  };

  const isInWatchlist = (movieId: string) => {
    return storage.isInWatchlist(movieId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
    storage.watchlistStorage.clear();
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      clearWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}