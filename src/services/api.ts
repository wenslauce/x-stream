import { Movie, ApiResponse } from '../types/movie';
import { storage } from './storage';

// Base URLs and options for TMDB API
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
};

// Genre constants
export const MOVIE_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;

export const TV_GENRES = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  NEWS: 10763,
  REALITY: 10764,
  SCIENCE_FICTION_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37,
} as const;

// Utility function for delayed retry
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced fetch with retries and caching
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '1');
        await delay(retryAfter * 1000);
        return fetchWithRetry(url, options, retries);
      }

      // Handle other errors
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Transform API data to match our Movie type
const transformMovieData = (data: any): Movie => ({
  id: data.id,
  title: data.title || data.name,
  posterPath: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : null,
  backdropPath: data.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${data.backdrop_path}` : null,
  overview: data.overview,
  releaseDate: data.release_date || data.first_air_date,
  voteAverage: data.vote_average,
  mediaType: data.media_type || (data.first_air_date ? 'tv' : 'movie'),
  imdbId: data.imdb_id,
});

// Enhanced API fetch with caching
async function fetchFromApiWithCache<T>(
  endpoint: string,
  cacheKey: string,
  transform: (data: any) => T,
  cacheDuration: number = 5 * 60 * 1000 // 5 minutes default
): Promise<T> {
  // Try to get from cache first
  const cached = storage.getCacheItem<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const response = await fetchWithRetry(
    `${TMDB_BASE_URL}/${endpoint}`,
    fetchOptions
  );
  const data = await response.json();
  
  // Transform the data
  const transformed = transform(data);
  
  // Cache the result
  storage.setCacheItem(cacheKey, transformed);
  
  return transformed;
}

// Fetch top rated movies
export async function fetchTopRated(page: number = 1): Promise<ApiResponse<Movie>> {
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `movie/top_rated?page=${page}`,
    `top-rated-${page}`,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Fetch TV series with various filters
export async function fetchSeries(
  type: 'popular' | 'top_rated' | 'on_the_air' | 'genre',
  genreId?: string,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  const endpoint = type === 'genre'
    ? `discover/tv?with_genres=${genreId}&page=${page}`
    : `tv/${type}?page=${page}`;

  const cacheKey = `series-${type}-${genreId || ''}-${page}`;
  
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    endpoint,
    cacheKey,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Fetch movies with various filters
export async function fetchMovies(
  type: 'popular' | 'top_rated' | 'upcoming' | 'genre',
  genreId?: string,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  const endpoint = type === 'genre'
    ? `discover/movie?with_genres=${genreId}&page=${page}`
    : `movie/${type}?page=${page}`;

  const cacheKey = `movies-${type}-${genreId || ''}-${page}`;

  return fetchFromApiWithCache<ApiResponse<Movie>>(
    endpoint,
    cacheKey,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Fetch trending content
export async function fetchTrending(
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1
): Promise<ApiResponse<Movie>> {
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `trending/all/${timeWindow}?page=${page}`,
    `trending-${timeWindow}-${page}`,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Fetch upcoming movies
export async function fetchUpcoming(page: number = 1): Promise<ApiResponse<Movie>> {
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `movie/upcoming?page=${page}`,
    `upcoming-${page}`,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Search movies and TV shows
export async function searchAll(query: string, page: number = 1): Promise<ApiResponse<Movie>> {
  if (!query) throw new Error('Search query is required');

  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `search/multi?query=${encodeURIComponent(query)}&page=${page}`,
    `search-${query}-${page}`,
    (data) => ({
      page: data.page,
      results: data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    }),
    1000 * 60 * 30 // Cache search results for 30 minutes
  );
}

// Get movie details
export async function getMovieDetails(id: string): Promise<Movie> {
  return fetchFromApiWithCache<Movie>(
    `movie/${id}?append_to_response=credits,videos`,
    `movie-details-${id}`,
    (data) => ({
      ...transformMovieData(data),
      runtime: data.runtime,
      genres: data.genres,
      cast: data.credits?.cast?.map((actor: any) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` : null,
      })),
      videos: data.videos,
    })
  );
}

// Get movie details by IMDB ID
export async function getMovieDetailsByImdbId(imdbId: string): Promise<Movie> {
  return fetchFromApiWithCache<Movie>(
    `find/${imdbId}?external_source=imdb_id`,
    `movie-imdb-${imdbId}`,
    (data) => {
      const movie = data.movie_results[0] || data.tv_results[0];
      if (!movie) throw new Error('Movie not found');
      return transformMovieData(movie);
    }
  );
}

// Get related movies
export async function getRelatedMovies(id: string): Promise<Movie[]> {
  return fetchFromApiWithCache<Movie[]>(
    `movie/${id}/recommendations`,
    `movie-related-${id}`,
    (data) => data.results.map(transformMovieData)
  );
}

// Get series details
export async function getSeriesDetails(id: string): Promise<Movie> {
  return fetchFromApiWithCache<Movie>(
    `tv/${id}?append_to_response=credits,videos`,
    `series-details-${id}`,
    (data) => ({
      ...transformMovieData(data),
      numberOfSeasons: data.number_of_seasons,
      genres: data.genres,
      cast: data.credits?.cast?.map((actor: any) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` : null,
      })),
      videos: data.videos,
    })
  );
}

// Get season details
export async function getSeasonDetails(seriesId: string, seasonNumber: number): Promise<any> {
  return fetchFromApiWithCache<any>(
    `tv/${seriesId}/season/${seasonNumber}`,
    `season-details-${seriesId}-${seasonNumber}`,
    (data) => ({
      ...data,
      episodes: data.episodes?.map((episode: any) => ({
        id: episode.id,
        name: episode.name,
        overview: episode.overview,
        stillPath: episode.still_path ? `${TMDB_IMAGE_BASE_URL}${episode.still_path}` : null,
        episodeNumber: episode.episode_number,
        airDate: episode.air_date,
      })),
    })
  );
}

// Get related series
export async function getRelatedSeries(id: string): Promise<Movie[]> {
  return fetchFromApiWithCache<Movie[]>(
    `tv/${id}/recommendations`,
    `series-related-${id}`,
    (data) => data.results.map(transformMovieData)
  );
}

// Fetch award-winning movies
export async function fetchAwardWinningMovies(page: number = 1): Promise<ApiResponse<Movie>> {
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `discover/movie?sort_by=vote_average.desc&vote_count.gte=1000&page=${page}`,
    `award-winning-${page}`,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Fetch family movies
export async function fetchFamilyMovies(page: number = 1): Promise<ApiResponse<Movie>> {
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `discover/movie?with_genres=${MOVIE_GENRES.FAMILY}&page=${page}`,
    `family-movies-${page}`,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Fetch critically acclaimed movies
export async function fetchCriticallyAcclaimedMovies(page: number = 1): Promise<ApiResponse<Movie>> {
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `discover/movie?sort_by=vote_average.desc&vote_count.gte=5000&page=${page}`,
    `critically-acclaimed-${page}`,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}

// Fetch classic movies (released before 1980)
export async function fetchClassicMovies(page: number = 1): Promise<ApiResponse<Movie>> {
  const endDate = '1980-12-31';
  return fetchFromApiWithCache<ApiResponse<Movie>>(
    `discover/movie?sort_by=popularity.desc&release_date.lte=${endDate}&page=${page}`,
    `classic-movies-${page}`,
    (data) => ({
      page: data.page,
      results: data.results.map(transformMovieData),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  );
}