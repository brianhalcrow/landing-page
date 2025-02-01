import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { toast } from "sonner";

export const downloadCsv = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*");

    if (error) {
      console.error("Error fetching data:", error);
      toast.error(`Failed to download ${tableName} data`);
      return;
    }

    if (!data || data.length === 0) {
      toast.info("No data available to download");
      return;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${tableName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${tableName} data downloaded successfully`);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    toast.error("Failed to download CSV");
  }
};

export const uploadCsv = async (file: File, tableName: string) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const { error } = await supabase
            .from(tableName)
            .insert(results.data);

          if (error) {
            console.error("Error uploading data:", error);
            toast.error(`Failed to upload ${tableName} data`);
            reject(error);
            return;
          }

          toast.success(`${tableName} data uploaded successfully`);
          resolve(results.data);
        } catch (error) {
          console.error("Error in upload process:", error);
          toast.error("Failed to process CSV upload");
          reject(error);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
        reject(error);
      }
    });
  });
};