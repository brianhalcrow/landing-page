
import { CubeMember } from '@cubejs-client/core';

export interface CubeContextType {
  isLoading: boolean;
  error: Error | null;
}

export interface QueryResult {
  resultSet: any;
  isLoading: boolean;
  error: Error | null;
  progress: any;
}

export interface DimensionMember extends CubeMember {
  value: string;
  label: string;
}
