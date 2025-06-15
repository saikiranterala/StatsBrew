import React, { useState } from 'react';
import { ChevronDown, Filter, Check, X } from 'lucide-react';
import { DataColumn } from '../types/data';

interface ColumnSelectorProps {
  columns: DataColumn[];
  selectedColumns: string[];
  onSelectionChange: (selected: string[]) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  onSelectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleColumn = (columnName: string) => {
    if (selectedColumns.includes(columnName)) {
      onSelectionChange(selectedColumns.filter(name => name !== columnName));
    } else {
      onSelectionChange([...selectedColumns, columnName]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(columns.map(col => col.name));
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'numerical': return 'bg-blue-100 text-blue-800';
      case 'categorical': return 'bg-green-100 text-green-800';
      case 'datetime': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Columns ({selectedColumns.length}/{columns.length})
        </span>
        <ChevronDown className={`h-4 w-4 ml-2 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Select Columns</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto p-2">
            {columns.map(column => (
              <div
                key={column.name}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => handleToggleColumn(column.name)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {selectedColumns.includes(column.name) ? (
                      <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {column.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(column.type)}`}>
                    {column.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};