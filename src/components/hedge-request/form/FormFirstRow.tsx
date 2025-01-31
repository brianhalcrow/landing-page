import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface FormFirstRowProps {
  form: UseFormReturn<FormValues>;
}

const FormFirstRow = ({ form }: FormFirstRowProps) => {
  return (
    <>
      {/* All fields moved to EntitySelection */}
    </>
  );
};

export default FormFirstRow;
