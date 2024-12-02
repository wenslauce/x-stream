export interface EnvVars {
  TMDB_API_KEY: string;
  TMDB_ACCESS_TOKEN: string;
}

export function getEnvVars(): { 
  vars: Partial<EnvVars>; 
  missing: string[]; 
  isValid: boolean 
} {
  const vars: Partial<EnvVars> = {
    TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY,
    TMDB_ACCESS_TOKEN: import.meta.env.VITE_TMDB_ACCESS_TOKEN,
  };

  const missing = Object.entries(vars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return {
    vars,
    missing,
    isValid: missing.length === 0
  };
}