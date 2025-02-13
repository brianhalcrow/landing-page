
import { ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';

const ActionsCellRenderer = (props: ICellRendererParams) => {
  const isEditing = props.data?.isEditing;

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="h-8 w-8 p-0"
      >
        {isEditing ? (
          <Save className="h-4 w-4" />
        ) : (
          <Edit className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ActionsCellRenderer;
