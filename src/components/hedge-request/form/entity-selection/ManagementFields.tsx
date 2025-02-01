import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { ManagementStructure } from "./types";
import CostCentreField from "./fields/CostCentreField";

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
    <CostCentreField 
      form={form}
      managementStructures={managementStructures}
      onCostCentreSelect={onCostCentreSelect}
    />
  );
};

export default ManagementFields;