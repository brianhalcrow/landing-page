
import React, { createContext, useContext, ReactNode } from "react";
import { CubeProvider as BaseCubeProvider } from "@cubejs-client/react";
import cubejs, { CubeApi } from "@cubejs-client/core";

// Initialize Cube API with environment variables and custom options
const cubeApi = cubejs({
  apiUrl: import.meta.env.VITE_CUBEJS_API_URL,
  options: {
    transport: {
      authorization: import.meta.env.CUBEJS_API_SECRET, // Add the API secret if needed
      headers: {
        'Content-Type': 'application/json',
      }
    }
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
