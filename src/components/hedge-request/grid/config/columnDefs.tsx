import { SaveActionRenderer } from '../components/SaveActionRenderer';
import { ColDef } from 'ag-grid-community';
import { HedgeRequestDraft } from '../types';
import { ValidEntity } from '../types';
import { EntityNameSelector } from '../selectors/EntityNameSelector';
import { ExposureCategoryL1Selector } from '../selectors/ExposureCategoryL1Selector';
import { ExposureCategoryL2Selector } from '../selectors/ExposureCategoryL2Selector';
import { ExposureCategoryL3Selector } from '../selectors/ExposureCategoryL3Selector';
import { CostCentreSelector } from '../selectors/CostCentreSelector';
import { StrategySelector } from '../selectors/StrategySelector';
import { InstrumentSelector } from '../selectors/InstrumentSelector';

export const createColumnDefs = (validEntities?: ValidEntity[]): ColDef<HedgeRequestDraft>[] => [
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
    cellRenderer: EntityNameSelector,
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
    cellRenderer: CostCentreSelector,
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Exposure Category L1',
    field: 'exposure_category_l1',
    cellRenderer: ExposureCategoryL1Selector,
    editable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Exposure Category L2',
    field: 'exposure_category_l2',
    cellRenderer: ExposureCategoryL2Selector,
    editable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Exposure Category L3',
    field: 'exposure_category_l3',
    cellRenderer: ExposureCategoryL3Selector,
    editable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Strategy Description',
    field: 'strategy_description',
    cellRenderer: StrategySelector,
    editable: true,
    filter: true,
    width: 250
  },
  {
    headerName: 'Instrument',
    field: 'instrument',
    cellRenderer: InstrumentSelector,
    editable: true,
    filter: true,
    width: 150
  }
];