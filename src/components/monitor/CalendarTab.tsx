
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

interface CurrencyHoliday {
  id: number;
  currency_code: string;
  holiday_date: string;
  holiday_name: string;
  holiday_type: string | null;
  description: string | null;
}

const CalendarTab = () => {
  const [holidays, setHolidays] = useState<CurrencyHoliday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const { data, error } = await supabase
          .from('currency_holidays')
          .select('*')
          .order('holiday_date', { ascending: true });

        if (error) throw error;
        setHolidays(data || []);
      } catch (error) {
        toast.error('Failed to load currency holidays');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  const columnDefs: ColDef[] = [
    {
      field: 'currency_code',
      headerName: 'Currency',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'holiday_date',
      headerName: 'Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        return params.value ? format(new Date(params.value), 'dd MMM yyyy') : '';
      },
    },
    {
      field: 'holiday_name',
      headerName: 'Holiday',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'holiday_type',
      headerName: 'Type',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
    },
  ];

  if (loading) {
    return <div>Loading calendar data...</div>;
  }

  return (
    <div className="h-[600px] w-full ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={holidays}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        pagination={true}
        paginationPageSize={15}
        animateRows={true}
      />
    </div>
  );
};

export default CalendarTab;
