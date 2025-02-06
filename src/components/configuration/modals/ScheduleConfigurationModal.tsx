
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ScheduleTypeSelect from '../schedule/ScheduleTypeSelect';
import FrequencySelect from '../schedule/FrequencySelect';
import DaySelector from '../schedule/DaySelector';
import TimeSelector from '../schedule/TimeSelector';
import { ScheduleFormData, ScheduleType, FrequencyType } from '../types/scheduleTypes';

interface ScheduleConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  processSettingId: number;
}

const ScheduleConfigurationModal = ({
  isOpen,
  onClose,
  entityId,
  processSettingId
}: ScheduleConfigurationModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ScheduleFormData>({
    scheduleType: 'on_demand',
    frequency: 'daily',
    executionTimes: ['09:00'],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    parameters: {}
  });

  // Fetch existing schedule configuration
  const { data: existingSchedule, isLoading } = useQuery({
    queryKey: ['schedule', entityId, processSettingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_definitions')
        .select(`
          *,
          schedule_details (*),
          schedule_parameters (*)
        `)
        .eq('entity_id', entityId)
        .eq('process_setting_id', processSettingId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Update schedule configuration
  const updateSchedule = useMutation({
    mutationFn: async (data: ScheduleFormData) => {
      const { error } = await supabase
        .from('schedule_definitions')
        .upsert({
          entity_id: entityId,
          process_setting_id: processSettingId,
          schedule_type: data.scheduleType,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      if (data.scheduleType === 'scheduled') {
        const { error: detailsError } = await supabase
          .from('schedule_details')
          .upsert({
            schedule_id: existingSchedule?.id,
            frequency: data.frequency,
            day_of_week: data.daysOfWeek,
            day_of_month: data.daysOfMonth,
            execution_time: data.executionTimes,
            timezone: data.timezone
          });

        if (detailsError) throw detailsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule', entityId, processSettingId]);
      toast.success('Schedule updated successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule');
    }
  });

  useEffect(() => {
    if (existingSchedule) {
      setFormData({
        scheduleType: existingSchedule.schedule_type,
        frequency: existingSchedule.schedule_details?.[0]?.frequency || 'daily',
        daysOfWeek: existingSchedule.schedule_details?.[0]?.day_of_week || [],
        daysOfMonth: existingSchedule.schedule_details?.[0]?.day_of_month || [],
        executionTimes: existingSchedule.schedule_details?.[0]?.execution_time || ['09:00'],
        timezone: existingSchedule.schedule_details?.[0]?.timezone || 
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        parameters: {}
      });
    }
  }, [existingSchedule]);

  const handleSave = () => {
    updateSchedule.mutate(formData);
  };

  const handleScheduleTypeChange = (type: ScheduleType) => {
    setFormData(prev => ({ ...prev, scheduleType: type }));
  };

  const handleFrequencyChange = (frequency: FrequencyType) => {
    setFormData(prev => ({ ...prev, frequency }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Schedule Configuration
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="space-y-6 p-6">
            <ScheduleTypeSelect
              value={formData.scheduleType}
              onChange={handleScheduleTypeChange}
            />

            {formData.scheduleType === 'scheduled' && (
              <div className="space-y-6">
                <FrequencySelect
                  value={formData.frequency}
                  onChange={handleFrequencyChange}
                />

                {formData.frequency === 'weekly' && (
                  <DaySelector
                    type="week"
                    selectedDays={formData.daysOfWeek || []}
                    onChange={(days) => setFormData(prev => ({ ...prev, daysOfWeek: days }))}
                  />
                )}

                {formData.frequency === 'monthly' && (
                  <DaySelector
                    type="month"
                    selectedDays={formData.daysOfMonth || []}
                    onChange={(days) => setFormData(prev => ({ ...prev, daysOfMonth: days }))}
                  />
                )}

                <TimeSelector
                  times={formData.executionTimes}
                  onChange={(times) => setFormData(prev => ({ ...prev, executionTimes: times }))}
                />
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || updateSchedule.isLoading}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleConfigurationModal;
