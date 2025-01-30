import { Form } from "@/components/ui/form";
import { useConfigurationForm } from "@/hooks/useConfigurationForm";
import FormHeader from "./FormHeader";
import FormCategories from "./FormCategories";
import FormFooter from "./FormFooter";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ConfigurationForm = () => {
  const {
    form,
    entities,
    isLoadingEntities,
    isUpdating,
    formChanged,
    fetchExistingConfig,
    handleCsvUploadComplete,
    onSubmit,
    refetchEntities,
  } = useConfigurationForm();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && refetchEntities) {
        refetchEntities();
      }
    });

    // Check current auth status
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast.error('Authentication error. Please try logging in again.');
      }
    };
    
    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetchEntities]);

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
    } catch (error) {
      toast.error('Failed to save configuration. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormHeader 
          form={form}
          entities={entities}
          isLoadingEntities={isLoadingEntities}
          onFetchConfig={fetchExistingConfig}
          onUploadComplete={() => handleCsvUploadComplete()}
        />
        <FormCategories form={form} />
        <FormFooter 
          isUpdating={isUpdating}
          formChanged={formChanged}
        />
      </form>
    </Form>
  );
};

export default ConfigurationForm;