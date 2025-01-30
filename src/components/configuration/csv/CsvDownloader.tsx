import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadConfigurations } from './csvUtils';

const CsvDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      toast.info('Preparing CSV download...');
      
      const csv = await downloadConfigurations();
      if (!csv) {
        toast.error('Failed to download CSV');
        return;
      }

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
    <Button 
      variant="outline" 
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? 'Downloading...' : 'Download CSV'}
    </Button>
  );
};

export default CsvDownloader;