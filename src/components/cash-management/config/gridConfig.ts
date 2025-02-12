
import { GridOptions } from 'ag-grid-community';

export const gridStyles = {
  '--ag-header-background-color': '#f8fafc',
  '--ag-header-foreground-color': '#1e293b',
  '--ag-header-cell-hover-background-color': '#f1f5f9',
  '--ag-row-hover-color': '#f8fafc',
  '--ag-selected-row-background-color': '#e2e8f0',
  '--ag-odd-row-background-color': '#ffffff',
  '--ag-row-border-color': '#e2e8f0',
  '--ag-cell-horizontal-padding': '1rem',
  '--ag-borders': 'none',
  '--ag-row-height': '48px',
  '--ag-header-height': '48px',
  '--ag-header-column-separator-display': 'block',
  '--ag-header-column-separator-height': '50%',
  '--ag-header-column-separator-width': '1px',
  '--ag-header-column-separator-color': '#e2e8f0'
} as const;

export const gridOptions: GridOptions = {
  suppressRowHoverHighlight: false,
  columnHoverHighlight: true,
  rowHeight: 48,
  headerHeight: 48,
  rowClass: 'grid-row',
  groupDefaultExpanded: 1,
  animateRows: true
};
