
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { LoadDraftDialog } from "./LoadDraftDialog";
import type { HedgeAccountingRequest } from "../types";

interface FormHeaderProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  onLoadDraft: (draft: HedgeAccountingRequest) => void;
}

export const FormHeader = ({ onSaveDraft, onSubmit, onLoadDraft }: FormHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Cashflow Hedge Documentation</h1>
      <div className="flex gap-3">
        <LoadDraftDialog onDraftSelect={onLoadDraft} />
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
