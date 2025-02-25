
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormHeaderProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export const FormHeader = ({ onSaveDraft, onSubmit }: FormHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Cashflow Hedge Documentation</h1>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
};
