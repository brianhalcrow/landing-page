import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import useForwardPointsData from './ForwardRates';
import useHedgeExposures from './HedgeExposures';
import enrichRates from './EnrichRates';

const FxRates = ({ baseCurrency, setBaseCurrency }) => {
  const termCurrencies = useMemo(() => {
    const allCurrencies = ['GBP', 'USD', 'EUR', 'AUD', 'CAD', 'CHF', 'DKK', 'JPY', 'NOK', 'SEK', 'SGD', 'CNY', 'COP', 'KWD', 'MXN', 'OMR', 'RON', 'SAR', 'THB'];
    return allCurrencies.filter(currency => currency !== baseCurrency);
  }, [baseCurrency]);

  const tenors = ['1M', '3M', '6M', '1Y'];

  const { data: forwardPoints, isLoading: loadingForwardPoints } = useForwardPointsData(baseCurrency, termCurrencies, tenors);
  const { data: hedgeExposures, isLoading: loadingHedgeExposures } = useHedgeExposures();

  const enrichedRates = useMemo(() => {
    return enrichRates(forwardPoints, hedgeExposures).map(rate => {
      // Extract only the "mid" value for tenor fields
      const tenorsProcessed = {};
      tenors.forEach(tenor => {
        tenorsProcessed[tenor] = rate[tenor]?.mid || null;
      });
      return { ...rate, ...tenorsProcessed };
    });
  }, [forwardPoints, hedgeExposures]);

  const columnDefs = useMemo(() => {
    if (!enrichedRates.length) return [];
    // Generate columns dynamically, excluding "all_in_mid" for tenors
    const keys = Object.keys(enrichedRates[0]);
    return keys.map(key => ({
      field: key,
      headerName: key.replace(/_/g, ' ').toUpperCase(),
      sortable: true,
      filter: true,
      width: 100,
    }));
  }, [enrichedRates]);

  if (loadingForwardPoints || loadingHedgeExposures) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ paddingLeft: '10px' }}>Select Base Currency: </label>
        <select value={baseCurrency} onChange={e => setBaseCurrency(e.target.value)}>
          {['GBP', 'USD', 'EUR'].map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={enrichedRates}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
          rowHeight={25}
        />
      </div>
    </div>
  );
};

export default FxRates;
