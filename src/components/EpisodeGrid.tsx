import { Play } from 'lucide-react';
import { cn } from '../lib/utils';

interface Episode {
  id: number;
  name: string;
  overview: string;
  stillPath: string | null;
  episodeNumber: number;
  airDate: string;
}

interface EpisodeGridProps {
  episodes: Episode[];
  selectedEpisode: number;
  onEpisodeSelect: (episodeNumber: number) => void;
}

export default function EpisodeGrid({ episodes, selectedEpisode, onEpisodeSelect }: EpisodeGridProps) {
  if (!episodes.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No episodes available for this season.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {episodes.map((episode) => (
        <button
          key={episode.id}
          onClick={() => onEpisodeSelect(episode.episodeNumber)}
          className={cn(
            "flex gap-4 p-4 rounded-lg transition-all duration-300",
            "text-left group hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500",
            selectedEpisode === episode.episodeNumber
              ? "bg-blue-600 text-white"
              : "bg-zinc-800/50 hover:bg-zinc-700/50"
          )}
        >
          <div className="relative w-32 aspect-video bg-zinc-700 rounded-md overflow-hidden">
            {episode.stillPath ? (
              <img
                src={episode.stillPath}
                alt={`Episode ${episode.episodeNumber}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-8 h-8 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-400">Episode {episode.episodeNumber}</div>
            <div className="font-medium truncate">{episode.name}</div>
            {episode.airDate && (
              <div className="text-sm text-gray-400 mt-1">
                {new Date(episode.airDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}