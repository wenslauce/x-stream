// Constants
const VIDSRC_BASE_URL = 'https://vidsrc.xyz/embed';
const VIDSRC_PRO_URL = 'https://vidsrc.to/embed';
const VIDSRC_API_URL = 'https://vidsrc.to/api/v1';

// Types
type ContentType = 'movie' | 'tv';

interface VidSrcProvider {
  id: string;
  name: string;
  quality: string;
  url: string;
}

interface VidSrcResponse {
  success: boolean;
  data: {
    available: boolean;
    providers: VidSrcProvider[];
    imdbId: string;
    type: ContentType;
    title?: string;
  };
}

interface VidSrcError {
  success: false;
  error: string;
  code: number;
}

// API endpoint builders for embed URLs
export const buildMovieEmbedUrl = (id: string, usePro: boolean = true): string => {
  const formattedId = formatImdbId(id);
  const baseUrl = usePro ? VIDSRC_PRO_URL : VIDSRC_BASE_URL;
  return `${baseUrl}/movie/${formattedId}`;
};

export const buildTVEmbedUrl = (
  id: string,
  season?: number,
  episode?: number,
  usePro: boolean = true
): string => {
  const formattedId = formatImdbId(id);
  const baseUrl = usePro ? VIDSRC_PRO_URL : VIDSRC_BASE_URL;
  const path = `tv/${formattedId}`;

  if (season && episode) {
    return `${baseUrl}/${path}/${season}/${episode}`;
  } else if (season) {
    return `${baseUrl}/${path}/${season}`;
  }
  return `${baseUrl}/${path}`;
};

// API functions
export async function checkAvailability(imdbId: string): Promise<VidSrcResponse> {
  const formattedId = formatImdbId(imdbId);
  
  try {
    const response = await fetch(`${VIDSRC_API_URL}/check/${formattedId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to check availability');
    }
    
    return data;
  } catch (error) {
    throw new Error(`VidSrc API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getProviders(imdbId: string): Promise<VidSrcProvider[]> {
  const formattedId = formatImdbId(imdbId);
  
  try {
    const response = await fetch(`${VIDSRC_API_URL}/providers/${formattedId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get providers');
    }
    
    return data.data.providers;
  } catch (error) {
    throw new Error(`VidSrc API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to validate IMDB ID
export const validateImdbId = (id: string): boolean => {
  if (!id) return false;
  // Handle both cases: with 'tt' prefix and without
  const idNumber = id.startsWith('tt') ? id.slice(2) : id;
  return /^\d{7,8}$/.test(idNumber);
};

// Helper function to format IMDB ID
export const formatImdbId = (id: string): string => {
  if (!id) throw new Error('Invalid IMDB ID');
  
  // If it's already properly formatted, return as is
  if (/^tt\d{7,8}$/.test(id)) return id;
  
  // If it's just numbers, add the tt prefix
  if (/^\d{7,8}$/.test(id)) return `tt${id}`;
  
  throw new Error('Invalid IMDB ID format');
};

// Helper function to build embed options
export const buildEmbedOptions = (options: {
  provider?: string;
  subtitles?: boolean;
  season?: number;
  episode?: number;
}) => {
  const params = new URLSearchParams();
  
  if (options.provider) {
    params.append('provider', options.provider);
  }
  
  if (options.subtitles !== undefined) {
    params.append('subtitles', options.subtitles.toString());
  }
  
  return params.toString();
};

// Function to check if a URL is a valid VidSrc URL
export const isValidVidSrcUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'vidsrc.to' ||
      urlObj.hostname === 'vidsrc.xyz' ||
      urlObj.hostname === 'vidsrc.me'
    );
  } catch {
    return false;
  }
};

// Helper function to get video quality label
export const getQualityLabel = (quality: string): string => {
  const qualityMap: Record<string, string> = {
    '2160': '4K',
    '1080': '1080p',
    '720': '720p',
    '480': '480p',
    '360': '360p',
  };
  return qualityMap[quality] || quality;
};