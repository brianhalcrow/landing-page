import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteEntityButtonProps {
  entityId: string;
  entityName: string;
  onDelete: () => void;
  disabled?: boolean;
}

const DeleteEntityButton = ({ 
  entityId, 
  entityName, 
  onDelete,
  disabled 
}: DeleteEntityButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("config_exposures")
        .delete()
        .eq("entity_id", entityId);

      if (error) throw error;

      toast.success(`Entity ${entityName} deleted successfully`);
      onDelete();
    } catch (error) {
      console.error("Error deleting entity:", error);
      toast.error("Failed to delete entity");
    } finally {
      setIsDeleting(false);
      setShowDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
        disabled={disabled || isDeleting}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete Entity"}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the entity{" "}
              <span className="font-semibold">{entityName}</span> and all associated
              configuration data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteEntityButton;