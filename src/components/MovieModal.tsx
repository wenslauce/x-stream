import { X, AlertTriangle, Play, Star, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetails, getMovieDetailsByImdbId } from '../services/api';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import VideoPlayer from './VideoPlayer';
import { cn } from '../lib/utils';

interface MovieModalProps {
  movieId: string;
  isImdbId?: boolean;
  onClose: () => void;
}

export default function MovieModal({ movieId, isImdbId = false, onClose }: MovieModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Enhanced query with proper error handling and prefetching
  const { data: movie, isLoading, error, isError } = useQuery({
    queryKey: ['movie', movieId, isImdbId],
    queryFn: () => isImdbId ? getMovieDetailsByImdbId(movieId) : getMovieDetails(movieId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    useErrorBoundary: false,
  });

  const modalContent = () => {
    if (isError) {
      return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass rounded-lg p-6 max-w-md w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Movie</h3>
            <p className="text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Failed to load movie details. Please try again.'}
            </p>
            <div className="space-x-4">
              <button
                onClick={onClose}
                className="btn-glow bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="shimmer h-8 w-8 rounded-full" />
        </div>
      );
    }

    if (!movie) return null;

    if (isPlaying) {
      return (
        <VideoPlayer
          mediaId={movie.imdbId || movieId}
          onClose={() => setIsPlaying(false)}
        />
      );
    }

    // ... (rest of the render logic remains the same)
  };

  return createPortal(modalContent(), document.body);
}