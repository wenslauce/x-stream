import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Film, Award, Users, Library, History, Trophy, Calendar, Sparkles, Gift, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieGrid from '../components/MovieGrid';
import { 
  fetchAwardWinningMovies, 
  fetchFamilyMovies, 
  fetchCriticallyAcclaimedMovies,
  fetchClassicMovies
} from '../services/api';
import { Movie } from '../types/movie';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Collection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  fetchFn: (page?: number) => Promise<any>;
}

const COLLECTIONS: Collection[] = [
  {
    id: 'oscar-winners',
    title: 'Award Winners',
    description: 'Award-winning films that made history',
    icon: Trophy,
    fetchFn: fetchAwardWinningMovies
  },
  {
    id: 'family-favorites',
    title: 'Family Favorites',
    description: 'Perfect for movie night with the whole family',
    icon: Users,
    fetchFn: fetchFamilyMovies
  },
  {
    id: 'critically-acclaimed',
    title: 'Critically Acclaimed',
    description: 'The finest selections from critics worldwide',
    icon: Award,
    fetchFn: fetchCriticallyAcclaimedMovies
  },
  {
    id: 'classic-cinema',
    title: 'Classic Cinema',
    description: 'Timeless masterpieces from the golden age',
    icon: Library,
    fetchFn: fetchClassicMovies
  }
];

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const navigate = useNavigate();

  const { 
    data, 
    isLoading, 
    isError, 
    error,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useQuery({
    queryKey: ['collection', selectedCollection?.id],
    queryFn: ({ pageParam = 1 }) => 
      selectedCollection?.fetchFn(pageParam),
    enabled: !!selectedCollection,
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const allMovies = data?.pages.flatMap(page => page.results) ?? [];

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Failed to load collection'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Curated Collections
          </motion.h1>

          {/* Collections Grid */}
          {!selectedCollection && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {COLLECTIONS.map((collection, index) => {
                const Icon = collection.icon;
                return (
                  <motion.button
                    key={collection.id}
                    onClick={() => setSelectedCollection(collection)}
                    className={cn(
                      "relative group p-6 rounded-xl text-left transition-all duration-300",
                      "bg-zinc-900/50 hover:bg-zinc-800/50",
                      "border border-zinc-800 hover:border-zinc-700",
                      "backdrop-blur-sm"
                    )}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <Icon className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{collection.title}</h3>
                    <p className="text-gray-400 text-sm">{collection.description}</p>
                    
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-purple-400 text-sm">Explore →</span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Selected Collection View */}
          {selectedCollection && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCollection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => setSelectedCollection(null)}
                      className="text-purple-400 hover:text-purple-300 mb-4"
                    >
                      ← Back to Collections
                    </button>
                    <h2 className="text-3xl font-bold text-white">{selectedCollection.title}</h2>
                    <p className="text-gray-400 mt-2">{selectedCollection.description}</p>
                  </div>
                </div>

                <MovieGrid
                  movies={allMovies}
                  isLoading={isLoading || isFetchingNextPage}
                  hasMore={!!hasNextPage}
                  onLoadMore={() => fetchNextPage()}
                  onMovieClick={handleMovieClick}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}