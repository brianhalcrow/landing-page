
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { useProcessSettings } from "../hooks/useProcessSettings";
import { toast } from "sonner";

interface ActionsCellRendererProps {
  data: any;
  node: any;
  api: any;
}

const ActionsCellRenderer = ({ data, node, api }: ActionsCellRendererProps) => {
  const { updateSettings } = useProcessSettings();

  const handleEditClick = () => {
    const updatedData = { ...data, isEditing: true };
    node.setData(updatedData);
    api.refreshCells({ rowNodes: [node] });
  };

  const handleSaveClick = async () => {
    try {
      // Get all setting changes
      const updates = Object.entries(data)
        .filter(([key, value]) => key.startsWith('setting_'))
        .map(([key, value]) => ({
          entityId: data.entity_id,
          processSettingId: parseInt(key.replace('setting_', '')),
          settingValue: value.toString()
        }));

      // Save changes
      await updateSettings.mutateAsync(updates);

      // Update row state
      const updatedData = { ...data, isEditing: false };
      node.setData(updatedData);
      api.refreshCells({ rowNodes: [node] });
      
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
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
