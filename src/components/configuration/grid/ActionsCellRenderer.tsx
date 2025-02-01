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
      {!isEditing ? (
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <Edit className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={onSaveClick}>
          <Save className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ActionsCellRenderer;