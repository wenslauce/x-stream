import { useState, useEffect } from 'react';
import { Plugin, Package } from '../types/plugin';
import { pluginStore } from '../stores/pluginStore';

export function usePlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPlugins(pluginStore.getPlugins());
    setPackages(pluginStore.getPackages());
  };

  const installPlugin = (plugin: Omit<Plugin, 'installDate'>) => {
    pluginStore.addPlugin(plugin);
    refreshData();
  };

  const uninstallPlugin = (id: string) => {
    pluginStore.removePlugin(id);
    refreshData();
  };

  const togglePlugin = (id: string) => {
    pluginStore.togglePlugin(id);
    refreshData();
  };

  const updatePluginSettings = (id: string, settings: Record<string, any>) => {
    pluginStore.updatePlugin(id, { settings });
    refreshData();
  };

  const installPackage = (pkg: Omit<Package, 'installDate'>) => {
    pluginStore.addPackage(pkg);
    refreshData();
  };

  const uninstallPackage = (id: string) => {
    pluginStore.removePackage(id);
    refreshData();
  };

  const updatePackage = (id: string, updates: Partial<Package>) => {
    pluginStore.updatePackage(id, updates);
    refreshData();
  };

  return {
    plugins,
    packages,
    installPlugin,
    uninstallPlugin,
    togglePlugin,
    updatePluginSettings,
    installPackage,
    uninstallPackage,
    updatePackage,
  };
}