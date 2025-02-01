import { AgGridReact } from 'ag-grid-react';
import { GridProps } from '../types/gridTypes';
import { EntityNameSelector } from '../selectors/EntityNameSelector';
import { CostCentreSelector } from '../selectors/CostCentreSelector';
import { ExposureCategoryL1Selector } from '../selectors/ExposureCategoryL1Selector';
import { ExposureCategoryL2Selector } from '../selectors/ExposureCategoryL2Selector';
import { ExposureCategoryL3Selector } from '../selectors/ExposureCategoryL3Selector';
import { useRef } from 'react';

const columnDefs = [
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    cellRenderer: EntityNameSelector,
    editable: false
  },
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'functional_currency',
    headerName: 'Functional Currency',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'cost_centre',
    headerName: 'Cost Centre',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    cellRenderer: CostCentreSelector,
    editable: false
  },
  {
    field: 'exposure_category_l1',
    headerName: 'Exposure Category L1',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: ExposureCategoryL1Selector,
    editable: false
  },
  {
    field: 'exposure_category_l2',
    headerName: 'Exposure Category L2',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: ExposureCategoryL2Selector,
    editable: false
  },
  {
    field: 'exposure_category_l3',
    headerName: 'Exposure Category L3',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: ExposureCategoryL3Selector,
    editable: false
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  }
];

const DraftDataGrid = ({ rowData, onRowDataChange }: GridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  return (
    <div className="w-full h-[300px] ag-theme-alpine">
      <style>
        {`
          .ag-header-center .ag-header-cell-label {
            justify-content: center;
          }
          .ag-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        `}
      </style>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        onCellValueChanged={(event) => {
          const newData = [...rowData];
          newData[event.rowIndex] = { 
            ...newData[event.rowIndex], 
            [event.colDef.field]: event.newValue 
          };
          onRowDataChange(newData);
        }}
      />
    </div>
  );
};

export default DraftDataGrid;