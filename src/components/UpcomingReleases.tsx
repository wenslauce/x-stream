import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';

interface UpcomingReleasesProps {
  items: Movie[];
  onItemClick: (movie: Movie) => void;
}

export default function UpcomingReleases({ items, onItemClick }: UpcomingReleasesProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-zinc-900/50 to-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">Coming Soon</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => onItemClick(item)}
            >
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={item.backdropPath || item.posterPath}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                
                {/* Release Date Badge */}
                <div className="absolute top-4 right-4">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full",
                    "bg-red-600 text-white text-sm font-medium"
                  )}>
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(item.releaseDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                    {item.overview}
                  </p>
                  
                  {/* Countdown Timer */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {getCountdown(item.releaseDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getCountdown(releaseDate: string): string {
  const now = new Date();
  const release = new Date(releaseDate);
  const diffTime = Math.abs(release.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Releases tomorrow';
  if (diffDays < 7) return `Releases in ${diffDays} days`;
  if (diffDays < 30) return `Releases in ${Math.ceil(diffDays / 7)} weeks`;
  return `Releases in ${Math.ceil(diffDays / 30)} months`;
}