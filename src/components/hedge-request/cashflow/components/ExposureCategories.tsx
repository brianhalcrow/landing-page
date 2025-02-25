
import { ExposureConfig } from "../hooks/useExposureConfig";
import { Strategy } from "../hooks/useStrategies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExposureCategoriesProps {
  exposureConfigs: ExposureConfig[] | null;
  strategies: Strategy[] | null;
  selectedCategories: {
    l1: string;
    l2: string;
    l3: string;
    strategy: string;
  };
  onCategoryChange: (level: 'L1' | 'L2' | 'L3' | 'strategy', value: string) => void;
  getCategoryOptions: {
    l1: () => string[];
    l2: () => string[];
    l3: () => string[];
    strategies: () => Strategy[];
  };
}

export const ExposureCategories = ({
  selectedCategories,
  onCategoryChange,
  getCategoryOptions,
}: ExposureCategoriesProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Exposure Category L1</label>
        <Select 
          value={selectedCategories.l1} 
          onValueChange={(value) => onCategoryChange('L1', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {getCategoryOptions.l1().map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Exposure Category L2</label>
        <Select 
          value={selectedCategories.l2} 
          onValueChange={(value) => onCategoryChange('L2', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {getCategoryOptions.l2().map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Exposure Category L3</label>
        <Select 
          value={selectedCategories.l3} 
          onValueChange={(value) => onCategoryChange('L3', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select detail" />
          </SelectTrigger>
          <SelectContent>
            {getCategoryOptions.l3().map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Strategy</label>
        <Select 
          value={selectedCategories.strategy} 
          onValueChange={(value) => onCategoryChange('strategy', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            {getCategoryOptions.strategies().map(strategy => (
              <SelectItem key={strategy.strategy_id} value={strategy.strategy_name}>
                {strategy.strategy_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
