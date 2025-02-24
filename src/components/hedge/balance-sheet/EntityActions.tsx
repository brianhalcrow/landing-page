
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

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
  isDeleteDisabled,
}: EntityActionsProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddGrid(index)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Entity
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDeleteGrid(index)}
        disabled={isDeleteDisabled}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete Entity
      </Button>
    </div>
  );
};
