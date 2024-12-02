export interface Plugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  installDate: string;
  settings?: Record<string, any>;
}

export interface Package {
  id: string;
  name: string;
  version: string;
  installDate: string;
  dependencies?: Record<string, string>;
}

export interface PluginStore {
  plugins: Plugin[];
  packages: Package[];
}