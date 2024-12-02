interface VidPlayApiResponse {
  success: boolean;
  data: {
    results: Array<{
      id: string;
      title: string;
      type: 'movie' | 'tv';
      imdb_id?: string;
      tmdb_id?: string;
      added_at: string;
      season?: number;
      episode?: number;
    }>;
    page: number;
    total_pages: number;
  };
}

export class VidPlayProvider {
  private static readonly BASE_URL = 'https://vidsrc.to';
  private static readonly EMBED_URL = `${VidPlayProvider.BASE_URL}/embed`;
  private static readonly API_URL = `${VidPlayProvider.BASE_URL}/vapi`;

  static buildMovieEmbedUrl(id: string): string {
    // Handle both IMDB and TMDB IDs
    const formattedId = this.formatId(id);
    return `${this.EMBED_URL}/movie/${formattedId}`;
  }

  static buildTVEmbedUrl(id: string, season?: number, episode?: number): string {
    // Handle both IMDB and TMDB IDs
    const formattedId = this.formatId(id);
    const baseUrl = `${this.EMBED_URL}/tv/${formattedId}`;

    if (season && episode) {
      return `${baseUrl}/${season}/${episode}`;
    }
    if (season) {
      return `${baseUrl}/${season}`;
    }
    return baseUrl;
  }

  // API Endpoints for movies
  static async getNewMovies(page: number = 1): Promise<VidPlayApiResponse> {
    return this.makeApiRequest(`movie/new/${page}`);
  }

  static async getRecentlyAddedMovies(page: number = 1): Promise<VidPlayApiResponse> {
    return this.makeApiRequest(`movie/add/${page}`);
  }

  // API Endpoints for TV shows
  static async getNewTVShows(page: number = 1): Promise<VidPlayApiResponse> {
    return this.makeApiRequest(`tv/new/${page}`);
  }

  static async getRecentlyAddedTVShows(page: number = 1): Promise<VidPlayApiResponse> {
    return this.makeApiRequest(`tv/add/${page}`);
  }

  static async getLatestEpisodes(page: number = 1): Promise<VidPlayApiResponse> {
    return this.makeApiRequest(`episode/latest/${page}`);
  }

  private static async makeApiRequest(endpoint: string): Promise<VidPlayApiResponse> {
    try {
      const response = await fetch(`${this.API_URL}/${endpoint}`);

      if (!response.ok) {
        throw new Error(`VidPlay API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('VidPlay API request failed:', error);
      throw error;
    }
  }

  static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'vidsrc.to';
    } catch {
      return false;
    }
  }

  static extractMediaInfo(url: string): {
    type: 'movie' | 'tv';
    id: string;
    season?: number;
    episode?: number;
  } | null {
    if (!this.isValidUrl(url)) return null;

    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);

      if (pathParts.length < 3) return null;

      const [, type, id, ...rest] = pathParts;

      if (type === 'movie') {
        return { type: 'movie', id };
      }

      if (type === 'tv') {
        const [season, episode] = rest.map(Number);
        return {
          type: 'tv',
          id,
          ...(season && { season }),
          ...(episode && { episode })
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  static formatId(id: string | number): string {
    const strId = id.toString();
    // If it's a TMDB ID (numeric only), return as is
    if (/^\d+$/.test(strId)) return strId;
    // If it's an IMDB ID without prefix, add it
    if (!strId.startsWith('tt')) return `tt${strId}`;
    // Return as is if it's already a properly formatted IMDB ID
    return strId;
  }
}