
import React, { createContext, useContext, ReactNode } from "react";
import { CubeProvider as BaseCubeProvider } from "@cubejs-client/react";
import cubejs, { CubeApi } from "@cubejs-client/core";

// Log the API URL for debugging
console.log('Initializing Cube.js with API URL:', import.meta.env.VITE_CUBEJS_API_URL);

// Initialize Cube API with environment variables and custom options
const cubeApi = cubejs({
  apiUrl: import.meta.env.VITE_CUBEJS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.CUBEJS_API_SECRET}`,
  }
});

interface CubeProviderProps {
  children: ReactNode;
}

export const CubeContext = createContext<CubeApi | null>(null);

export const CubeProvider: React.FC<CubeProviderProps> = ({ children }) => {
  return (
    <BaseCubeProvider cubeApi={cubeApi}>
      <CubeContext.Provider value={cubeApi}>
        {children}
      </CubeContext.Provider>
    </BaseCubeProvider>
  );
};

export const useCube = () => {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error("useCube must be used within a CubeProvider");
  }
  return context;
};
