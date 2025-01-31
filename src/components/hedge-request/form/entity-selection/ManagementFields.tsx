import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { ManagementStructure } from "./types";
import CostCentreField from "./fields/CostCentreField";
import CountryField from "./fields/CountryField";

interface ManagementFieldsProps {
  form: UseFormReturn<FormValues>;
  managementStructures: ManagementStructure[];
  onCostCentreSelect: (costCentre: string) => void;
}

const ManagementFields = ({ 
  form, 
  managementStructures,
  onCostCentreSelect 
}: ManagementFieldsProps) => {
  return (
    <>
      <CostCentreField 
        form={form}
        managementStructures={managementStructures}
        onCostCentreSelect={onCostCentreSelect}
      />
      <CountryField form={form} />
    </>
  );
};

export default ManagementFields;