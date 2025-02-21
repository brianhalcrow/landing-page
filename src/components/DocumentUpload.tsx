
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileInput } from "./data-sources/file-upload/FileInput";
import { ProgressIndicator } from "./data-sources/file-upload/ProgressIndicator";
import { FileProcessor } from "./data-sources/file-upload/FileProcessor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DocumentUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);
      setCurrentFileName(file.name);
      
      FileProcessor.validateFile(file);
      
      if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        const processedFiles = await FileProcessor.processZipFile(file, setProgress);
        toast({
          title: "Success",
          description: `Processed ${processedFiles} files from zip archive`,
        });
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setProgress(50);
        await FileProcessor.processTextFile(text, file.name);
        setProgress(100);
        
        toast({
          title: "Success",
          description: "Document processed successfully",
        });
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

  const handleYoutubeUrlSubmit = async () => {
    if (!youtubeUrl.trim()) return;

    try {
      setLoading(true);
      setProgress(0);
      setCurrentFileName('YouTube Video');

      await FileProcessor.processYoutubeUrl(youtubeUrl);
      
      toast({
        title: "Success",
        description: "YouTube video transcript processed successfully",
      });

      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error('YouTube processing error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process YouTube video",
      });
    } finally {
      setLoading(false);
      setProgress(0);
      setCurrentFileName('');
      setYoutubeUrl('');
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Documents</h2>
        <div className="flex flex-col gap-4">
          <FileInput onFileSelect={handleFileUpload} loading={loading} />
          
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={loading}
            />
            <Button 
              onClick={handleYoutubeUrlSubmit}
              disabled={loading || !youtubeUrl.trim()}
            >
              Process Video
            </Button>
          </div>

          {loading && <ProgressIndicator progress={progress} fileName={currentFileName} />}
        </div>
      </div>
    </Card>
  );
}
