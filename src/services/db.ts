import { MovieDetails, Movie } from '../types/movie';
import { DatabaseError } from '../types/error';

const DB_NAME = 'movieDB';
const DB_VERSION = 1;
const MOVIES_STORE = 'movies';

export class MovieDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          reject(new DatabaseError(
            'Failed to open database',
            'init',
            { error: request.error }
          ));
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(MOVIES_STORE)) {
            const movieStore = db.createObjectStore(MOVIES_STORE, { keyPath: 'id' });
            movieStore.createIndex('title', 'title', { unique: false });
            movieStore.createIndex('releaseDate', 'releaseDate', { unique: false });
          }
        };
      });
    } catch (error) {
      throw new DatabaseError(
        'Database initialization failed',
        'init',
        { originalError: error }
      );
    }
  }

  async addMovie(movie: MovieDetails | Movie): Promise<void> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([MOVIES_STORE], 'readwrite');
        const store = transaction.objectStore(MOVIES_STORE);
        const request = store.put(movie);

        request.onerror = () => {
          reject(new DatabaseError(
            'Failed to add movie',
            'addMovie',
            { movieId: movie.id, error: request.error }
          ));
        };

        request.onsuccess = () => resolve();
      });
    } catch (error) {
      throw new DatabaseError(
        'Add movie operation failed',
        'addMovie',
        { movieId: movie.id, originalError: error }
      );
    }
  }

  async getMovie(id: string | number): Promise<MovieDetails | Movie | undefined> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([MOVIES_STORE], 'readonly');
        const store = transaction.objectStore(MOVIES_STORE);
        const request = store.get(id);

        request.onerror = () => {
          reject(new DatabaseError(
            'Failed to get movie',
            'getMovie',
            { movieId: id, error: request.error }
          ));
        };

        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      throw new DatabaseError(
        'Get movie operation failed',
        'getMovie',
        { movieId: id, originalError: error }
      );
    }
  }

  async getAllMovies(): Promise<(MovieDetails | Movie)[]> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([MOVIES_STORE], 'readonly');
        const store = transaction.objectStore(MOVIES_STORE);
        const request = store.getAll();

        request.onerror = () => {
          reject(new DatabaseError(
            'Failed to get all movies',
            'getAllMovies',
            { error: request.error }
          ));
        };

        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      throw new DatabaseError(
        'Get all movies operation failed',
        'getAllMovies',
        { originalError: error }
      );
    }
  }
}

// Singleton instance
export const movieDB = new MovieDatabase();