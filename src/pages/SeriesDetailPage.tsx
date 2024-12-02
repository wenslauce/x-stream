import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Star, Calendar, Bookmark, BookmarkCheck, AlertTriangle, Tv, Clock } from 'lucide-react';
import { getSeriesDetails, getRelatedSeries, getSeasonDetails } from '../services/api';
import Header from '../components/Header';
import RelatedContent from '../components/RelatedContent';
import Synopsis from '../components/Synopsis';
import CastRow from '../components/CastRow';
import ReviewSection from '../components/ReviewSection';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeGrid from '../components/EpisodeGrid';
import SeasonSelector from '../components/SeasonSelector';
import { useWatchlist } from '../contexts/WatchlistContext';
import { cn } from '../lib/utils';
import { ApiError } from '../types/error';
import Footer from '../components/Footer';

const SERVERS = [
  { id: 'upcloud', name: 'UpCloud', status: 'online' },
  { id: 'vidcloud', name: 'VidCloud', status: 'online' },
  { id: 'doodstream', name: 'DoodStream', status: 'offline' },
];

export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState('upcloud');
  const [isPlaying, setIsPlaying] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  // Query series details
  const { data: series, isLoading: isLoadingSeries, isError, error } = useQuery({
    queryKey: ['series', id],
    queryFn: () => getSeriesDetails(id!),
    enabled: !!id,
  });

  // Query season details
  const { data: seasonData, isLoading: isLoadingSeasons } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => getSeasonDetails(id!, selectedSeason),
    enabled: !!id && !!selectedSeason,
  });

  // Query related series
  const { data: relatedSeries } = useQuery({
    queryKey: ['related-series', id],
    queryFn: () => getRelatedSeries(id!),
    enabled: !!id,
  });

  const handlePlayClick = () => setIsPlaying(true);

  const toggleWatchlist = () => {
    if (!series) return;
    if (isInWatchlist(series.id.toString())) {
      removeFromWatchlist(series.id.toString());
    } else {
      addToWatchlist(series);
    }
  };

  const handleEpisodeSelect = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setIsPlaying(true);
  };

  const handleSeasonSelect = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1); // Reset episode selection when changing seasons
  };

  // Error handling
  if (isError) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Failed to load series</h2>
            <p className="text-gray-400 mb-4">
              {error instanceof ApiError ? error.message : 'An error occurred while loading the series.'}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingSeries || !series) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  const isInList = isInWatchlist(series.id.toString());

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] mb-8">
          {/* Background Image with Gradients */}
          <div className="absolute inset-0">
            <img
              src={series.backdropPath || series.posterPath}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl space-y-6">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {series.title}
                </h1>

                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Rating Badge */}
                  {series.voteAverage && (
                    <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{series.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {/* Release Year Badge */}
                  {series.releaseDate && (
                    <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(series.releaseDate).getFullYear()}</span>
                    </div>
                  )}

                  {/* Episode Length Badge */}
                  {series.runtime && (
                    <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                      <Clock className="w-4 h-4" />
                      <span>~{series.runtime} min</span>
                    </div>
                  )}

                  {/* Season Count Badge */}
                  {series.numberOfSeasons && (
                    <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white">
                      <Tv className="w-4 h-4" />
                      <span>
                        {series.numberOfSeasons} Season{series.numberOfSeasons !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Overview */}
                {series.overview && (
                  <p className="text-lg text-gray-200 line-clamp-3 glass p-4 rounded-lg backdrop-blur-sm">
                    {series.overview}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handlePlayClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                             text-white rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    <span>Watch Now</span>
                  </button>

                  <button
                    onClick={toggleWatchlist}
                    className={cn(
                      "inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors",
                      isInList
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {isInList ? (
                      <>
                        <BookmarkCheck className="w-5 h-5" />
                        <span>In Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        <span>Add to Watchlist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the content remains unchanged */}
        {/* ... */}
      </main>

      {/* Video Player Modal */}
      {isPlaying && (
        <VideoPlayer
          mediaId={series.imdbId || series.id.toString()}
          type="tv"
          season={selectedSeason}
          episode={selectedEpisode}
          onClose={() => setIsPlaying(false)}
        />
      )}

      <Footer />
    </div>
  );
}