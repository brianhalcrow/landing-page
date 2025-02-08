
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function RecategorizeDocuments() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRecategorize = async () => {
    try {
      setLoading(true);
      console.log('Starting document recategorization');
      
      const { data, error } = await supabase.functions.invoke('recategorize-documents');
      
      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No response data received');
      }
      
      console.log('Recategorization results:', data);
      
      // Check if data indicates no documents need recategorization
      if (data.message === 'No documents to recategorize') {
        toast({
          title: "Information",
          description: "No uncategorized documents found. All documents are already categorized.",
        });
        return;
      }
      
      const resultsCount = data.results?.length ?? 0;
      toast({
        title: "Success",
        description: `Successfully processed ${resultsCount} documents`,
      });
    } catch (error: any) {
      console.error('Error recategorizing documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to recategorize documents",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Document Categories</h2>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Improve document categorization using AI analysis. This will analyze uncategorized documents and assign appropriate categories, sections, and difficulty levels.
          </p>
          <Button 
            onClick={handleRecategorize} 
            disabled={loading}
            className="w-fit"
          >
            {loading ? "Processing..." : "Recategorize Documents"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
