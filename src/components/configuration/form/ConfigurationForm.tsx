import { Form } from "@/components/ui/form";
import { useConfigurationForm } from "@/hooks/useConfigurationForm";
import FormHeader from "./FormHeader";
import FormCategories from "./FormCategories";
import FormFooter from "./FormFooter";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (isLoadingEntities) {
    return <Skeleton className="h-[400px] w-full" />;
  }

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