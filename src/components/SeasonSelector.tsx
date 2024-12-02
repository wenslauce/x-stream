import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface Season {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  seasonNumber: number;
  episodeCount: number;
  airDate: string;
}

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  onSeasonSelect: (seasonNumber: number) => void;
}

export default function SeasonSelector({ seasons, selectedSeason, onSeasonSelect }: SeasonSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
    
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const distance = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - distance;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute -left-4 top-1/2 -translate-y-1/2 z-10",
            "bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100",
            "transition-all duration-300 hover:bg-blue-600",
            "transform hover:scale-110"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Seasons Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {seasons.map((season) => (
          <div 
            key={season.id} 
            className="flex-none w-[200px]"
          >
            <button
              onClick={() => onSeasonSelect(season.seasonNumber)}
              className={cn(
                "w-full text-left transition-all duration-300",
                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500",
                selectedSeason === season.seasonNumber && "scale-105"
              )}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800">
                {season.posterPath ? (
                  <img
                    src={season.posterPath}
                    alt={season.name}
                    className={cn(
                      "w-full h-full object-cover",
                      selectedSeason === season.seasonNumber ? "brightness-100" : "brightness-75"
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                    <span className="text-gray-400">No Poster</span>
                  </div>
                )}
                <div className={cn(
                  "absolute inset-0 flex flex-col justify-end p-4",
                  "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                )}>
                  <h3 className="font-semibold text-white">{season.name}</h3>
                  <p className="text-sm text-gray-300">{season.episodeCount} Episodes</p>
                </div>
                {selectedSeason === season.seasonNumber && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg" />
                )}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-10",
            "bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100",
            "transition-all duration-300 hover:bg-blue-600",
            "transform hover:scale-110"
          )}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}