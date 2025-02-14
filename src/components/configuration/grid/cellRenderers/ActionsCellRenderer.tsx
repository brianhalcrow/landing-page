
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";

interface ActionsCellRendererProps {
  isEditing: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
}

const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = ({
  isEditing,
  onEditClick,
  onSaveClick,
}) => {
  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={isEditing ? onSaveClick : onEditClick}
      >
        {isEditing ? (
          <Save className="h-4 w-4" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ActionsCellRenderer;
