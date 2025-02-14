
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

  /* Editing styles */
  .row-editing {
    background-color: rgb(239 246 255) !important; /* bg-blue-50 */
  }

  .row-editing .ag-cell {
    background-color: rgb(239 246 255) !important; /* bg-blue-50 */
  }

  /* Header styles */
  .header-center {
    text-align: center !important;
  }

  .header-left {
    text-align: left !important;
  }

  .cell-center {
    justify-content: center !important;
  }

  .cell-left {
    justify-content: flex-start !important;
  }
`;
