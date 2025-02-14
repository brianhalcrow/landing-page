
import React from 'react';
import { Button } from "@/components/ui/button";
import { PenSquare, SaveAll } from "lucide-react";
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
        className="hover:bg-transparent"
      >
        {isEditing ? (
          <SaveAll className="h-4 w-4 text-blue-500 hover:text-blue-600" />
        ) : (
          <PenSquare className="h-4 w-4 text-gray-500 hover:text-gray-600" />
        )}
      </Button>
    </div>
  );
};

export default ActionsCellRenderer;
