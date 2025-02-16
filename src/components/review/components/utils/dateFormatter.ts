
import { format, parseISO } from 'date-fns';

export const formatDate = (params: any) => {
  if (!params.value) return '';
  try {
    const date = parseISO(params.value);
    return format(date, 'dd/MM/yy HH:mm');
  } catch (error) {
    return '';
  }
};

export const formatDateNoTime = (params: any) => {
  if (!params.value) return '';
  try {
    const date = parseISO(params.value);
    return format(date, 'dd/MM/yy');
  } catch (error) {
    return '';
  }
};
