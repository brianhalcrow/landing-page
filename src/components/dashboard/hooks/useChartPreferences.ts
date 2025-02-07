
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";

const CHART_ID = 'hedge-requests-by-entity';

export const useChartPreferences = () => {
  const [containerWidth, setContainerWidth] = useState(300); // MIN_CHART_WIDTH
  const [position, setPosition] = useState({ x: 20, y: 20 });

  // First query to get the user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  // Fetch saved chart preferences
  const { data: chartPreferences } = useQuery({
    queryKey: ['chart-preferences', CHART_ID, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chart_preferences')
        .select('width, position_x, position_y')
        .eq('chart_id', CHART_ID)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching chart preferences:', error);
        throw error;
      }

      return data;
    }
  });

  // Debounced save preferences function
  const saveChartPreferences = useCallback(
    debounce(async (
      width: number,
      position_x: number, 
      position_y: number
    ) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('chart_preferences')
        .upsert({
          user_id: user.id,
          chart_id: CHART_ID,
          width: width.toString(),
          position_x,
          position_y
        }, {
          onConflict: 'user_id,chart_id'
        });

      if (error) {
        console.error('Error saving chart preferences:', error);
      }
    }, 300),
    [user?.id]
  );

  return {
    containerWidth,
    setContainerWidth,
    position,
    setPosition,
    chartPreferences,
    saveChartPreferences,
  };
};
