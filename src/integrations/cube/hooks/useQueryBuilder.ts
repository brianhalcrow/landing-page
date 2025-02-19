
import { useQuery } from '@cubejs-client/react';
import { QueryResult } from '../types/cube.types';

export const useQueryBuilder = (query: any): QueryResult => {
  const { resultSet, isLoading, error, progress } = useQuery(query);

  return {
    resultSet,
    isLoading,
    error,
    progress
  };
};

// Example query hook for configuration data
export const useConfigurationQuery = () => {
  return useQueryBuilder({
    measures: ['TradeRequests.count'],
    dimensions: [
      'TradeRequests.entityName',
      'TradeRequests.status'
    ],
    filters: [],
    timeDimensions: []
  });
};

// Example query hook for entity data
export const useEntityMetrics = () => {
  return useQueryBuilder({
    measures: ['Entities.total'],
    dimensions: [
      'Entities.entityName',
      'Entities.functionalCurrency'
    ],
    filters: [],
    timeDimensions: []
  });
};
