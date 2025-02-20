
import React, { createContext, useContext, ReactNode } from "react";
import { CubeProvider as BaseCubeProvider } from "@cubejs-client/react";
import cubejs, { CubeApi } from "@cubejs-client/core";

// Initialize Cube API with minimal configuration and debug logging
const apiUrl = import.meta.env.VITE_CUBEJS_API_URL;
const apiSecret = import.meta.env.CUBEJS_API_SECRET;

console.log('Initializing Cube.js connection:', {
  apiUrl,
  authPresent: !!apiSecret
});

const cubeApi = cubejs({
  apiUrl,
  headers: {
    Authorization: `Bearer ${apiSecret}`
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
