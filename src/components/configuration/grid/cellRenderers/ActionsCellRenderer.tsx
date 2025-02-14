
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { ICellRendererParams } from 'ag-grid-community';

interface ActionsCellRendererProps extends ICellRendererParams {
  data: any;
  node: any;
  api: any;
  onEditClick: (id: string) => void;
  onSaveClick: (id: string) => void;
}

const ActionsCellRenderer = (props: ActionsCellRendererProps) => {
  const isEditing = props.data?.isEditing || false;

  const handleClick = () => {
    const id = props.data?.counterparty_id || props.data?.entity_id;
    if (id) {
      if (isEditing) {
        props.onSaveClick(id);
      } else {
        props.onEditClick(id);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
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
