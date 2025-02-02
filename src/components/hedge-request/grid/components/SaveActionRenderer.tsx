import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ValidTableNames = 'hedge_request_draft' | 'hedge_request_draft_trades';

interface SaveActionRendererProps {
  data: any;
  context?: {
    table?: ValidTableNames;
  };
}

export const SaveActionRenderer = ({ data, context }: SaveActionRendererProps) => {
  const handleSaveRow = async () => {
    try {
      const { id, ...rowData } = data;
      const table = context?.table || 'hedge_request_draft';
      
      const { error } = await supabase
        .from(table)
        .insert([rowData])
        .select();

      if (error) throw error;
      toast.success('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSaveRow}
      className="h-8 w-8"
    >
      <Save className="h-4 w-4" />
    </Button>
  );
};