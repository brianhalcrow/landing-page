import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../types";
import FormHeader from "./FormHeader";
import FormCategories from "./FormCategories";
import FormFooter from "./FormFooter";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ConfigurationForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
      entity_name: "",
      functional_currency: "",
      po: false,
      ap: false,
      ar: false,
      other: false,
      revenue: false,
      costs: false,
      net_income: false,
      ap_realized: false,
      ar_realized: false,
      fx_realized: false,
      net_monetary: false,
      monetary_assets: false,
      monetary_liabilities: false,
    },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Handle sign in if needed
        toast.success('Signed in successfully');
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
  }, []);

  const onSubmit = async (values: any) => {
    toast.info('Form submission disabled temporarily');
    console.log('Form values:', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormHeader 
          form={form}
          entities={[]}
          isLoadingEntities={false}
          onFetchConfig={() => {}}
          onUploadComplete={() => {}}
        />
        <FormCategories form={form} />
        <FormFooter 
          isUpdating={false}
          formChanged={false}
        />
      </form>
    </Form>
  );
};

export default ConfigurationForm;