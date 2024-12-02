interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface ProvidersResponse {
  results: Provider[];
}

// Map of TMDB provider IDs to domains
export const PROVIDER_DOMAINS = {
  NETFLIX: 'netflix.com',
  APPLE_TV: 'tv.apple.com',
  PRIME_VIDEO: 'primevideo.com',
  HULU: 'hulu.com',
  MAX: 'max.com',
  PARAMOUNT_PLUS: 'paramountplus.com',
  DISNEY_PLUS: 'disneyplus.com',
  SHUDDER: 'shudder.com',
} as const;

// Cache implementation
const CACHE_KEY_PREFIX = 'provider_logo_';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedLogo {
  url: string;
  timestamp: number;
}

const getCachedLogo = (providerId: string): string | null => {
  const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${providerId}`);
  if (!cached) return null;

  const { url, timestamp }: CachedLogo = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${providerId}`);
    return null;
  }

  return url;
};

const cacheLogo = (providerId: string, url: string) => {
  const cacheData: CachedLogo = {
    url,
    timestamp: Date.now(),
  };
  localStorage.setItem(`${CACHE_KEY_PREFIX}${providerId}`, JSON.stringify(cacheData));
};

export const fetchProviderLogo = async (domain: string): Promise<string> => {
  try {
    const providerId = Object.entries(PROVIDER_DOMAINS)
      .find(([_, d]) => d === domain)?.[0];
      
    if (!providerId) throw new Error('Invalid provider domain');

    // Check cache first
    const cached = getCachedLogo(providerId);
    if (cached) return cached;

    // Use axios instance from api.ts
    const response = await fetch(
      'https://api.themoviedb.org/3/watch/providers/movie', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.statusText}`);
    }

    const data: ProvidersResponse = await response.json();
    
    const provider = data.results.find(p => {
      const name = p.provider_name.toLowerCase();
      const searchName = providerId.toLowerCase().replace('_', ' ');
      return name.includes(searchName);
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    const logoUrl = `https://image.tmdb.org/t/p/original${provider.logo_path}`;

    // Cache the result
    cacheLogo(providerId, logoUrl);

    return logoUrl;
  } catch (error) {
    console.error('Error fetching provider logo:', error);
    return `/src/assets/logos/${providerId.toLowerCase()}.svg`;
  }
};