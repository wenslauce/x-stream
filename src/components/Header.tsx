import { Search, Bookmark, Film, Tv, Menu, X, Library } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
import Logo from './Logo';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSearchClick = () => {
    if (location.pathname !== '/search') {
      navigate('/search');
    }
  };

  const navItems = [
    { to: "/movies", icon: Film, label: "Movies" },
    { to: "/series", icon: Tv, label: "TV Shows" },
    { 
      to: "/collections", 
      icon: Library, 
      label: "Collections" 
    },
    { 
      to: "/watchlist", 
      icon: Bookmark, 
      label: "Watchlist",
      badge: watchlist.length > 0 ? watchlist.length : undefined
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-black/0 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Responsive size */}
            <Logo className="scale-75 sm:scale-90 md:scale-100" />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              {navItems.map(({ to, icon: Icon, label, badge }) => (
                <Link 
                  key={to}
                  to={to} 
                  className={cn(
                    "relative group text-fluid-sm flex items-center gap-2 px-4 py-3 rounded-lg",
                    "transition-all duration-300 hover:scale-105 touch-manipulation",
                    location.pathname === to 
                      ? 'text-white bg-white/10 shadow-lg shadow-white/5' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{label}</span>
                  {badge && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white 
                                   text-xs px-2 py-0.5 rounded-full min-w-[20px] 
                                   text-center">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Search Button */}
              <button
                onClick={handleSearchClick}
                className={cn(
                  "btn-secondary hidden md:flex",
                  "touch-manipulation"
                )}
              >
                <Search className="w-5 h-5" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-4 touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm md:hidden pt-20"
          >
            <nav className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <button
                onClick={() => {
                  handleSearchClick();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                         bg-zinc-800/50 text-white hover:bg-zinc-700/50
                         transition-colors"
              >
                <Search className="w-5 h-5" />
                Search
              </button>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map(({ to, icon: Icon, label, badge }) => (
                  <Link 
                    key={to}
                    to={to} 
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "relative w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                      "transition-all duration-300",
                      location.pathname === to 
                        ? 'text-white bg-white/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                    {badge && (
                      <span className="absolute right-4 bg-red-600 text-white 
                                     text-xs px-2 py-0.5 rounded-full min-w-[20px] 
                                     text-center">
                        {badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}