import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Papa from 'papaparse';
import { processUploadedData, checkExistingConfigs } from './csvUtils';

interface CsvUploaderProps {
  onUploadComplete: (updatedEntityIds: string[]) => void;
}

const CsvUploader = ({ onUploadComplete }: CsvUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      toast.info('Processing CSV file...');
      
      Papa.parse(file, {
        complete: async (results) => {
          const data = results.data as any[];
          
          // Check for existing configurations
          const entityIds = data.slice(1).map(row => row[0]).filter(Boolean);
          const hasExisting = await checkExistingConfigs(entityIds);
          
          if (hasExisting) {
            const confirmed = window.confirm(
              'Some entities already have configurations. Do you want to overwrite them?'
            );
            if (!confirmed) {
              toast.info('Upload cancelled');
              return;
            }
          }
          
          const updatedEntityIds = await processUploadedData(data);
          onUploadComplete(updatedEntityIds);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse CSV file');
        },
      });
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast.error('Failed to upload CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload">
        <Button 
          variant="outline" 
          disabled={isUploading}
          asChild
        >
          <span>{isUploading ? 'Uploading...' : 'Upload CSV'}</span>
        </Button>
      </label>
    </>
  );
};

export default CsvUploader;