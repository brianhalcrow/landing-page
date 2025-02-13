import { HedgeRequestDraft } from '../types';

export interface GridProps {
  rowData: HedgeRequestDraft[];
  onRowDataChange: (newData: HedgeRequestDraft[]) => void;
}

export interface GridActionsProps {
  onAddRow: () => void;
  onSaveDraft: () => void;
  isDisabled: boolean;
}