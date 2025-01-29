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
      if (currentValue) {
        // If checking main field, check both dependent fields
        form.setValue(config.dependentFields[0], true);
        form.setValue(config.dependentFields[1], true);
      } else {
        // Only allow unchecking main field if either dependent field is false
        const firstField = form.getValues(config.dependentFields[0]);
        const secondField = form.getValues(config.dependentFields[1]);
        if (!firstField || !secondField) {
          form.setValue(config.dependentFields[0], false);
          form.setValue(config.dependentFields[1], false);
        } else {
          // If both are true, prevent unchecking main field
          form.setValue(config.mainField, true);
        }
      }
    } else {
      // If unchecking either dependent field
      if (!currentValue) {
        // Uncheck main field if either dependent field is unchecked
        form.setValue(config.mainField, false);
      } else {
        // If both dependent fields are checked, check main field
        const otherField = field === config.dependentFields[0] ? config.dependentFields[1] : config.dependentFields[0];
        const otherValue = form.getValues(otherField);
        if (otherValue) {
          form.setValue(config.mainField, true);
        }
      }
    }
  };

  return { handleCheckboxChange };
};