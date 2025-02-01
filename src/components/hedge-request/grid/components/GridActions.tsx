import { Button } from '@/components/ui/button';
import { GridActionsProps } from '../types/gridTypes';

const GridActions = ({ onAddRow, onSaveDraft, isDisabled }: GridActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onAddRow}>Add Row</Button>
      <Button 
        onClick={onSaveDraft}
        disabled={isDisabled}
      >
        Save Draft
      </Button>
    </div>
  );
};

export default GridActions;