
export const formatDate = (params: any) => {
  return params.value ? new Date(params.value).toLocaleString() : '';
};
