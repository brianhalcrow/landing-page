import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import JSZip from 'jszip';

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
    
    const allowedTypes = ['application/zip', 'text/plain', 'application/x-zip-compressed'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only zip archives and text files (.txt) are supported');
    }
  };

  const processTextFile = async (content: string, filename: string) => {
    console.log(`Processing text file: ${filename}, length: ${content.length}`);
    
    // Convert the text content to base64
    const base64Content = btoa(unescape(encodeURIComponent(content)));
    
    const { data, error } = await supabase.functions.invoke('vector-operations', {
      body: {
        action: 'store',
        file: {
          name: filename,
          type: 'text/plain',
          size: content.length,
          content: base64Content
        },
        metadata: { 
          filename: filename,
          fileType: 'text/plain',
          size: content.length,
          uploadedAt: new Date().toISOString(),
          status: 'processing'
        }
      }
    });

    if (error) throw error;
    return data;
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
      
      if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        const textFiles = Object.values(zipContent.files).filter(
          zipEntry => !zipEntry.dir && zipEntry.name.toLowerCase().endsWith('.txt')
        );

        if (textFiles.length === 0) {
          throw new Error('No text files found in the zip archive');
        }

        let processedFiles = 0;
        for (const zipEntry of textFiles) {
          const content = await zipEntry.async('string');
          await processTextFile(content, zipEntry.name);
          processedFiles++;
          setProgress((processedFiles / textFiles.length) * 100);
        }

        toast({
          title: "Success",
          description: `Processed ${processedFiles} text files from zip archive`,
        });
      } else {
        // Handle single text file
        const text = await file.text();
        setProgress(50);
        await processTextFile(text, file.name);
        setProgress(100);
        
        toast({
          title: "Success",
          description: "Document uploaded and processed successfully",
        });
      }
      
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
            accept=".txt,.zip"
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