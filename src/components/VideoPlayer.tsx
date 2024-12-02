import { X, AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getEmbedUrl, isValidImdbId } from '../services/videoSources';
import { storage } from '../services/storage';

interface VideoPlayerProps {
  mediaId: string;
  type?: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onClose: () => void;
}

export default function VideoPlayer({ 
  mediaId, 
  type = 'movie', 
  season, 
  episode,
  onClose 
}: VideoPlayerProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    try {
      if (!mediaId) {
        throw new Error('Invalid media ID');
      }

      // Load saved progress
      const savedProgress = storage.getProgress(mediaId);
      if (savedProgress) {
        setWatchTime(savedProgress.progress);
      }

      // Start tracking watch time
      intervalRef.current = window.setInterval(() => {
        setWatchTime(time => {
          const newTime = Math.min(time + 1, 100);
          // Save progress every minute
          if (newTime % 60 === 0) {
            storage.saveProgress(mediaId, newTime);
          }
          return newTime;
        });
      }, 1000);

      // Handle keyboard shortcuts
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !document.fullscreenElement) {
          onClose();
        }
      };

      // Handle fullscreen changes
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      window.addEventListener('keydown', handleKeyPress);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        // Save final progress
        storage.saveProgress(mediaId, watchTime);
      };
    } catch (error) {
      console.error('Error in video player:', error);
      setError(error instanceof Error ? error.message : 'Failed to load video player');
    }
  }, [mediaId, onClose, watchTime]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Get embed URL with error handling
  const embedUrl = (() => {
    try {
      return getEmbedUrl({ 
        type, 
        id: mediaId,
        season,
        episode
      });
    } catch (error) {
      console.error('Error getting embed URL:', error);
      return null;
    }
  })();

  if (error || !embedUrl) {
    return createPortal(
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="glass rounded-lg p-4 md:p-6 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Video</h3>
          <p className="text-gray-400 mb-4">
            {error || 'Failed to load video player. Please try again.'}
          </p>
          <button
            onClick={onClose}
            className="btn-glow bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col",
        isFullscreen && "bg-black"
      )}
      ref={playerContainerRef}
    >
      {/* Header */}
      {!isFullscreen && (
        <motion.div 
          className="flex items-center justify-between p-2 md:p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="h-1 w-24 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${watchTime}%` }}
              />
            </div>
            <span className="text-sm text-gray-400">
              {Math.floor(watchTime)}%
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close video player"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </motion.div>
      )}

      {/* Video Container */}
      <div className="flex-1 relative">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-red-500 border-t-transparent" />
          </div>
        )}
        <iframe
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    </motion.div>,
    document.body
  );
}