
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProcessSettings = () => {
  const queryClient = useQueryClient();

  const updateSettings = useMutation({
    mutationFn: async (updates: { entityId: string; processSettingId: number; settingValue: string }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('entity_process_settings')
          .upsert({
            entity_id: update.entityId,
            process_setting_id: update.processSettingId,
            setting_value: update.settingValue
          }, {
            onConflict: 'entity_id,process_setting_id'
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-process-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  });

  return { updateSettings };
};
