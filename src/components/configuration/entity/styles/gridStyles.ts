
export const gridStyles = `
  .ag-theme-alpine {
    --ag-header-height: auto !important;
    --ag-header-group-height: auto !important;
    --ag-row-height: 24px !important;
  }

  /* Base cell styles */
  .ag-cell {
    display: flex !important;
    align-items: center !important;
    height: 24px !important;
    padding: 0 16px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  /* Header styles */
  .ag-header-cell {
    padding: 8px 0 !important;
    min-height: 50px !important;
  }

  .ag-header-cell.header-wrap {
    height: auto !important;
    min-height: 50px !important;
  }

  .ag-header-group-cell {
    font-weight: bold !important;
    height: auto !important;
    min-height: 50px !important;
    padding: 8px 0 !important;
  }

  /* Header alignment and wrapping */
  .header-center {
    text-align: center !important;
  }

  .header-center .ag-header-cell-label {
    justify-content: center !important;
    text-align: center !important;
  }

  .header-left {
    text-align: left !important;
  }

  .header-left .ag-header-cell-label {
    justify-content: flex-start !important;
    text-align: left !important;
    padding-left: 16px !important;
  }

  .header-wrap .ag-header-cell-label {
    white-space: normal !important;
    line-height: 1.2 !important;
    padding: 8px 4px !important;
    height: auto !important;
  }

  /* Cell alignment classes */
  .cell-center {
    justify-content: center !important;
  }

  .cell-left {
    justify-content: flex-start !important;
  }

  /* Action cell specific styles */
  .actions-cell {
    padding: 0 !important;
    justify-content: center !important;
  }
`;
