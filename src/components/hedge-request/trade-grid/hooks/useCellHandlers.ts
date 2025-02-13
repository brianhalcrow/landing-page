
import { CellKeyDownEvent, CellValueChangedEvent } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';

export const useCellHandlers = (rates?: Map<string, number>) => {
  const handleCellKeyDown = (e: CellKeyDownEvent) => {
    // Removing validation temporarily
  };

  const handleCellValueChanged = (e: CellValueChangedEvent<HedgeRequestDraftTrade>) => {
    // Removing validation temporarily
  };

  return { handleCellKeyDown, handleCellValueChanged };
};
