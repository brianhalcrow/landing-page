
import { GridOptions } from 'ag-grid-community';
import { CSSProperties } from 'react';

export const gridStyles: CSSProperties = {
  ['--ag-header-background-color' as string]: '#f8fafc',
  ['--ag-header-foreground-color' as string]: '#1e293b',
  ['--ag-header-cell-hover-background-color' as string]: '#f1f5f9',
  ['--ag-row-hover-color' as string]: '#f8fafc',
  ['--ag-selected-row-background-color' as string]: '#e2e8f0',
  ['--ag-odd-row-background-color' as string]: '#ffffff',
  ['--ag-row-border-color' as string]: '#e2e8f0',
  ['--ag-cell-horizontal-padding' as string]: '1rem',
  ['--ag-borders' as string]: 'none',
  ['--ag-row-height' as string]: '48px',
  ['--ag-header-height' as string]: '48px',
  ['--ag-header-column-separator-display' as string]: 'block',
  ['--ag-header-column-separator-height' as string]: '50%',
  ['--ag-header-column-separator-width' as string]: '1px',
  ['--ag-header-column-separator-color' as string]: '#e2e8f0'
};

export const gridOptions: GridOptions = {
  suppressRowHoverHighlight: false,
  columnHoverHighlight: true,
  rowHeight: 48,
  headerHeight: 48,
  rowClass: 'grid-row',
  groupDefaultExpanded: 1,
  animateRows: true
};
