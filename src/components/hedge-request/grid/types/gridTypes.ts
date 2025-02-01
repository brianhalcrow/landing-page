import { HedgeRequestDraft } from '../types';

export interface GridProps {
  rowData: HedgeRequestDraft[];
  onRowDataChange: (newData: HedgeRequestDraft[]) => void;
}