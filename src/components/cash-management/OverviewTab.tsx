import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const OverviewTab = () => {
  const columnDefs = useMemo(() => createColumnDefs(), []);
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('client_bank_account')
          .select('*')
          .order('entity_id', { ascending: true });
        if (error) {
          throw error;
        }
        setBankAccounts(data || []);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBankAccounts();
  }, []);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  // Add quick filter functionality
  const onFilterTextBoxChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  }, [gridApi]);

  if (loading) {
    return <Skeleton className="h-[calc(100vh-12rem)] w-full" />;
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Add search box */}
      <div className="mb-4">
        <input
          type="text"
          onChange={onFilterTextBoxChanged}
          placeholder="Search accounts..."
          className="p-2 border rounded w-64"
        />
      </div>
      <div 
        className="flex-grow ag-theme-alpine"
        style={{ 
          height: 'calc(100vh - 16rem)', // Adjusted for search box
          minHeight: '500px',
          width: '100%'
        }}
      >
        <GridStyles />
        <AgGridReact
          rowData={bankAccounts}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          rowSelection="multiple"
        />
      </div>
    </div>
  );
};
