
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Settings2 } from 'lucide-react';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date Settings
                </h3>
                {/* Date settings content will go here */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Date configuration options will be available soon
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Settings
                </h3>
                {/* Time settings content will go here */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Time configuration options will be available soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleConfigurationModal;
