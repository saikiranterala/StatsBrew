import React from 'react';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { AnalysisResult } from '../types/data';

interface ExportButtonProps {
  analysisResult: AnalysisResult;
  fileName: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ analysisResult, fileName }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.text('Data Analysis Report', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Source file: ${fileName}`, 20, yPosition);
    yPosition += 20;
    
    // Summary
    doc.setFontSize(16);
    doc.text('Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`Total columns: ${analysisResult.columns.length}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Numerical columns: ${analysisResult.columns.filter(c => c.type === 'numerical').length}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Categorical columns: ${analysisResult.columns.filter(c => c.type === 'categorical').length}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Date/Time columns: ${analysisResult.columns.filter(c => c.type === 'datetime').length}`, 20, yPosition);
    yPosition += 20;
    
    // Column details
    analysisResult.columns.forEach(column => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`${column.name} (${column.type})`, 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      
      if (column.type === 'numerical') {
        const stats = analysisResult.numericalStats[column.name];
        if (stats) {
          doc.text(`Mean: ${stats.mean.toFixed(2)}, Median: ${stats.median.toFixed(2)}`, 25, yPosition);
          yPosition += 5;
          doc.text(`Min: ${stats.min.toFixed(2)}, Max: ${stats.max.toFixed(2)}`, 25, yPosition);
          yPosition += 5;
          doc.text(`Std Dev: ${stats.stdDev.toFixed(2)}, Count: ${stats.count}`, 25, yPosition);
          yPosition += 10;
        }
      } else if (column.type === 'categorical') {
        const stats = analysisResult.categoricalStats[column.name];
        if (stats) {
          doc.text(`Unique values: ${stats.uniqueCount}, Total count: ${stats.totalCount}`, 25, yPosition);
          yPosition += 5;
          doc.text(`Top values: ${stats.topValues.slice(0, 3).map(v => v.value).join(', ')}`, 25, yPosition);
          yPosition += 10;
        }
      } else if (column.type === 'datetime') {
        const stats = analysisResult.dateTimeStats[column.name];
        if (stats) {
          doc.text(`Date range: ${stats.minDate.toLocaleDateString()} to ${stats.maxDate.toLocaleDateString()}`, 25, yPosition);
          yPosition += 5;
          doc.text(`Total count: ${stats.totalCount}, Range: ${stats.range} days`, 25, yPosition);
          yPosition += 10;
        }
      }
    });
    
    doc.save(`${fileName.replace('.csv', '')}_analysis.pdf`);
  };

  const exportToCSV = () => {
    let csvContent = 'Column Name,Data Type,Statistics\n';
    
    analysisResult.columns.forEach(column => {
      let statsString = '';
      
      if (column.type === 'numerical') {
        const stats = analysisResult.numericalStats[column.name];
        if (stats) {
          statsString = `Mean: ${stats.mean.toFixed(2)}, Median: ${stats.median.toFixed(2)}, Min: ${stats.min.toFixed(2)}, Max: ${stats.max.toFixed(2)}`;
        }
      } else if (column.type === 'categorical') {
        const stats = analysisResult.categoricalStats[column.name];
        if (stats) {
          statsString = `Unique: ${stats.uniqueCount}, Total: ${stats.totalCount}, Top: ${stats.topValues.slice(0, 3).map(v => v.value).join('; ')}`;
        }
      } else if (column.type === 'datetime') {
        const stats = analysisResult.dateTimeStats[column.name];
        if (stats) {
          statsString = `Range: ${stats.minDate.toLocaleDateString()} to ${stats.maxDate.toLocaleDateString()}, Count: ${stats.totalCount}`;
        }
      }
      
      csvContent += `"${column.name}","${column.type}","${statsString}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace('.csv', '')}_analysis.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-3">
      <button
        onClick={exportToPDF}
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </button>
      <button
        onClick={exportToCSV}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </button>
    </div>
  );
};