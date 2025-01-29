import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import CheckboxField from "./CheckboxField";
import { FormMessage } from "@/components/ui/form";
import { useCheckboxGroup } from "@/hooks/useCheckboxGroup";

interface CheckboxGroupProps {
  form: UseFormReturn<FormValues>;
  title: string;
  titleColor: string;
  mainField: keyof FormValues;
  dependentFields: [keyof FormValues, keyof FormValues];
  labels: {
    main: string;
    first: string;
    second: string;
  };
  className?: string;
}

const CheckboxGroup = ({ 
  form, 
  title, 
  titleColor, 
  mainField, 
  dependentFields, 
  labels,
  className 
}: CheckboxGroupProps) => {
  const { handleCheckboxChange } = useCheckboxGroup(form, { mainField, dependentFields });

  return (
    <div className={className}>
      <h3 className={`text-lg font-medium mb-4 ${titleColor}`}>{title}</h3>
      <div className="space-y-3">
        <CheckboxField 
          form={form} 
          name={dependentFields[0]} 
          label={labels.first}
          onCheckedChange={() => handleCheckboxChange(dependentFields[0])}
        />
        <CheckboxField 
          form={form} 
          name={dependentFields[1]} 
          label={labels.second}
          onCheckedChange={() => handleCheckboxChange(dependentFields[1])}
        />
        <CheckboxField 
          form={form} 
          name={mainField} 
          label={labels.main}
          onCheckedChange={() => handleCheckboxChange(mainField)}
        />
        <FormMessage>{form.formState.errors[mainField]?.message}</FormMessage>
      </div>
    </div>
  );
};

export default CheckboxGroup;