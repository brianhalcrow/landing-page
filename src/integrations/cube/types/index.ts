import { Query, ResultSet } from '@cubejs-client/core';

// Type for Cube.js query
export type CubeQuery = Query;

// Type for Cube.js result set
export type CubeResultSet = ResultSet;

// Helper types for common query patterns
export type MeasureQuery = {
  measures: string[];
  dimensions?: string[];
  filters?: Array<{
    dimension: string;
    operator: string;
    values: string[];
  }>;
};

// Example of a specific query type
export type LineItemsCountQuery = {
  measures: ['LineItems.count'];
};

// Utility type for query results
export type QueryResult<T = any> = {
  data: T[];
  total: number;
};