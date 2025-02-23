
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
        setProgress(25); // Start processing
        console.log('Text file read, processing content...');
        
        try {
          await FileProcessor.processTextFile(text, file.name);
          setProgress(100);
          
          toast({
            title: "Success",
            description: "Text document processed successfully",
          });
        } catch (textError) {
          console.error('Text processing error:', textError);
          throw new Error(`Failed to process text: ${textError.message}`);
        }
      } else if (file.type === 'application/msword' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Processing doc/docx file...');
        try {
          const text = await FileProcessor.processDocFile(file, (docProgress) => {
            setProgress(Math.floor(docProgress * 0.4)); // 0-40% for doc processing
          });
          
          console.log('Doc processing completed, starting vectorization...');
          setProgress(50); // Document processed
          
          try {
            await FileProcessor.processTextFile(text, file.name);
            setProgress(100);
            
            toast({
              title: "Success",
              description: "Document processed and vectorized successfully",
            });
          } catch (vectorizeError) {
            console.error('Vectorization error:', vectorizeError);
            throw new Error(`Vectorization failed: ${vectorizeError.message}`);
          }
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
      setProgress(0);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload and process document",
      });
    } finally {
      setLoading(false);
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
