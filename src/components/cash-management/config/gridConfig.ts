import { GridOptions } from 'ag-grid-enterprise';
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
  ['--ag-header-column-separator-color' as string]: '#e2e8f0',
  ['--ag-font-family' as string]: 'inherit',
  ['--ag-font-size' as string]: '14px',
  ['--ag-cell-horizontal-border' as string]: 'none',
  ['--ag-borders-critical' as string]: 'none',
  ['--ag-header-column-resize-handle-display' as string]: 'block',
  ['--ag-header-column-resize-handle-width' as string]: '4px',
  ['--ag-header-column-resize-handle-height' as string]: '50%',
  ['--ag-header-column-resize-handle-color' as string]: '#9ca3af',
  ['--ag-alpine-active-color' as string]: '#9b87f5',
  ['--ag-range-selection-border-color' as string]: '#9b87f5',
  ['--ag-range-selection-background-color' as string]: 'rgba(155, 135, 245, 0.1)',
  ['--ag-header-foreground-color' as string]: '#1e293b',
  ['--ag-secondary-foreground-color' as string]: '#64748b',
  ['--ag-disabled-foreground-color' as string]: '#94a3b8',
  ['--ag-background-color' as string]: '#ffffff',
  ['--ag-header-cell-moving-background-color' as string]: '#f8fafc',
  ['--ag-row-border-style' as string]: 'solid',
  ['--ag-chip-background-color' as string]: '#f1f5f9',
  ['--ag-input-focus-box-shadow' as string]: '0 0 0 2px rgba(155, 135, 245, 0.25)',
  ['--ag-input-focus-border-color' as string]: '#9b87f5',
  ['--ag-alpine-active-color' as string]: '#9b87f5',
  ['--ag-material-primary-color' as string]: '#9b87f5',
  ['--ag-checkbox-checked-color' as string]: '#9b87f5',
  ['--ag-checkbox-unchecked-color' as string]: '#64748b',
  ['--ag-checkbox-background-color' as string]: '#ffffff',
  ['--ag-checkbox-border-radius' as string]: '4px',
  ['--ag-menu-background-color' as string]: '#ffffff',
  ['--ag-menu-min-width' as string]: '200px',
  ['--ag-menu-padding' as string]: '0.5rem',
  ['--ag-popup-shadow' as string]: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  ['--ag-card-shadow' as string]: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  ['--ag-card-radius' as string]: '0.375rem',
  ['--ag-menu-option-padding' as string]: '0.5rem 1rem',
  ['--ag-menu-option-height' as string]: '32px',
  ['--ag-menu-option-hover-color' as string]: '#f8fafc',
  ['--ag-menu-separator-color' as string]: '#e2e8f0',
  ['--ag-menu-separator-height' as string]: '1px',
  ['--ag-selected-tab-underline-color' as string]: '#9b87f5',
  ['--ag-selected-tab-underline-width' as string]: '2px',
  ['--ag-selected-tab-underline-transition-speed' as string]: '0.3s',
  ['--ag-tab-min-width' as string]: '120px',
  ['--ag-subheader-background-color' as string]: '#f8fafc',
  ['--ag-control-panel-background-color' as string]: '#ffffff',
};

export const gridOptions: GridOptions = {
  suppressRowHoverHighlight: false,
  columnHoverHighlight: true,
  rowHeight: 48,
  headerHeight: 48,
  rowClass: 'grid-row',
  groupDefaultExpanded: 1,
  animateRows: true,
  suppressCellFocus: false,
  enableRangeSelection: true,
  enableCellTextSelection: true,
  suppressDragLeaveHidesColumns: true,
  suppressMakeColumnVisibleAfterUnGroup: true,
  rowSelection: 'multiple',
  suppressRowClickSelection: true,
  pagination: true,
  paginationPageSize: 100,
  suppressScrollOnNewData: true,
  domLayout: 'normal'
};
