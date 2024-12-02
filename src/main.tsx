import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import EnvErrorMessage from './components/EnvErrorMessage.tsx'
import { getEnvVars } from './utils/env.ts'

// Validate environment variables
const { isValid, missing } = getEnvVars();

// Configure QueryClient with enhanced background fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Enable background fetching
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // Stale time configuration
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes

      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 404s
        if (error?.response?.status === 404) return false;
        // Retry up to 3 times on other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),

      // Background error handling
      onError: (error) => {
        console.error('Background query error:', error);
      },

      // Maintain data consistency
      keepPreviousData: true,

      // Reduce network load
      refetchInterval: false, // Don't automatically refetch at intervals
      networkMode: 'online', // Only fetch when online
    },
  },
})

// Background refetch on focus after 2 minutes of inactivity
let lastFocusTime = Date.now();
window.addEventListener('focus', () => {
  const timeSinceLastFocus = Date.now() - lastFocusTime;
  if (timeSinceLastFocus > 1000 * 60 * 2) { // 2 minutes
    queryClient.invalidateQueries();
  }
  lastFocusTime = Date.now();
});

// Handle offline/online transitions
window.addEventListener('online', () => {
  queryClient.resumePausedMutations();
  queryClient.invalidateQueries();
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Wrap the root creation in a try-catch
try {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        {!isValid ? (
          <EnvErrorMessage missingVars={missing} />
        ) : (
          <QueryClientProvider client={queryClient}>
            <App />
            {import.meta.env.DEV && (
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
                buttonPosition="bottom-right"
              />
            )}
          </QueryClientProvider>
        )}
      </ErrorBoundary>
    </StrictMode>,
  );
} catch (error) {
  console.error('Failed to render application:', error);
  // Show a basic error message in case of critical failure
  rootElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: white;
      text-align: center;
      padding: 20px;
      background: black;
    ">
      <h1 style="margin-bottom: 16px;">Something went wrong</h1>
      <p>Please try refreshing the page. If the problem persists, contact support.</p>
      <pre style="
        margin-top: 20px;
        padding: 16px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        max-width: 80%;
        overflow-x: auto;
        font-size: 14px;
        color: #ff4444;
      ">${error instanceof Error ? error.message : 'Unknown error occurred'}</pre>
    </div>
  `;
}