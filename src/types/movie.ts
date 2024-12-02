export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  overview: string;
  releaseDate: string;
  voteAverage?: number;  // Make voteAverage optional since it might be undefined
  mediaType?: 'movie' | 'tv';
  imdbId?: string;
  uniqueId?: string;
}

export interface MovieDetails extends Movie {
  runtime?: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  cast: string[];
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
    }>;
  };
}

export interface MovieCategory {
  title: string;
  movies: Movie[];
}

export interface SearchResult extends Movie {
  mediaType: 'movie' | 'tv';
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}