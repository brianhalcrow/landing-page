import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface ExposureCategoryL1Props {
  data: any;
  value: string;
  node: any;
}

export const ExposureCategoryL1Selector = ({ data, value, node }: ExposureCategoryL1Props) => {
  const { data: exposureTypes } = useQuery({
    queryKey: ['exposure-types', data.entity_id],
    queryFn: async () => {
      if (!data.entity_id) return [];
      
      const { data: configData, error } = await supabase
        .from('entity_exposure_config')
        .select(`
          exposure_type_id,
          exposure_types (
            exposure_type_id,
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3
          )
        `)
        .eq('entity_id', data.entity_id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching exposure types:', error);
        toast.error('Failed to fetch exposure types');
        return [];
      }

      return configData.map(item => item.exposure_types);
    },
    enabled: !!data.entity_id
  });

  const uniqueL1Categories = Array.from(new Set(exposureTypes?.map(type => type.exposure_category_l1) || []));

  // If only one L1 category exists and no value is selected, set it automatically
  if (uniqueL1Categories.length === 1 && !value) {
    // Use setTimeout to ensure this runs after the current render cycle
    setTimeout(() => {
      node.setData({
        ...data,
        exposure_category_l1: uniqueL1Categories[0],
        exposure_category_l2: '',
        exposure_category_l3: ''
      });
    }, 0);
  }

  return uniqueL1Categories.length > 1 ? (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          node.setData({
            ...data,
            exposure_category_l1: e.target.value,
            exposure_category_l2: '',
            exposure_category_l3: ''
          });
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value="">Select Category L1</option>
        {uniqueL1Categories.map((category: string) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  ) : (
    <span>{value}</span>
  );
};