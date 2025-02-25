
import { Strategy } from "../hooks/useStrategies";
import { ExposureConfig } from "../hooks/useExposureConfig";
import { Entity } from "../hooks/useEntityData";

export interface CategorySelections {
  l1: string;
  l2: string;
  l3: string;
  strategy: string;
}

export interface CategoryOptions {
  l1: () => string[];
  l2: () => string[];
  l3: () => string[];
  strategies: () => Strategy[];
}
