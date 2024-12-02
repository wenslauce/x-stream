import { Plugin, Package, PluginStore } from '../types/plugin';

const STORE_KEY = 'x-stream-plugins';

class PluginStoreManager {
  private store: PluginStore;

  constructor() {
    this.store = this.loadStore();
  }

  private loadStore(): PluginStore {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      return stored ? JSON.parse(stored) : { plugins: [], packages: [] };
    } catch (error) {
      console.error('Error loading plugin store:', error);
      return { plugins: [], packages: [] };
    }
  }

  private saveStore(): void {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.store));
    } catch (error) {
      console.error('Error saving plugin store:', error);
    }
  }

  // Plugin Management
  getPlugins(): Plugin[] {
    return this.store.plugins;
  }

  getPlugin(id: string): Plugin | undefined {
    return this.store.plugins.find(plugin => plugin.id === id);
  }

  addPlugin(plugin: Omit<Plugin, 'installDate'>): void {
    const newPlugin: Plugin = {
      ...plugin,
      installDate: new Date().toISOString()
    };

    this.store.plugins.push(newPlugin);
    this.saveStore();
  }

  updatePlugin(id: string, updates: Partial<Plugin>): void {
    const index = this.store.plugins.findIndex(plugin => plugin.id === id);
    if (index !== -1) {
      this.store.plugins[index] = {
        ...this.store.plugins[index],
        ...updates
      };
      this.saveStore();
    }
  }

  removePlugin(id: string): void {
    this.store.plugins = this.store.plugins.filter(plugin => plugin.id !== id);
    this.saveStore();
  }

  togglePlugin(id: string): void {
    const plugin = this.store.plugins.find(p => p.id === id);
    if (plugin) {
      plugin.enabled = !plugin.enabled;
      this.saveStore();
    }
  }

  // Package Management
  getPackages(): Package[] {
    return this.store.packages;
  }

  getPackage(id: string): Package | undefined {
    return this.store.packages.find(pkg => pkg.id === id);
  }

  addPackage(pkg: Omit<Package, 'installDate'>): void {
    const newPackage: Package = {
      ...pkg,
      installDate: new Date().toISOString()
    };

    this.store.packages.push(newPackage);
    this.saveStore();
  }

  updatePackage(id: string, updates: Partial<Package>): void {
    const index = this.store.packages.findIndex(pkg => pkg.id === id);
    if (index !== -1) {
      this.store.packages[index] = {
        ...this.store.packages[index],
        ...updates
      };
      this.saveStore();
    }
  }

  removePackage(id: string): void {
    this.store.packages = this.store.packages.filter(pkg => pkg.id !== id);
    this.saveStore();
  }

  // Utility Methods
  clearStore(): void {
    this.store = { plugins: [], packages: [] };
    this.saveStore();
  }

  exportStore(): string {
    return JSON.stringify(this.store, null, 2);
  }

  importStore(data: string): void {
    try {
      const parsed = JSON.parse(data);
      if (parsed.plugins && parsed.packages) {
        this.store = parsed;
        this.saveStore();
      }
    } catch (error) {
      console.error('Error importing plugin store:', error);
      throw new Error('Invalid store data format');
    }
  }
}

export const pluginStore = new PluginStoreManager();