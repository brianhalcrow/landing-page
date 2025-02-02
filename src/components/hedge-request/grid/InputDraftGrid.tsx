import { DraftDataGrid } from './components/DraftDataGrid';
import { TradeDataGrid } from './components/TradeDataGrid';

export const InputDraftGrid = () => {
  return (
    <div className="space-y-4">
      <DraftDataGrid />
      <TradeDataGrid />
    </div>
  );
};

export default InputDraftGrid;