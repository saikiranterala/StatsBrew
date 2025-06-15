import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BoxPlot,
  ReferenceLine
} from 'recharts';
import { DataColumn, NumericalStats, CategoricalStats, DateTimeStats } from '../types/data';
import { calculateOptimalBins } from '../utils/dataAnalysis';

interface ChartsProps {
  columns: DataColumn[];
  numericalStats: { [columnName: string]: NumericalStats };
  categoricalStats: { [columnName: string]: CategoricalStats };
  dateTimeStats: { [columnName: string]: DateTimeStats };
}

const COLORS = ['#2563EB', '#0D9488', '#EA580C', '#DC2626', '#7C3AED', '#059669', '#D97706', '#BE185D'];

export const Charts: React.FC<ChartsProps> = ({ 
  columns, 
  numericalStats, 
  categoricalStats, 
  dateTimeStats 
}) => {
  const createHistogramData = (values: number[], bins: number) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;
    
    const histogramData = Array.from({ length: bins }, (_, i) => ({
      bin: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
      count: 0,
      range: [min + i * binSize, min + (i + 1) * binSize]
    }));
    
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
      histogramData[binIndex].count++;
    });
    
    return histogramData;
  };

  const createBoxPlotData = (stats: NumericalStats) => {
    return [{
      name: 'Data',
      min: stats.min,
      q1: stats.q1,
      median: stats.median,
      q3: stats.q3,
      max: stats.max,
      mean: stats.mean
    }];
  };

  const renderNumericalCharts = (column: DataColumn) => {
    const stats = numericalStats[column.name];
    if (!stats) return null;

    const numValues = column.cleanValues.map(Number).filter(n => !isNaN(n));
    const bins = calculateOptimalBins(numValues);
    const histogramData = createHistogramData(numValues, bins);
    const boxPlotData = createBoxPlotData(stats);

    return (
      <div key={column.name} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          {column.name} - Numerical Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Histogram */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Distribution (Histogram)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="bin" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Box Plot Representation */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Box Plot Summary</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Min:</span>
                <span className="font-medium">{stats.min.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Q1:</span>
                <span className="font-medium">{stats.q1.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-blue-100 px-2 py-1 rounded">
                <span className="text-sm text-blue-700 font-medium">Median:</span>
                <span className="font-bold text-blue-700">{stats.median.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Q3:</span>
                <span className="font-medium">{stats.q3.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Max:</span>
                <span className="font-medium">{stats.max.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm text-gray-600">Mean:</span>
                <span className="font-medium text-orange-600">{stats.mean.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoricalCharts = (column: DataColumn) => {
    const stats = categoricalStats[column.name];
    if (!stats) return null;

    const pieData = stats.topValues.slice(0, 8).map((item, index) => ({
      name: item.value,
      value: item.count,
      percentage: item.percentage
    }));

    const barData = stats.topValues.slice(0, 10);

    return (
      <div key={column.name} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          {column.name} - Categorical Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Distribution (Pie Chart)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Top Values (Bar Chart)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="value" 
                  type="category" 
                  width={80}
                  fontSize={12}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#0D9488" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderDateTimeCharts = (column: DataColumn) => {
    const stats = dateTimeStats[column.name];
    if (!stats) return null;

    const monthlyData = Object.entries(stats.frequencyByMonth).map(([month, count]) => ({
      period: month,
      count
    }));

    const weeklyData = Object.entries(stats.frequencyByWeek)
      .slice(0, 20)
      .map(([week, count]) => ({
        period: week,
        count
      }));

    return (
      <div key={column.name} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
          {column.name} - Date/Time Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Frequency */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Monthly Frequency</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7C3AED" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Trend */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Weekly Trend (Last 20 weeks)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#7C3AED" 
                  strokeWidth={2}
                  dot={{ fill: '#7C3AED' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Visualizations</h2>
        <p className="text-gray-600">Interactive charts and graphs for comprehensive data analysis</p>
      </div>

      {columns
        .filter(col => col.type === 'numerical')
        .map(renderNumericalCharts)}

      {columns
        .filter(col => col.type === 'categorical')
        .map(renderCategoricalCharts)}

      {columns
        .filter(col => col.type === 'datetime')
        .map(renderDateTimeCharts)}
    </div>
  );
};