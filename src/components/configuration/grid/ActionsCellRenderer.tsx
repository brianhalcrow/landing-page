import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface ActionsCellRendererProps {
  isEditing: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
}

const ActionsCellRenderer = ({ isEditing, onEditClick, onSaveClick }: ActionsCellRendererProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {isEditing ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSaveClick}
          className="h-8 w-8 p-0"
        >
          <Save className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditClick}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ActionsCellRenderer;