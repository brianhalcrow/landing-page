import { Form } from "@/components/ui/form";
import { useConfigurationForm } from "@/hooks/useConfigurationForm";
import FormHeader from "./FormHeader";
import FormCategories from "./FormCategories";
import FormFooter from "./FormFooter";

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
  } = useConfigurationForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormHeader 
          form={form}
          entities={entities}
          isLoadingEntities={isLoadingEntities}
          onFetchConfig={fetchExistingConfig}
          onUploadComplete={handleCsvUploadComplete}
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