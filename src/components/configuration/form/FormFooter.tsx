import { Button } from "@/components/ui/button";

interface FormFooterProps {
  isUpdating: boolean;
  formChanged: boolean;
}

const FormFooter = ({ isUpdating, formChanged }: FormFooterProps) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button 
        type="submit"
        disabled={isUpdating && !formChanged}
      >
        {isUpdating ? "Update Configuration" : "Save Configuration"}
      </Button>
    </div>
  );
};

export default FormFooter;