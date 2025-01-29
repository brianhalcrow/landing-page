import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";
import { FormValues } from "../types";

const CsvOperations = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const data = results.data as FormValues[];
          
          for (const row of data) {
            const { error } = await supabase
              .from("pre_trade_sfx_config_exposures")
              .upsert({
                entity_id: row.entity_id,
                entity_name: row.entity_id, // We'll get the name from the entity table
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

            if (error) throw error;
          }
          toast.success("CSV data uploaded successfully");
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast.error("Error parsing CSV file");
        },
      });
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Failed to upload CSV data");
    } finally {
      setIsUploading(false);
    }
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
    <div className="flex gap-4 mb-6">
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
      >
        {isDownloading ? "Downloading..." : "Download CSV"}
      </Button>
    </div>
  );
};

export default CsvOperations;