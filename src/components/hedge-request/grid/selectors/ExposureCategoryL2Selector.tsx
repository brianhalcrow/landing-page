import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface ExposureCategoryL2Props {
  data: any;
  value: string;
  node: any;
}

export const ExposureCategoryL2Selector = ({ data, value, node }: ExposureCategoryL2Props) => {
  const { data: exposureTypes, isLoading } = useQuery({
    queryKey: ['exposure-types', data.entity_id, data.exposure_category_l1],
    queryFn: async () => {
      if (!data.entity_id || !data.exposure_category_l1) return [];
      
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
        .filter(type => type.exposure_category_l1 === data.exposure_category_l1);
    },
    enabled: !!(data.entity_id && data.exposure_category_l1)
  });

  const uniqueL2Categories = Array.from(new Set(exposureTypes?.map(type => type.exposure_category_l2) || []));

  // Only update if we have data and the current value doesn't match
  if (!isLoading && uniqueL2Categories.length === 1 && !value) {
    setTimeout(() => {
      if (node && node.setData) {
        node.setData({
          ...data,
          exposure_category_l2: uniqueL2Categories[0],
          exposure_category_l3: ''
        });
      }
    }, 0);
    return <span>{uniqueL2Categories[0]}</span>;
  }

  if (uniqueL2Categories.length <= 1) {
    return <span>{value}</span>;
  }

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          const newValue = e.target.value;
          if (node && node.setData) {
            node.setData({
              ...data,
              exposure_category_l2: newValue,
              exposure_category_l3: ''
            });
          }
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.exposure_category_l1}
      >
        <option value="">Select Category L2</option>
        {uniqueL2Categories.map((category: string) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};