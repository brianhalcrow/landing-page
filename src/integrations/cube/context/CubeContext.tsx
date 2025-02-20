import React from "react";
import { CubeProvider as BaseCubeProvider } from "@cubejs-client/react";
import cube from "@cubejs-client/core";

// Initialize Cube API
const cubeApi = cube(import.meta.env.VITE_CUBEJS_API_SECRET || "", {
  apiUrl:
    import.meta.env.VITE_CUBEJS_API_URL ||
    "http://localhost:4000/cubejs-api/v1",
});
