import { DataColumn, NumericalStats, CategoricalStats, DateTimeStats, AnalysisResult } from '../types/data';

export function detectDataType(values: any[]): 'numerical' | 'categorical' | 'datetime' {
  const cleanValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (cleanValues.length === 0) return 'categorical';
  
  // Check for dates
  const dateRegex = /^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}/;
  const dateCount = cleanValues.filter(v => {
    if (typeof v === 'string' && dateRegex.test(v)) {
      const date = new Date(v);
      return !isNaN(date.getTime());
    }
    return false;
  }).length;
  
  if (dateCount / cleanValues.length > 0.8) return 'datetime';
  
  // Check for numerical
  const numCount = cleanValues.filter(v => !isNaN(Number(v)) && v !== '').length;
  if (numCount / cleanValues.length > 0.8) return 'numerical';
  
  return 'categorical';
}

export function calculateNumericalStats(values: number[]): NumericalStats {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
  const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
  
  // Mode calculation
  const frequency: { [key: number]: number } = {};
  values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
  const maxFreq = Math.max(...Object.values(frequency));
  const mode = Object.keys(frequency).filter(key => frequency[Number(key)] === maxFreq).map(Number);
  
  const min = sorted[0];
  const max = sorted[n - 1];
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const range = max - min;
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Additional statistics
  const skewness = calculateSkewness(values, mean, stdDev);
  const kurtosis = calculateKurtosis(values, mean, stdDev);
  
  return { 
    mean, 
    median, 
    mode, 
    min, 
    max, 
    q1, 
    q3, 
    range, 
    stdDev, 
    count: n,
    variance,
    skewness,
    kurtosis
  };
}

function calculateSkewness(values: number[], mean: number, stdDev: number): number {
  const n = values.length;
  const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

function calculateKurtosis(values: number[], mean: number, stdDev: number): number {
  const n = values.length;
  const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

export function calculateCategoricalStats(values: string[], topN: number = 10): CategoricalStats {
  const frequency: { [key: string]: number } = {};
  values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
  
  const topValues = Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, topN)
    .map(([value, count]) => ({
      value,
      count,
      percentage: (count / values.length) * 100
    }));
  
  // Calculate entropy
  const entropy = calculateEntropy(Object.values(frequency), values.length);
  
  return {
    topValues,
    uniqueCount: Object.keys(frequency).length,
    totalCount: values.length,
    entropy
  };
}

function calculateEntropy(frequencies: number[], total: number): number {
  return -frequencies.reduce((sum, freq) => {
    const p = freq / total;
    return sum + (p > 0 ? p * Math.log2(p) : 0);
  }, 0);
}

export function calculateDateTimeStats(values: Date[]): DateTimeStats {
  const sorted = [...values].sort((a, b) => a.getTime() - b.getTime());
  const minDate = sorted[0];
  const maxDate = sorted[sorted.length - 1];
  const range = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const frequencyByDay: { [key: string]: number } = {};
  const frequencyByWeek: { [key: string]: number } = {};
  const frequencyByMonth: { [key: string]: number } = {};
  
  values.forEach(date => {
    const day = date.toISOString().split('T')[0];
    const week = getWeekString(date);
    const month = date.toISOString().substring(0, 7);
    
    frequencyByDay[day] = (frequencyByDay[day] || 0) + 1;
    frequencyByWeek[week] = (frequencyByWeek[week] || 0) + 1;
    frequencyByMonth[month] = (frequencyByMonth[month] || 0) + 1;
  });
  
  return {
    minDate,
    maxDate,
    range,
    frequencyByDay,
    frequencyByWeek,
    frequencyByMonth,
    totalCount: values.length
  };
}

function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function calculateOptimalBins(values: number[]): number {
  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  
  // Freedman-Diaconis rule
  const binWidth = (2 * iqr) / Math.cbrt(n);
  const range = Math.max(...values) - Math.min(...values);
  const bins = Math.ceil(range / binWidth);
  
  return Math.max(5, Math.min(50, bins)); // Clamp between 5 and 50
}

export function calculateCorrelationMatrix(columns: DataColumn[]): { [key: string]: { [key: string]: number } } {
  const numericalColumns = columns.filter(col => col.type === 'numerical');
  const matrix: { [key: string]: { [key: string]: number } } = {};
  
  numericalColumns.forEach(col1 => {
    matrix[col1.name] = {};
    numericalColumns.forEach(col2 => {
      const values1 = col1.cleanValues.map(Number).filter(n => !isNaN(n));
      const values2 = col2.cleanValues.map(Number).filter(n => !isNaN(n));
      
      if (col1.name === col2.name) {
        matrix[col1.name][col2.name] = 1;
      } else {
        matrix[col1.name][col2.name] = calculatePearsonCorrelation(values1, values2);
      }
    });
  });
  
  return matrix;
}

function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  
  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);
  
  const meanX = xSlice.reduce((sum, val) => sum + val, 0) / n;
  const meanY = ySlice.reduce((sum, val) => sum + val, 0) / n;
  
  let numerator = 0;
  let sumXSquared = 0;
  let sumYSquared = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xSlice[i] - meanX;
    const yDiff = ySlice[i] - meanY;
    
    numerator += xDiff * yDiff;
    sumXSquared += xDiff * xDiff;
    sumYSquared += yDiff * yDiff;
  }
  
  const denominator = Math.sqrt(sumXSquared * sumYSquared);
  
  if (denominator === 0) return 0;
  
  return numerator / denominator;
}

export function processCSVData(csvData: any[]): AnalysisResult {
  if (csvData.length === 0) {
    return { columns: [], numericalStats: {}, categoricalStats: {}, dateTimeStats: {} };
  }
  
  const headers = Object.keys(csvData[0]);
  const columns: DataColumn[] = [];
  const numericalStats: { [columnName: string]: NumericalStats } = {};
  const categoricalStats: { [columnName: string]: CategoricalStats } = {};
  const dateTimeStats: { [columnName: string]: DateTimeStats } = {};
  
  headers.forEach(header => {
    const values = csvData.map(row => row[header]);
    const cleanValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const type = detectDataType(values);
    
    const column: DataColumn = {
      name: header,
      type,
      values,
      cleanValues
    };
    
    columns.push(column);
    
    if (type === 'numerical') {
      const numValues = cleanValues.map(Number).filter(n => !isNaN(n));
      if (numValues.length > 0) {
        numericalStats[header] = calculateNumericalStats(numValues);
      }
    } else if (type === 'categorical') {
      const strValues = cleanValues.map(String);
      if (strValues.length > 0) {
        categoricalStats[header] = calculateCategoricalStats(strValues);
      }
    } else if (type === 'datetime') {
      const dateValues = cleanValues.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
      if (dateValues.length > 0) {
        dateTimeStats[header] = calculateDateTimeStats(dateValues);
      }
    }
  });
  
  // Calculate correlation matrix
  const correlationMatrix = calculateCorrelationMatrix(columns);
  
  return { columns, numericalStats, categoricalStats, dateTimeStats, correlationMatrix };
}