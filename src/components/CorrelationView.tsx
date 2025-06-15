import React from 'react';
import { AnalysisResult } from '../types/data';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface CorrelationViewProps {
  analysisResult: AnalysisResult;
}

export const CorrelationView: React.FC<CorrelationViewProps> = ({ analysisResult }) => {
  const numericalColumns = analysisResult.columns.filter(col => col.type === 'numerical');
  
  if (numericalColumns.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Insufficient Data</h3>
          <p className="text-gray-500">
            Correlation analysis requires at least 2 numerical columns.
          </p>
        </div>
      </div>
    );
  }

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'bg-red-500';
    if (abs >= 0.6) return 'bg-orange-500';
    if (abs >= 0.4) return 'bg-yellow-500';
    if (abs >= 0.2) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getCorrelationIntensity = (correlation: number) => {
    const abs = Math.abs(correlation);
    return Math.min(abs * 100, 100);
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'Very Strong';
    if (abs >= 0.6) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    if (abs >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  const correlationMatrix = analysisResult.correlationMatrix || {};
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Correlation Analysis</h2>
        <p className="text-gray-600">Explore relationships between numerical variables</p>
      </div>

      {/* Correlation Matrix Heatmap */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Correlation Matrix</h3>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${numericalColumns.length}, 80px)` }}>
              {/* Header row */}
              <div></div>
              {numericalColumns.map(col => (
                <div key={col.name} className="text-xs font-medium text-gray-600 p-2 text-center transform -rotate-45 origin-bottom-left">
                  {col.name.length > 8 ? col.name.substring(0, 8) + '...' : col.name}
                </div>
              ))}
              
              {/* Data rows */}
              {numericalColumns.map(rowCol => (
                <React.Fragment key={rowCol.name}>
                  <div className="text-xs font-medium text-gray-600 p-2 text-right pr-4">
                    {rowCol.name.length > 15 ? rowCol.name.substring(0, 15) + '...' : rowCol.name}
                  </div>
                  {numericalColumns.map(colCol => {
                    const correlation = correlationMatrix[rowCol.name]?.[colCol.name] || 0;
                    const isIdentity = rowCol.name === colCol.name;
                    
                    return (
                      <div
                        key={colCol.name}
                        className={`h-16 w-16 flex items-center justify-center text-xs font-medium rounded ${
                          isIdentity 
                            ? 'bg-gray-800 text-white' 
                            : `${getCorrelationColor(correlation)} text-white`
                        }`}
                        style={{
                          opacity: isIdentity ? 1 : 0.3 + (getCorrelationIntensity(correlation) / 100) * 0.7
                        }}
                        title={`${rowCol.name} vs ${colCol.name}: ${correlation.toFixed(3)}`}
                      >
                        {isIdentity ? '1.00' : correlation.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Very Strong (≥0.8)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Strong (≥0.6)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Moderate (≥0.4)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Weak (≥0.2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Very Weak (&lt;0.2)</span>
          </div>
        </div>
      </div>

      {/* Correlation Insights */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Correlations</h3>
        <div className="space-y-4">
          {numericalColumns.map(col1 => 
            numericalColumns.map(col2 => {
              if (col1.name >= col2.name) return null;
              const correlation = correlationMatrix[col1.name]?.[col2.name] || 0;
              const strength = getCorrelationStrength(correlation);
              
              if (Math.abs(correlation) < 0.3) return null;
              
              return (
                <div key={`${col1.name}-${col2.name}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">
                      {col1.name} ↔ {col2.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {strength} {correlation > 0 ? 'positive' : 'negative'} correlation
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${correlation > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {correlation.toFixed(3)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};