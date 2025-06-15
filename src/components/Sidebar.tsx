import React from 'react';
import { Settings, BarChart3, TrendingUp, Calendar, Eye, EyeOff } from 'lucide-react';
import { StatConfig, ViewConfig } from '../types/data';

interface SidebarProps {
  viewConfig: ViewConfig;
  onViewConfigChange: (config: ViewConfig) => void;
  statConfigs: StatConfig[];
  onStatConfigChange: (configs: StatConfig[]) => void;
  currentView: 'overview' | 'correlation';
  onViewChange: (view: 'overview' | 'correlation') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  viewConfig,
  onViewConfigChange,
  statConfigs,
  onStatConfigChange,
  currentView,
  onViewChange
}) => {
  const handleStatToggle = (statId: string) => {
    const updatedConfigs = statConfigs.map(config =>
      config.id === statId ? { ...config, enabled: !config.enabled } : config
    );
    onStatConfigChange(updatedConfigs);
    
    const selectedStats = { ...viewConfig.selectedStats };
    selectedStats[statId] = !selectedStats[statId];
    onViewConfigChange({ ...viewConfig, selectedStats });
  };

  const handleViewToggle = (key: keyof ViewConfig) => {
    if (typeof viewConfig[key] === 'boolean') {
      onViewConfigChange({ ...viewConfig, [key]: !viewConfig[key] });
    }
  };

  const getStatsByCategory = (category: string) => {
    return statConfigs.filter(config => config.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'numerical': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'categorical': return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'datetime': return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Analysis Controls</h2>
        </div>
        
        {/* View Selection */}
        <div className="space-y-2">
          <button
            onClick={() => onViewChange('overview')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              currentView === 'overview' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Overview & Statistics
          </button>
          <button
            onClick={() => onViewChange('correlation')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              currentView === 'correlation' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Correlation Analysis
          </button>
        </div>
      </div>

      {currentView === 'overview' && (
        <>
          {/* Display Options */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-3">Display Options</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewConfig.showOverview}
                  onChange={() => handleViewToggle('showOverview')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Overview Cards</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewConfig.showCharts}
                  onChange={() => handleViewToggle('showCharts')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Charts</span>
              </label>
            </div>
          </div>

          {/* Statistics Selection */}
          <div className="p-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Statistics to Display</h3>
            
            {['numerical', 'categorical', 'datetime', 'general'].map(category => {
              const categoryStats = getStatsByCategory(category);
              if (categoryStats.length === 0) return null;
              
              return (
                <div key={category} className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    {getCategoryIcon(category)}
                    <h4 className="text-sm font-medium text-gray-600 capitalize">
                      {category === 'datetime' ? 'Date/Time' : category} Statistics
                    </h4>
                  </div>
                  <div className="space-y-2 ml-6">
                    {categoryStats.map(config => (
                      <label key={config.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={() => handleStatToggle(config.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">{config.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};