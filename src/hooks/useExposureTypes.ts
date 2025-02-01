export const useExposureTypes = () => {
  return useQuery<ExposureType[]>({
    queryKey: ['exposure-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exposure_types')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });
};
