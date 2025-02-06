
export type ScheduleType = 'on_demand' | 'scheduled';
export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export interface ScheduleFormData {
  scheduleType: ScheduleType;
  frequency: FrequencyType;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  executionTimes: string[];
  timezone: string;
  parameters: Record<string, string>;
}

export interface ScheduleConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  processSettingId: number;
}
