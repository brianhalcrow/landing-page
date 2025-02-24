import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface EntityActionsProps {
  onAddGrid: (index: number) => void;
  onDeleteGrid: (index: number) => void;
  index: number;
  isDeleteDisabled: boolean;
}

export const EntityActions = ({ 
  onAddGrid, 
  onDeleteGrid, 
  index, 
  isDeleteDisabled 
}: EntityActionsProps) => {
  return (
    <div className="mt-4 flex gap-4">
      <Button
        onClick={() => onAddGrid(index)}
        variant="outline"
        size="sm"
        className="flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Entity
      </Button>
      <Button
        onClick={() => onDeleteGrid(index)}
        variant="outline"
        size="sm"
        className="flex items-center justify-center gap-2"
        disabled={isDeleteDisabled}
      >
        <Trash2 className="h-4 w-4" />
        Delete Entity
      </Button>
    </div>
  );
};