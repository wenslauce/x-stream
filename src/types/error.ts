export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: object
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string,
    public data?: object
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export interface ErrorState {
  message: string;
  code?: number | string;
  details?: object;
}