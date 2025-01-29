import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";

interface EntityModeToggleProps {
  isNewEntity: boolean;
  onToggle: () => void;
}

const EntityModeToggle = ({ isNewEntity, onToggle }: EntityModeToggleProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="text-sm h-10"
    >
      {isNewEntity ? (
        <><Search className="h-4 w-4 mr-2" /> Search Existing</>
      ) : (
        <><PlusCircle className="h-4 w-4 mr-2" /> Add New Entity</>
      )}
    </Button>
  );
};

export default EntityModeToggle;