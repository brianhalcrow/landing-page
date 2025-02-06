
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface ActionsCellRendererProps {
  data: any;
  node: any;
  api: any;
}

const ActionsCellRenderer = ({ data, node, api }: ActionsCellRendererProps) => {
  const handleEditClick = () => {
    const updatedData = { ...data, isEditing: true };
    node.setData(updatedData);
    api.refreshCells({ rowNodes: [node] });
  };

  const handleSaveClick = () => {
    const updatedData = { ...data, isEditing: false };
    node.setData(updatedData);
    api.refreshCells({ rowNodes: [node] });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {!data.isEditing ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveClick}
          className="h-8 w-8 p-0"
        >
          <Save className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ActionsCellRenderer;
