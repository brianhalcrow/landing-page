import { useCubeQuery as useBaseCubeQuery } from '@cubejs-client/react';

// Wrapper around the base useCubeQuery to add any custom logic
export const useCubeQuery = (query: any) => {
  const { resultSet, isLoading, error, progress } = useBaseCubeQuery(query);

  return {
    resultSet,
    isLoading,
    error,
    progress,
    // Optional: Add any additional helper methods
    getData: () => resultSet?.tableRow() || []
  };
};

// Example of a more specific query hook
export const useLineItemsCount = () => {
  return useCubeQuery({ 
    measures: ['LineItems.count'] 
  });
};