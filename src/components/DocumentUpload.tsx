import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export function DocumentUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    if (file.type !== 'text/plain') {
      throw new Error('Only text files (.txt) are supported');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);
      console.log('Starting file upload process:', file.name);
      
      // Validate file
      validateFile(file);
      
      // Read text file content
      const text = await file.text();
      console.log('File content loaded, length:', text.length);

      setProgress(25);
      console.log('Sending to vector-operations');

      // Send to vector-operations function for processing
      const { data, error } = await supabase.functions.invoke('vector-operations', {
        body: {
          action: 'store',
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            content: text
          },
          metadata: { 
            filename: file.name,
            fileType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            status: 'processing'
          }
        }
      });

      if (error) throw error;

      setProgress(100);
      console.log('Document processed successfully:', data);

      toast({
        title: "Success",
        description: "Document uploaded and processed successfully",
      });
      
      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload and process document",
      });
    } finally {
      setLoading(false);
      setProgress(0);
      // Reset the file input using the ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Documents</h2>
        <div className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
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
          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-slate-500">
                {progress < 50 && "Processing file..."}
                {progress >= 50 && progress < 75 && "Generating embedding..."}
                {progress >= 75 && "Saving document..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}