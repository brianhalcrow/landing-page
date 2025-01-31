import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../types";
import { fetchInstrumentsForStrategy, getUniqueInstruments } from "../utils/instrumentUtils";

export const useInstrumentField = (
  form: UseFormReturn<FormValues>,
  strategy: string | undefined,
  entityId: string | undefined,
  entityName: string | undefined
) => {
  const [instruments, setInstruments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset instrument when entity changes
    if (entityId || entityName) {
      form.setValue("instrument", "");
    }
  }, [entityId, entityName]);

  useEffect(() => {
    const loadInstruments = async () => {
      if (!strategy) {
        setInstruments([]);
        form.setValue("instrument", "");
        return;
      }

      setLoading(true);
      try {
        const data = await fetchInstrumentsForStrategy(strategy);
        const uniqueInstruments = getUniqueInstruments(data);
        setInstruments(uniqueInstruments);

        // Only auto-select if there's exactly one instrument AND we have a valid strategy
        if (uniqueInstruments.length === 1 && strategy) {
          // Add a small delay to ensure form is ready
          setTimeout(() => {
            console.log("Auto-selecting instrument:", uniqueInstruments[0]);
            form.setValue("instrument", uniqueInstruments[0], {
              shouldValidate: true,
              shouldDirty: true,
            });
          }, 100); // Increased delay for better reliability
        } else if (uniqueInstruments.length !== 1) {
          // Only reset if we don't have exactly one instrument
          form.setValue("instrument", "");
        }
      } catch (error) {
        console.error("Error in loadInstruments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInstruments();
  }, [strategy]);

  return { instruments, loading };
};