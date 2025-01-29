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
      // Parse CSV file
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
              entity_id, entity_name, functional_currency, po, ap, ar, other, revenue, costs,
              net_income, ap_realized, ar_realized, fx_realized, net_monetary,
              monetary_assets, monetary_liabilities
            ] = row;

            const { error } = await supabase
              .from('pre_trade_sfx_config_exposures')
              .upsert({
                entity_id,
                entity_name,
                functional_currency,
                po: po === 'true',
                ap: ap === 'true',
                ar: ar === 'true',
                other: other === 'true',
                revenue: revenue === 'true',
                costs: costs === 'true',
                net_income: net_income === 'true',
                ap_realized: ap_realized === 'true',
                ar_realized: ar_realized === 'true',
                fx_realized: fx_realized === 'true',
                net_monetary: net_monetary === 'true',
                monetary_assets: monetary_assets === 'true',
                monetary_liabilities: monetary_liabilities === 'true',
                created_at: new Date().toISOString(),
              });

            if (error) {
              console.error('Error uploading row:', error);
              errorCount++;
            } else {
              successCount++;
            }
          }
          
          if (errorCount === 0) {
            toast.success(`Successfully uploaded ${successCount} configurations`);
          } else {
            toast.warning(`Uploaded ${successCount} configurations with ${errorCount} errors`);
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
        .from('pre_trade_sfx_config_exposures')
        .select('*');

      if (error) throw error;

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exposures_config.csv';
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