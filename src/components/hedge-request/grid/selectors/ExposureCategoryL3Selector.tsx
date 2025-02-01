import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface ExposureCategoryL3Props {
  data: any;
  value: string;
  node: any;
}

export const ExposureCategoryL3Selector = ({ data, value, node }: ExposureCategoryL3Props) => {
  const { data: exposureTypes } = useQuery({
    queryKey: ['exposure-types', data.entity_id, data.exposure_category_l1, data.exposure_category_l2],
    queryFn: async () => {
      if (!data.entity_id || !data.exposure_category_l1 || !data.exposure_category_l2) return [];
      
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

      return configData
        .map(item => item.exposure_types)
        .filter(type => 
          type.exposure_category_l1 === data.exposure_category_l1 &&
          type.exposure_category_l2 === data.exposure_category_l2
        );
    },
    enabled: !!(data.entity_id && data.exposure_category_l1 && data.exposure_category_l2)
  });

  const uniqueL3Categories = Array.from(new Set(exposureTypes?.map(type => type.exposure_category_l3) || []));

  // If only one L3 category exists, set it automatically
  if (uniqueL3Categories.length === 1 && !value) {
    node.setDataValue('exposure_category_l3', uniqueL3Categories[0]);
  }

  return uniqueL3Categories.length > 1 ? (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => node.setDataValue('exposure_category_l3', e.target.value)}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.exposure_category_l2}
      >
        {uniqueL3Categories.map((category: string) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  ) : (
    <span>{value}</span>
  );
};