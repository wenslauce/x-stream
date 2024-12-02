import { useState } from 'react';
import { Download, Trash2, Settings, Power } from 'lucide-react';
import { usePlugins } from '../hooks/usePlugins';
import { cn } from '../lib/utils';
import { Plugin, Package } from '../types/plugin';

export default function PluginManager() {
  const {
    plugins,
    packages,
    installPlugin,
    uninstallPlugin,
    togglePlugin,
    updatePluginSettings,
    installPackage,
    uninstallPackage,
  } = usePlugins();

  const [activeTab, setActiveTab] = useState<'plugins' | 'packages'>('plugins');

  const handleInstallPlugin = (pluginData: Omit<Plugin, 'installDate'>) => {
    installPlugin(pluginData);
  };

  const handleInstallPackage = (packageData: Omit<Package, 'installDate'>) => {
    installPackage(packageData);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('plugins')}
          className={cn(
            "px-4 py-2 -mb-px",
            activeTab === 'plugins'
              ? "border-b-2 border-red-500 text-white"
              : "text-gray-400 hover:text-white"
          )}
        >
          Plugins
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={cn(
            "px-4 py-2 -mb-px",
            activeTab === 'packages'
              ? "border-b-2 border-red-500 text-white"
              : "text-gray-400 hover:text-white"
          )}
        >
          Packages
        </button>
      </div>

      {/* Content */}
      {activeTab === 'plugins' ? (
        <div className="space-y-4">
          {/* Plugin List */}
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="relative group bg-zinc-900/50 rounded-lg p-4 hover:bg-zinc-900/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{plugin.name}</h3>
                  <p className="text-sm text-gray-400">Version: {plugin.version}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlugin(plugin.id)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      plugin.enabled
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                    )}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => uninstallPlugin(plugin.id)}
                    className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Install New Plugin Button */}
          <button
            onClick={() => {
              const pluginData = {
                id: `plugin-${Date.now()}`,
                name: 'New Plugin',
                version: '1.0.0',
                enabled: true,
              };
              handleInstallPlugin(pluginData);
            }}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Install New Plugin
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Package List */}
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative group bg-zinc-900/50 rounded-lg p-4 hover:bg-zinc-900/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{pkg.name}</h3>
                  <p className="text-sm text-gray-400">Version: {pkg.version}</p>
                </div>
                <button
                  onClick={() => uninstallPackage(pkg.id)}
                  className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Install New Package Button */}
          <button
            onClick={() => {
              const packageData = {
                id: `package-${Date.now()}`,
                name: 'New Package',
                version: '1.0.0',
              };
              handleInstallPackage(packageData);
            }}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Install New Package
          </button>
        </div>
      )}
    </div>
  );
}