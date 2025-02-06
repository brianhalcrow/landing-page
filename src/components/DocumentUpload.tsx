
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function DocumentUpload() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Read the file content
      const text = await file.text();
      
      // Call the vector-operations function to process and store the document
      const { data, error } = await supabase.functions.invoke('vector-operations', {
        body: {
          action: 'store',
          content: text,
          metadata: { filename: file.name }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded and processed successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload and process document",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Documents</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={loading}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          {loading && <div className="text-sm text-slate-500">Processing...</div>}
        </div>
      </div>
    </Card>
  );
}
