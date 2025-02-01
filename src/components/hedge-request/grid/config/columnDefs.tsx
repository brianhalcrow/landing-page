import { ColDef } from 'ag-grid-community';
import { EntityNameSelector } from '../selectors/EntityNameSelector';
import { CostCentreSelector } from '../selectors/CostCentreSelector';
import { ExposureCategoryL1Selector } from '../selectors/ExposureCategoryL1Selector';
import { ExposureCategoryL2Selector } from '../selectors/ExposureCategoryL2Selector';
import { ExposureCategoryL3Selector } from '../selectors/ExposureCategoryL3Selector';
import { StrategySelector } from '../selectors/StrategySelector';
import { InstrumentSelector } from '../selectors/InstrumentSelector';
import { SaveActionRenderer } from '../components/SaveActionRenderer';

export const createColumnDefs = (validEntities: any): ColDef[] => [
  {
    field: 'id',
    headerName: 'ID',
    minWidth: 100,
    flex: 0.5,
    headerClass: 'ag-header-center',
    editable: false,
    valueFormatter: (params) => {
      return params.value ? `#${params.value}` : '';
    }
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    cellRenderer: EntityNameSelector,
    editable: false,
    cellRendererParams: {
      context: { validEntities }
    }
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
    field: 'strategy_description',
    headerName: 'Strategy',
    minWidth: 200,
    flex: 2,
    headerClass: 'ag-header-center',
    cellRenderer: StrategySelector,
    editable: false
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    cellRenderer: InstrumentSelector,
    editable: false
  },
  {
    headerName: 'Actions',
    minWidth: 100,
    flex: 0.5,
    headerClass: 'ag-header-center',
    cellRenderer: SaveActionRenderer,
    editable: false,
    sortable: false,
    filter: false
  }
];