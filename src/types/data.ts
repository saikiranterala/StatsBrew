export interface DataColumn {
  name: string;
  type: 'numerical' | 'categorical' | 'datetime';
  values: any[];
  cleanValues: any[]; // Excluding nulls/blanks
}

export interface NumericalStats {
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  q1: number;
  q3: number;
  range: number;
  stdDev: number;
  count: number;
  variance: number;
  skewness: number;
  kurtosis: number;
}

export interface CategoricalStats {
  topValues: { value: string; count: number; percentage: number }[];
  uniqueCount: number;
  totalCount: number;
  entropy: number;
}

export interface DateTimeStats {
  minDate: Date;
  maxDate: Date;
  range: number; // in days
  frequencyByDay: { [key: string]: number };
  frequencyByWeek: { [key: string]: number };
  frequencyByMonth: { [key: string]: number };
  totalCount: number;
}

export interface AnalysisResult {
  columns: DataColumn[];
  numericalStats: { [columnName: string]: NumericalStats };
  categoricalStats: { [columnName: string]: CategoricalStats };
  dateTimeStats: { [columnName: string]: DateTimeStats };
  correlationMatrix?: { [key: string]: { [key: string]: number } };
}

export interface StatConfig {
  id: string;
  label: string;
  category: 'numerical' | 'categorical' | 'datetime' | 'general';
  enabled: boolean;
}

export interface ViewConfig {
  showOverview: boolean;
  showCharts: boolean;
  showCorrelation: boolean;
  selectedStats: { [key: string]: boolean };
}