const HedgeRequestForm: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
      entity_name: "",
      cost_centre: "",
      country: "",
      geo_level_1: "",
      geo_level_2: "",
      geo_level_3: "",
      functional_currency: "",
      exposure_category_level_2: "",
      exposure_category_level_3: "",
      exposure_category_level_4: "",
      exposure_config: "",
      strategy: "",
      instrument: "",
    },
  });

  // ... rest of your hooks and handlers ...

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-14 gap-4">
          {/* Entity Selection */}
          <div className="col-span-2">
            <EntitySelection
              form={form}
              entities={entities || []}
              isLoading={isLoadingEntities}
              onEntitySelect={handleEntitySelection}
            />
          </div>
          
          {/* Cost Centre */}
          <FormField
            control={form.control}
            name="cost_centre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Centre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter cost centre" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter country" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Geo Level 1 */}
          <FormField
            control={form.control}
            name="geo_level_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geo Level 1</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter geo level 1" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Geo Level 2 */}
          <FormField
            control={form.control}
            name="geo_level_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geo Level 2</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter geo level 2" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Geo Level 3 */}
          <FormField
            control={form.control}
            name="geo_level_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geo Level 3</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter geo level 3" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Category Selection */}
          <div className="col-span-3">
            <CategorySelection
              form={form}
              criteriaData={criteriaData || []}
              getUniqueValues={(field: keyof Criteria) => {
                if (!criteriaData) return [];
                const values = new Set(criteriaData.map(item => item[field]).filter(Boolean));
                return Array.from(values);
              }}
            />
          </div>

          {/* Functional Currency */}
          <FormField
            control={form.control}
            name="functional_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Functional Currency</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Functional currency" readOnly />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Exposure Config */}
          <FormField
            control={form.control}
            name="exposure_config"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposure Config</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter exposure config" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Strategy */}
          <FormField
            control={form.control}
            name="strategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategy</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter strategy" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Instrument */}
          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrument</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter instrument" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;
