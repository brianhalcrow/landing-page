import { SaveActionRenderer } from '../components/SaveActionRenderer';
import { ColDef } from 'ag-grid-community';
import { HedgeRequestDraft } from '../types';

export const createColumnDefs = (validEntities?: any[]): ColDef<HedgeRequestDraft>[] => [
  {
    headerName: 'Actions',
    cellRenderer: SaveActionRenderer,
    cellRendererParams: {
      context: {
        table: 'hedge_request_draft'
      }
    },
    editable: false,
    filter: false,
    width: 100
  },
  {
    headerName: 'Entity ID',
    field: 'entity_id',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Entity Name',
    field: 'entity_name',
    editable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Functional Currency',
    field: 'functional_currency',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Cost Centre',
    field: 'cost_centre',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Exposure Category L1',
    field: 'exposure_category_l1',
    editable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Exposure Category L2',
    field: 'exposure_category_l2',
    editable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Exposure Category L3',
    field: 'exposure_category_l3',
    editable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Strategy Description',
    field: 'strategy_description',
    editable: true,
    filter: true,
    width: 250
  },
  {
    headerName: 'Instrument',
    field: 'instrument',
    editable: true,
    filter: true,
    width: 150
  }
];