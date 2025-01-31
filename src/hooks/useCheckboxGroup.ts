import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/configuration/types";

interface CheckboxGroupConfig {
  mainField: keyof FormValues;
  dependentFields: [keyof FormValues, keyof FormValues];
}

export const useCheckboxGroup = (form: UseFormReturn<FormValues>, config: CheckboxGroupConfig) => {
  const handleCheckboxChange = (field: keyof FormValues) => {
    const currentValue = form.getValues(field);
    
    if (field === config.mainField) {
      // If checking the main field (net_monetary or net_income)
      if (currentValue) {
        // When checking main field, uncheck both dependent fields
        form.setValue(config.dependentFields[0], false);
        form.setValue(config.dependentFields[1], false);
      }
    } else {
      // If checking/unchecking either dependent field
      if (currentValue) {
        // When checking a dependent field, uncheck the main field
        form.setValue(config.mainField, false);
        
        // Optional: You might want to validate the other dependent field
        const otherField = field === config.dependentFields[0] 
          ? config.dependentFields[1] 
          : config.dependentFields[0];
        
        // If the other dependent field is also checked, you might want to handle that case
        const otherFieldValue = form.getValues(otherField);
        if (otherFieldValue) {
          // Both dependent fields are now checked, which is allowed
          // The main field remains unchecked
        }
      }
    }
  };

  return { handleCheckboxChange };
};