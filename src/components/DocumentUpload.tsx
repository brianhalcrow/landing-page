
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileInput } from "./data-sources/file-upload/FileInput";
import { ProgressIndicator } from "./data-sources/file-upload/ProgressIndicator";
import { FileProcessor } from "./data-sources/file-upload/FileProcessor";

export function DocumentUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);
      setCurrentFileName(file.name);
      console.log('Starting file upload process:', file.name, 'Type:', file.type);
      
      // Validate file
      FileProcessor.validateFile(file);
      
      if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        const processedFiles = await FileProcessor.processZipFile(file, setProgress);
        toast({
          title: "Success",
          description: `Processed ${processedFiles} files from zip archive`,
        });
      } else if (file.type === 'text/plain') {
        // Process single text file
        const text = await file.text();
        setProgress(50);
        await FileProcessor.processTextFile(text, file.name);
        setProgress(100);
        
        toast({
          title: "Success",
          description: "Text document processed successfully",
        });
      } else if (file.type === 'application/msword' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Processing doc/docx file...');
        // Process .doc or .docx file with granular progress
        try {
          const text = await FileProcessor.processDocFile(file, (docProgress) => {
            // Scale doc processing progress from 0-50%
            setProgress(Math.floor(docProgress * 0.5));
          });
          
          console.log('Doc processing completed, sending to text processor...');
          // Process the extracted text (50-100%)
          await FileProcessor.processTextFile(text, file.name, (textProgress) => {
            // Scale text processing progress from 50-100%
            setProgress(50 + Math.floor(textProgress * 0.5));
          });
          
          toast({
            title: "Success",
            description: "Document processed and vectorized successfully",
          });
        } catch (docError) {
          console.error('Document processing error:', docError);
          throw new Error(`Document processing failed: ${docError.message}`);
        }
      } else {
        throw new Error('Unsupported file type. Please upload a .txt, .doc, .docx file or a zip archive containing these files.');
      }
      
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
      setCurrentFileName('');
      event.target.value = '';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Documents</h2>
        <div className="flex flex-col gap-4">
          <FileInput onFileSelect={handleFileUpload} loading={loading} />
          {loading && <ProgressIndicator progress={progress} fileName={currentFileName} />}
        </div>
      </div>
    </Card>
  );
}
