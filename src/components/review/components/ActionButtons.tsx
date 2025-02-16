
import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare } from "lucide-react";
import { ActionButtonsProps } from "../types/trade-request.types";

export const ActionButtons = ({ 
  request, 
  onApprove, 
  onReject, 
  showApprove, 
  showReject 
}: ActionButtonsProps) => {
  return (
    <div className="flex justify-center gap-2">
      {showApprove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onApprove(request)}
        >
          <CheckSquare className="h-4 w-4 text-green-500 hover:text-green-600" />
        </Button>
      )}
      {showReject && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReject(request)}
        >
          <XSquare className="h-4 w-4 text-red-500 hover:text-red-600" />
        </Button>
      )}
    </div>
  );
};
