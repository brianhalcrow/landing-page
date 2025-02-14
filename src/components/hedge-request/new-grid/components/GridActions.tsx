
import { Button } from "@/components/ui/button";

interface GridActionsProps {
  onAddRow: () => void;
  onSave: () => void;
}

export const GridActions = ({ onAddRow, onSave }: GridActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onAddRow}>
        Add Row
      </Button>
      <Button onClick={onSave}>
        Save Trade Requests
      </Button>
    </div>
  );
};
