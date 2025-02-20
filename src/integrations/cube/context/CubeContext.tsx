
import React, { createContext, useContext, ReactNode } from "react";
import { CubeProvider as BaseCubeProvider } from "@cubejs-client/react";
import cubejs from "@cubejs-client/core";

// Initialize Cube API with environment variables
const cubeApi = cubejs(import.meta.env.CUBEJS_API_SECRET || "", {
  apiUrl: import.meta.env.VITE_CUBEJS_API_URL || "http://localhost:4000/cubejs-api/v1",
});

interface CubeProviderProps {
  children: ReactNode;
}

export const CubeContext = createContext<typeof cubeApi | null>(null);

export const CubeProvider: React.FC<CubeProviderProps> = ({ children }) => {
  return (
    <BaseCubeProvider cubejsApi={cubeApi}>
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
