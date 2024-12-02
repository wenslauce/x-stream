import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Suspense, lazy } from 'react';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const SeriesPage = lazy(() => import('./pages/SeriesPage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SeriesDetailPage = lazy(() => import('./pages/SeriesDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
  </div>
);

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/movies',
    element: <MoviesPage />,
  },
  {
    path: '/series',
    element: <SeriesPage />,
  },
  {
    path: '/movie/:id',
    element: <MovieDetailPage />,
  },
  {
    path: '/series/:id',
    element: <SeriesDetailPage />,
  },
  {
    path: '/watchlist',
    element: <WatchlistPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/collections',
    element: <CollectionsPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WatchlistProvider>
          <Suspense fallback={<LoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </WatchlistProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;