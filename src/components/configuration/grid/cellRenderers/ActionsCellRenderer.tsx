
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, SaveAll } from "lucide-react";
import { ICellRendererParams } from 'ag-grid-community';

interface ActionsCellRendererProps extends ICellRendererParams {
  data: any;
  node: any;
  api: any;
  onEditClick: (id: string) => void;
  onSaveClick: (id: string) => void;
  currentlyEditing: string | null;
}

const ActionsCellRenderer = (props: ActionsCellRendererProps) => {
  const isEditing = props.data?.isEditing || false;
  const currentId = props.data?.counterparty_id || props.data?.entity_id;
  
  const handleClick = () => {
    if (!currentId) return;
    
    if (isEditing) {
      props.onSaveClick(currentId);
    } else {
      // Only allow editing if no other row is being edited
      if (!props.currentlyEditing || props.currentlyEditing === currentId) {
        props.onEditClick(currentId);
      }
    }
  };

  // Disable edit button if another row is being edited
  const isDisabled = !isEditing && props.currentlyEditing && props.currentlyEditing !== currentId;

  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          "hover:bg-transparent",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {isEditing ? (
          <SaveAll className="h-4 w-4 text-blue-500 hover:text-blue-600" />
        ) : (
          <Edit2 className="h-4 w-4 text-gray-500 hover:text-gray-600" />
        )}
      </Button>
    </div>
  );
};

export default ActionsCellRenderer;
