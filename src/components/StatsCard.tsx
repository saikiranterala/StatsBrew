import React from 'react';
import { BarChart3, Pi as Pie, Calendar, TrendingUp } from 'lucide-react';
import { NumericalStats, CategoricalStats, DateTimeStats } from '../types/data';

interface StatsCardProps {
  columnName: string;
  dataType: 'numerical' | 'categorical' | 'datetime';
  stats: NumericalStats | CategoricalStats | DateTimeStats;
  enabledStats: { [key: string]: boolean };
}

export const StatsCard: React.FC<StatsCardProps> = ({ columnName, dataType, stats, enabledStats }) => {
  const getIcon = () => {
    switch (dataType) {
      case 'numerical': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'categorical': return <Pie className="h-5 w-5 text-green-600" />;
      case 'datetime': return <Calendar className="h-5 w-5 text-purple-600" />;
    }
  };

  const getTypeColor = () => {
    switch (dataType) {
      case 'numerical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'categorical': return 'bg-green-100 text-green-800 border-green-200';
      case 'datetime': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const renderNumericalStats = (stats: NumericalStats) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        {enabledStats['mean'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Mean:</span>
            <span className="font-medium">{stats.mean.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['median'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Median:</span>
            <span className="font-medium">{stats.median.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['mode'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Mode:</span>
            <span className="font-medium">{stats.mode.slice(0, 3).join(', ')}</span>
          </div>
        )}
        {enabledStats['min'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Min:</span>
            <span className="font-medium">{stats.min.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['max'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Max:</span>
            <span className="font-medium">{stats.max.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['variance'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Variance:</span>
            <span className="font-medium">{stats.variance.toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {enabledStats['q1'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Q1:</span>
            <span className="font-medium">{stats.q1.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['q3'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Q3:</span>
            <span className="font-medium">{stats.q3.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['range'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Range:</span>
            <span className="font-medium">{stats.range.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['stdDev'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Std Dev:</span>
            <span className="font-medium">{stats.stdDev.toFixed(2)}</span>
          </div>
        )}
        {enabledStats['count'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Count:</span>
            <span className="font-medium">{stats.count}</span>
          </div>
        )}
        {enabledStats['skewness'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Skewness:</span>
            <span className="font-medium">{stats.skewness.toFixed(3)}</span>
          </div>
        )}
        {enabledStats['kurtosis'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Kurtosis:</span>
            <span className="font-medium">{stats.kurtosis.toFixed(3)}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCategoricalStats = (stats: CategoricalStats) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {enabledStats['uniqueCount'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Unique Values:</span>
            <span className="font-medium">{stats.uniqueCount}</span>
          </div>
        )}
        {enabledStats['totalCount'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Total Count:</span>
            <span className="font-medium">{stats.totalCount}</span>
          </div>
        )}
        {enabledStats['entropy'] && (
          <div className="flex justify-between col-span-2">
            <span className="text-gray-600">Entropy:</span>
            <span className="font-medium">{stats.entropy.toFixed(3)} bits</span>
          </div>
        )}
      </div>
      {enabledStats['topValues'] && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Top Values:</h4>
          <div className="space-y-2">
            {stats.topValues.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600 truncate mr-2">{item.value}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{item.count}</span>
                  <span className="text-xs text-gray-500">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDateTimeStats = (stats: DateTimeStats) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        {enabledStats['minDate'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Min Date:</span>
            <span className="font-medium">{stats.minDate.toLocaleDateString()}</span>
          </div>
        )}
        {enabledStats['maxDate'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Max Date:</span>
            <span className="font-medium">{stats.maxDate.toLocaleDateString()}</span>
          </div>
        )}
        {enabledStats['dateRange'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Range:</span>
            <span className="font-medium">{stats.range} days</span>
          </div>
        )}
        {enabledStats['dateCount'] && (
          <div className="flex justify-between">
            <span className="text-gray-600">Total Count:</span>
            <span className="font-medium">{stats.totalCount}</span>
          </div>
        )}
      </div>
      {enabledStats['frequency'] && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Frequency Summary:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Days:</span>
              <span>{Object.keys(stats.frequencyByDay).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Weeks:</span>
              <span>{Object.keys(stats.frequencyByWeek).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Months:</span>
              <span>{Object.keys(stats.frequencyByMonth).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <h3 className="text-lg font-semibold text-gray-800">{columnName}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor()}`}>
          {dataType}
        </span>
      </div>
      
      <div className="mt-4">
        {dataType === 'numerical' && renderNumericalStats(stats as NumericalStats)}
        {dataType === 'categorical' && renderCategoricalStats(stats as CategoricalStats)}
        {dataType === 'datetime' && renderDateTimeStats(stats as DateTimeStats)}
      </div>
    </div>
  );
};