import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import CashflowGroup from "./CashflowGroup";
import RealizedGroup from "./RealizedGroup";
import BalanceSheetGroup from "./BalanceSheetGroup";

interface FormCategoriesProps {
  form: UseFormReturn<FormValues>;
}

const FormCategories = ({ form }: FormCategoriesProps) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="border rounded-lg p-6 bg-green-50">
        <h2 className="text-xl font-semibold mb-4 text-green-900">Monetary</h2>
        <BalanceSheetGroup form={form} />
      </div>

      <div className="col-span-2 border rounded-lg p-6 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Cashflow</h2>
        <CashflowGroup form={form} />
      </div>

      <div className="border rounded-lg p-6 bg-purple-50">
        <h2 className="text-xl font-semibold mb-4 text-purple-900">Settlement</h2>
        <RealizedGroup form={form} />
      </div>
    </div>
  );
};

export default FormCategories;