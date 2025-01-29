import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";

interface EntityModeToggleProps {
  isNewEntity: boolean;
  onToggle: () => void;
}

const EntityModeToggle = ({ isNewEntity, onToggle }: EntityModeToggleProps) => {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-sm"
      >
        {isNewEntity ? (
          <><Search className="h-4 w-4 mr-2" /> Search Existing</>
        ) : (
          <><PlusCircle className="h-4 w-4 mr-2" /> Add New</>
        )}
      </Button>
    </div>
  );
};

export default EntityModeToggle;