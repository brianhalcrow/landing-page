import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";
import { FormValues } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CsvOperationsProps {
  onUploadComplete?: (updatedEntityIds: string[]) => void;
}

const CsvOperations = ({ onUploadComplete }: CsvOperationsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [pendingCsvData, setPendingCsvData] = useState<FormValues[]>([]);

  const processCsvUpload = async (data: FormValues[]) => {
    setIsUploading(true);
    const updatedEntityIds: string[] = [];
    try {
      // Process each row
      for (const row of data) {
        // Validate required entity_id
        if (!row.entity_id) {
          console.error("Row missing entity_id:", row);
          throw new Error("All rows must have an entity_id");
        }

        updatedEntityIds.push(row.entity_id);

        // Delete existing record if it exists
        const { error: deleteError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .delete()
          .eq("entity_id", row.entity_id);

        if (deleteError) {
          console.error("Error deleting existing record:", deleteError);
          throw deleteError;
        }

        // Insert new record
        const { error: insertError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .insert({
            entity_id: row.entity_id,
            entity_name: row.entity_id,
            po: row.po || false,
            ap: row.ap || false,
            ar: row.ar || false,
            other: row.other || false,
            revenue: row.revenue || false,
            costs: row.costs || false,
            net_income: row.net_income || false,
            ap_realized: row.ap_realized || false,
            ar_realized: row.ar_realized || false,
            fx_realized: row.fx_realized || false,
            net_monetary: row.net_monetary || false,
            monetary_assets: row.monetary_assets || false,
            monetary_liabilities: row.monetary_liabilities || false,
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error("Error inserting new record:", insertError);
          throw insertError;
        }
      }
      toast.success("CSV data uploaded successfully");
      // Notify parent component about the upload completion
      onUploadComplete?.(updatedEntityIds);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload CSV data");
    } finally {
      setIsUploading(false);
      setPendingCsvData([]);
      setShowOverwriteDialog(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // This tells Papa Parse to use the first row as headers
      skipEmptyLines: true, // Skip empty lines
      complete: async (results) => {
        // Filter out empty rows and validate data
        const data = (results.data as FormValues[])
          .filter(row => row.entity_id && Object.keys(row).length > 0);
        
        if (data.length === 0) {
          toast.error("No valid data found in CSV file");
          return;
        }
        
        // Check if any of the entities already have configurations
        const { data: existingConfigs, error } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .select("entity_id")
          .in("entity_id", data.map(row => row.entity_id));

        if (error) {
          console.error("Error checking existing configurations:", error);
          toast.error("Error checking existing configurations");
          return;
        }

        if (existingConfigs.length > 0) {
          setPendingCsvData(data);
          setShowOverwriteDialog(true);
        } else {
          processCsvUpload(data);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.error("Error parsing CSV file");
      },
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_exposures")
        .select("*");

      if (error) throw error;

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hedge_configurations.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV data");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csvUpload"
          />
          <label htmlFor="csvUpload">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              size="sm"
              asChild
            >
              <span>{isUploading ? "Uploading..." : "Upload CSV"}</span>
            </Button>
          </label>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleDownload}
          disabled={isDownloading}
          size="sm"
        >
          {isDownloading ? "Downloading..." : "Download CSV"}
        </Button>
      </div>

      <AlertDialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite Existing Configurations?</AlertDialogTitle>
            <AlertDialogDescription>
              Some entities in this CSV already have existing configurations. 
              Proceeding will overwrite their current settings. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingCsvData([])}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => processCsvUpload(pendingCsvData)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CsvOperations;