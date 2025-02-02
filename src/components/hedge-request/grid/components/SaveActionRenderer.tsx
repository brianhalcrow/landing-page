import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SaveActionRendererProps {
  data: any;
}

export const SaveActionRenderer = ({ data }: SaveActionRendererProps) => {
  const handleSaveRow = async () => {
    try {
      // Remove id if it's undefined (new row)
      const { id, ...rowData } = data;
      
      const { error } = await supabase
        .from('hedge_request_draft')
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