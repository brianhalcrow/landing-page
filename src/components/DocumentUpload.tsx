
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileInput } from "./data-sources/file-upload/FileInput";
import { ProgressIndicator } from "./data-sources/file-upload/ProgressIndicator";
import { FileProcessor } from "./data-sources/file-upload/FileProcessor";

export function DocumentUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);
      console.log('Starting file upload process:', file.name);
      
      // Validate file
      FileProcessor.validateFile(file);
      
      if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        const processedFiles = await FileProcessor.processZipFile(file, setProgress);
        
        toast({
          title: "Success",
          description: `Processed ${processedFiles} text files from zip archive`,
        });
      } else {
        // Handle single text file
        const text = await file.text();
        setProgress(50);
        await FileProcessor.processTextFile(text, file.name);
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
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Documents</h2>
        <div className="flex flex-col gap-4">
          <FileInput onFileSelect={handleFileUpload} loading={loading} />
          {loading && <ProgressIndicator progress={progress} />}
        </div>
      </div>
    </Card>
  );
}
