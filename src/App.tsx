import React, { useState } from 'react';
import Papa from 'papaparse';
import { FileUpload } from './components/FileUpload';
import { StatsCard } from './components/StatsCard';
import { Charts } from './components/Charts';
import { ExportButton } from './components/ExportButton';
import { Sidebar } from './components/Sidebar';
import { CorrelationView } from './components/CorrelationView';
import { ColumnSelector } from './components/ColumnSelector';
import { processCSVData } from './utils/dataAnalysis';
import { AnalysisResult, StatConfig, ViewConfig } from './types/data';
import { BarChart3, Database, TrendingUp, Beaker } from 'lucide-react';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentView, setCurrentView] = useState<'overview' | 'correlation'>('overview');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // Default stat configurations
  const [statConfigs, setStatConfigs] = useState<StatConfig[]>([
    // Numerical stats
    { id: 'mean', label: 'Mean', category: 'numerical', enabled: true },
    { id: 'median', label: 'Median', category: 'numerical', enabled: true },
    { id: 'mode', label: 'Mode', category: 'numerical', enabled: true },
    { id: 'min', label: 'Minimum', category: 'numerical', enabled: true },
    { id: 'max', label: 'Maximum', category: 'numerical', enabled: true },
    { id: 'q1', label: 'Q1 (25th percentile)', category: 'numerical', enabled: true },
    { id: 'q3', label: 'Q3 (75th percentile)', category: 'numerical', enabled: true },
    { id: 'range', label: 'Range', category: 'numerical', enabled: true },
    { id: 'stdDev', label: 'Standard Deviation', category: 'numerical', enabled: true },
    { id: 'count', label: 'Count', category: 'numerical', enabled: true },
    { id: 'variance', label: 'Variance', category: 'numerical', enabled: false },
    { id: 'skewness', label: 'Skewness', category: 'numerical', enabled: false },
    { id: 'kurtosis', label: 'Kurtosis', category: 'numerical', enabled: false },
    
    // Categorical stats
    { id: 'uniqueCount', label: 'Unique Count', category: 'categorical', enabled: true },
    { id: 'totalCount', label: 'Total Count', category: 'categorical', enabled: true },
    { id: 'topValues', label: 'Top Values', category: 'categorical', enabled: true },
    { id: 'entropy', label: 'Entropy', category: 'categorical', enabled: false },
    
    // DateTime stats
    { id: 'minDate', label: 'Minimum Date', category: 'datetime', enabled: true },
    { id: 'maxDate', label: 'Maximum Date', category: 'datetime', enabled: true },
    { id: 'dateRange', label: 'Date Range', category: 'datetime', enabled: true },
    { id: 'dateCount', label: 'Date Count', category: 'datetime', enabled: true },
    { id: 'frequency', label: 'Frequency Analysis', category: 'datetime', enabled: true },
  ]);

  const [viewConfig, setViewConfig] = useState<ViewConfig>({
    showOverview: true,
    showCharts: true,
    showCorrelation: true,
    selectedStats: statConfigs.reduce((acc, config) => {
      acc[config.id] = config.enabled;
      return acc;
    }, {} as { [key: string]: boolean })
  });

  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    setError('');
    setFileName(file.name);

    Papa.parse(file, {
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            setError('Error parsing CSV file. Please check the file format.');
            setIsLoading(false);
            return;
          }

          const processedData = processCSVData(results.data as any[]);
          setAnalysisResult(processedData);
          setSelectedColumns(processedData.columns.map(col => col.name));
        } catch (err) {
          setError('Error processing data. Please try again.');
          console.error('Processing error:', err);
        } finally {
          setIsLoading(false);
        }
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        setError(`Error reading file: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

  const getColumnCounts = () => {
    if (!analysisResult) return { numerical: 0, categorical: 0, datetime: 0 };
    
    return {
      numerical: analysisResult.columns.filter(c => c.type === 'numerical').length,
      categorical: analysisResult.columns.filter(c => c.type === 'categorical').length,
      datetime: analysisResult.columns.filter(c => c.type === 'datetime').length
    };
  };

  const counts = getColumnCounts();
  const filteredColumns = analysisResult?.columns.filter(col => selectedColumns.includes(col.name)) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Sidebar */}
      {analysisResult && (
        <Sidebar
          viewConfig={viewConfig}
          onViewConfigChange={setViewConfig}
          statConfigs={statConfigs}
          onStatConfigChange={setStatConfigs}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 ${analysisResult ? 'ml-0' : ''}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Beaker className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">StatsBrew</h1>
                  <p className="text-gray-600">Professional data analysis and statistical insights</p>
                </div>
              </div>
              {analysisResult && (
                <div className="flex items-center space-x-4">
                  <ColumnSelector
                    columns={analysisResult.columns}
                    selectedColumns={selectedColumns}
                    onSelectionChange={setSelectedColumns}
                  />
                  <ExportButton analysisResult={analysisResult} fileName={fileName} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!analysisResult ? (
            <div className="text-center py-12">
              <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {currentView === 'overview' ? (
                <>
                  {/* Overview Cards */}
                  {viewConfig.showOverview && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Columns</p>
                            <p className="text-2xl font-bold text-gray-900">{analysisResult.columns.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Selected: {selectedColumns.length}</p>
                          </div>
                          <Database className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Numerical</p>
                            <p className="text-2xl font-bold text-blue-700">{counts.numerical}</p>
                            <p className="text-xs text-blue-500 mt-1">
                              {filteredColumns.filter(c => c.type === 'numerical').length} selected
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-blue-400" />
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Categorical</p>
                            <p className="text-2xl font-bold text-green-700">{counts.categorical}</p>
                            <p className="text-xs text-green-500 mt-1">
                              {filteredColumns.filter(c => c.type === 'categorical').length} selected
                            </p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-green-400" />
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Date/Time</p>
                            <p className="text-2xl font-bold text-purple-700">{counts.datetime}</p>
                            <p className="text-xs text-purple-500 mt-1">
                              {filteredColumns.filter(c => c.type === 'datetime').length} selected
                            </p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-purple-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Statistics Cards */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistical Analysis</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredColumns.map(column => {
                        let stats;
                        if (column.type === 'numerical') {
                          stats = analysisResult.numericalStats[column.name];
                        } else if (column.type === 'categorical') {
                          stats = analysisResult.categoricalStats[column.name];
                        } else if (column.type === 'datetime') {
                          stats = analysisResult.dateTimeStats[column.name];
                        }

                        if (!stats) return null;

                        return (
                          <StatsCard
                            key={column.name}
                            columnName={column.name}
                            dataType={column.type}
                            stats={stats}
                            enabledStats={viewConfig.selectedStats}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Charts */}
                  {viewConfig.showCharts && (
                    <Charts
                      columns={filteredColumns}
                      numericalStats={analysisResult.numericalStats}
                      categoricalStats={analysisResult.categoricalStats}
                      dateTimeStats={analysisResult.dateTimeStats}
                    />
                  )}
                </>
              ) : (
                <CorrelationView analysisResult={analysisResult} selectedColumns={selectedColumns} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;