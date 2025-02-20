
import React, { createContext, useContext, ReactNode } from "react";
import { CubeProvider as BaseCubeProvider } from "@cubejs-client/react";
import cubejs, { CubeApi } from "@cubejs-client/core";

// Initialize Cube API with environment variables and custom options
const cubeApi = cubejs({
  apiUrl: import.meta.env.VITE_CUBEJS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Adding Bearer token format for authorization
    'Authorization': `Bearer ${import.meta.env.CUBEJS_API_SECRET}`,
    'X-Forwarded-Proto': 'https'  // Force HTTPS
  },
  credentials: 'include'  // Add credentials inclusion
});

interface CubeProviderProps {
  children: ReactNode;
}

export const CubeContext = createContext<CubeApi | null>(null);

export const CubeProvider: React.FC<CubeProviderProps> = ({ children }) => {
  console.log('Cube API URL:', import.meta.env.VITE_CUBEJS_API_URL); // Add logging to verify URL
  console.log('Using HTTPS:', import.meta.env.VITE_CUBEJS_API_URL.startsWith('https')); // Debug log

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
