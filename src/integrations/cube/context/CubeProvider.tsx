
import React, { createContext, useContext } from 'react';
import cubejs from '@cubejs-client/core';
import { CubeProvider as CoreCubeProvider } from '@cubejs-client/react';
import { CubeContextType } from '../types/cube.types';

const CUBEJS_TOKEN = import.meta.env.VITE_CUBEJS_TOKEN;
const CUBEJS_API_URL = import.meta.env.VITE_CUBEJS_API_URL;

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: CUBEJS_API_URL
});

const CubeContext = createContext<CubeContextType>({
  isLoading: false,
  error: null
});

export const useCubeContext = () => useContext(CubeContext);

export const CubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CoreCubeProvider cubejsApi={cubejsApi}>
      {children}
    </CoreCubeProvider>
  );
};
