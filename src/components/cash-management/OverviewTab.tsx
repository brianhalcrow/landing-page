const OverviewTab = () => {
  const { onGridReady } = useGridConfig();
  const columnDefs = useMemo(() => {
    const cols = createColumnDefs();
    console.log('Column definitions:', cols); // Debug log
    return cols;
  }, []);

  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);

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
        console.log('Fetched data:', data); // Debug log
        setBankAccounts(data || []);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBankAccounts();
  }, []);

  const onFirstDataRendered = (params: any) => {
    console.log('Grid data rendered:', params.api.getDisplayedRowCount()); // Debug log
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div 
        className="flex-grow ag-theme-alpine"
        style={{ 
          height: 'calc(100vh - 12rem)',
          minHeight: '500px',
          width: '100%'
        }}
      >
        <GridStyles />
        <AgGridReact
          rowData={bankAccounts}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={0}
          suppressAggFuncInHeader={true}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          groupDisplayType="groupRows"
          groupMaintainOrder={true}
          suppressRowClickSelection={true}
          rowSelection="multiple"
          // Add these debug properties
          debug={true}
          rowGroupPanelShow="always"
        />
      </div>
    </div>
  );
};
