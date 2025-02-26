
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Save } from "lucide-react";
import { LoadDraftDialog } from "./LoadDraftDialog";
import type { ExistingHedgeRequest } from "../types";

interface FormHeaderProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  onLoadDraft: (draft: ExistingHedgeRequest) => void;
  progress: number;
}

export const FormHeader = ({ onSaveDraft, onSubmit, onLoadDraft, progress }: FormHeaderProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col items-end gap-4">
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
        <div className="flex items-center gap-2 w-[332px]"> {/* Width matches the 3 buttons above */}
          <Progress value={progress} className="flex-1" />
          <span className="text-sm text-gray-500 min-w-[4ch]">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
