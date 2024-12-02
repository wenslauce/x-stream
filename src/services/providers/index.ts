import { fetchProviderLogo } from '../brandfetch';
import { VidPlayProvider } from './vidplay';

// Provider Types
export type ProviderId = 
  | 'netflix' 
  | 'amazon' 
  | 'hulu' 
  | 'disney' 
  | 'apple' 
  | 'max' 
  | 'paramount' 
  | 'shudder'
  | 'vidsrc'
  | 'vidplay';

export interface Provider {
  id: ProviderId;
  name: string;
  baseUrl: string;
  apiKey?: string;
  apiBaseUrl?: string;
  logoUrl?: string;
}

// Provider Configuration
export const PROVIDERS: Record<ProviderId, Provider> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    baseUrl: 'https://www.netflix.com',
    apiBaseUrl: 'https://api-global.netflix.com/v1',
    apiKey: process.env.NETFLIX_API_KEY,
  },
  amazon: {
    id: 'amazon',
    name: 'Prime Video',
    baseUrl: 'https://www.primevideo.com',
    apiBaseUrl: 'https://api.primevideo.com/v1',
    apiKey: process.env.PRIME_VIDEO_API_KEY,
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    baseUrl: 'https://www.hulu.com',
    apiBaseUrl: 'https://api.hulu.com/v1',
    apiKey: process.env.HULU_API_KEY,
  },
  disney: {
    id: 'disney',
    name: 'Disney+',
    baseUrl: 'https://www.disneyplus.com',
    apiBaseUrl: 'https://api.disneyplus.com/v1',
    apiKey: process.env.DISNEY_API_KEY,
  },
  apple: {
    id: 'apple',
    name: 'Apple TV+',
    baseUrl: 'https://tv.apple.com',
    apiBaseUrl: 'https://api.apple-tv.com/v1',
    apiKey: process.env.APPLE_TV_API_KEY,
  },
  max: {
    id: 'max',
    name: 'Max',
    baseUrl: 'https://www.max.com',
    apiBaseUrl: 'https://api.max.com/v1',
    apiKey: process.env.MAX_API_KEY,
  },
  paramount: {
    id: 'paramount',
    name: 'Paramount+',
    baseUrl: 'https://www.paramountplus.com',
    apiBaseUrl: 'https://api.paramountplus.com/v1',
    apiKey: process.env.PARAMOUNT_API_KEY,
  },
  shudder: {
    id: 'shudder',
    name: 'Shudder',
    baseUrl: 'https://www.shudder.com',
    apiBaseUrl: 'https://api.shudder.com/v1',
    apiKey: process.env.SHUDDER_API_KEY,
  },
  vidsrc: {
    id: 'vidsrc',
    name: 'VidSrc',
    baseUrl: 'https://vidsrc.to',
    apiBaseUrl: 'https://vidsrc.to/api/v1',
  },
  vidplay: {
    id: 'vidplay',
    name: 'VidPlay',
    baseUrl: 'https://vidsrc.to',
    apiBaseUrl: 'https://vidsrc.to/vapi',
  }
};

// ... rest of the file remains the same ...