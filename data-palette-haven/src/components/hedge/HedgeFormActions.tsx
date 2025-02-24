import { Button } from "@/components/ui/button";

interface HedgeFormActionsProps {
  onReset: () => void;
  isValid: boolean;
}

export const HedgeFormActions = ({ onReset, isValid }: HedgeFormActionsProps) => {
  return (
    <div className="mt-8 mb-8 flex justify-end space-x-4">
      <Button
        type="button"
        onClick={onReset}
        variant="outline"
      >
        Reset
      </Button>
      <Button type="submit">
        Save Draft
      </Button>
    </div>
  );
};