import { VidPlayProvider } from './providers/vidplay';

interface VideoSourceOptions {
  type: 'movie' | 'tv';
  id: string;
  season?: number;
  episode?: number;
}

// Base URLs for providers
const PROVIDERS = {
  VIDSRC: 'https://vidsrc.to/embed',
  VIDPLAY: 'https://vidsrc.to/embed'
} as const;

export const getEmbedUrl = (options: VideoSourceOptions): string => {
  const { type, id, season, episode } = options;
  
  try {
    // Default to VidPlay provider
    return type === 'movie'
      ? VidPlayProvider.buildMovieEmbedUrl(id)
      : VidPlayProvider.buildTVEmbedUrl(id, season, episode);
  } catch (error) {
    console.error('Error building embed URL:', error);
    // Fallback to basic VIDSRC if VidPlay fails
    const baseUrl = PROVIDERS.VIDSRC;
    const formattedId = formatImdbId(id);
    
    if (type === 'movie') {
      return `${baseUrl}/movie/${formattedId}`;
    }
    
    let url = `${baseUrl}/tv/${formattedId}`;
    if (season) url += `/${season}`;
    if (episode) url += `/${episode}`;
    return url;
  }
};

export const isValidImdbId = (id: string): boolean => {
  if (!id) return false;
  // Handle both cases: with 'tt' prefix and without
  const idNumber = id.startsWith('tt') ? id.slice(2) : id;
  return /^\d{7,8}$/.test(idNumber);
};

export const formatImdbId = (id: string): string => {
  if (!id) throw new Error('Invalid IMDB ID');
  
  // If it's already properly formatted, return as is
  if (/^tt\d{7,8}$/.test(id)) return id;
  
  // If it's just numbers, add the tt prefix
  if (/^\d{7,8}$/.test(id)) return `tt${id}`;
  
  throw new Error('Invalid IMDB ID format');
};

// Helper function to validate video URLs
export const isValidVideoUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return Object.values(PROVIDERS).some(domain => 
      urlObj.origin.includes(new URL(domain).hostname)
    );
  } catch {
    return false;
  }
};

// Default video provider configuration
export const VIDEO_PROVIDERS = [
  { 
    id: 'vidplay', 
    name: 'VidPlay',
    isDefault: true,
    isSupported: true
  }
] as const;