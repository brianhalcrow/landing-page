import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from 'papaparse';

const CsvOperations = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      toast.info('Processing CSV file...');
      
      Papa.parse(file, {
        complete: async (results) => {
          const data = results.data as any[];
          // Skip header row and filter out empty rows
          const rows = data.slice(1).filter(row => row.length > 1);
          
          let successCount = 0;
          let errorCount = 0;
          
          // Insert each row into the database
          for (const row of rows) {
            const [
              entity_id, entity_name, functional_currency, accounting_rate_method, is_active
            ] = row;

            console.log('Inserting row:', {
              entity_id,
              entity_name,
              functional_currency,
              accounting_rate_method,
              is_active: is_active === 'true'
            });

            const { error } = await supabase
              .from('entities')
              .upsert({
                entity_id,
                entity_name,
                functional_currency,
                accounting_rate_method,
                is_active: is_active === 'true',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (error) {
              console.error('Error uploading row:', error);
              errorCount++;
            } else {
              successCount++;
            }
          }
          
          if (errorCount === 0) {
            toast.success(`Successfully uploaded ${successCount} entities`);
          } else {
            toast.warning(`Uploaded ${successCount} entities with ${errorCount} errors`);
          }
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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      toast.info('Preparing CSV download...');
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .order('entity_name');

      if (error) throw error;

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'entities.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
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
      <Button 
        variant="outline" 
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading...' : 'Download CSV'}
      </Button>
    </div>
  );
};

export default CsvOperations;